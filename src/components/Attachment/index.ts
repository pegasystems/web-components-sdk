import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';
import { Utils } from '../../helpers/utils';
import download from "downloadjs";
// NOTE: you need to import ANY component you may render.

import '@lion/button/define';
import '../designSystemExtension/SummaryList';
import '../designSystemExtension/ProgressIndicator';

// import the component's styles as HTML with <style>
import { attachmentStyles } from './attachment-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('attachment-component')
class Attachment extends BridgeBase {


  label: string = "";
  value: any;
  bRequired: boolean = false;
  bReadonly: boolean = false;
  bDisabled: boolean = false;
  bVisible: boolean = true;


  @property( {attribute: false, type: Boolean} ) bLoading = false;
  @property( {attribute: false, type: Boolean} ) bShowSelector = true;
  @property( {attribute: false, type: Boolean} ) bShowJustDelete = false;


  annotatedLabel: Object = {};

  arFiles: Array<any> = [];
  arFileList: Array<any> = [];
  removeFileFromList: any;

  arMenuList: Array<any> = [];



  att_valueRef: any;
  att_categoryName: string = "";

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // setup this component's styling...
    this.theComponentStyleTemplate = attachmentStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    this.removeFileFromList = { onClick: this._removeFileFromList.bind(this) }


    //let configProps: any = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.updateSelf();
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

  }
  
  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug){ debugger; }

    let configProps: any = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());

    const { value, validatemessage, label, helperText } = configProps;

    if (configProps["required"] != null) {
      this.bRequired = Utils.getBooleanValue(configProps["required"]);
    }


    // Add asterisk to label if the field is required
    if (this.bRequired) {
      this.label = `${this.label} *`;
      this.annotatedLabel = html`<span>${this.label} <super style="color: var(--app-warning-color-dark); font-weight: var(--app-form-required-color)">*</super></span>`;
    } else {
      this.annotatedLabel = this.label;
    }

    if (configProps["visibility"] != null) {
      this.bVisible = Utils.getBooleanValue(configProps["visibility"]);
    }

     // disabled
     if (configProps["disabled"] != undefined) {
      this.bDisabled = Utils.getBooleanValue(configProps["disabled"]);
    }
       
    if (configProps["readOnly"] != null) {
      this.bReadonly = Utils.getBooleanValue(configProps["readOnly"]);
    } 

    this.label = label;
    this.value = value;

    /* this is a temporary fix because required is supposed to be passed as a boolean and NOT as a string */
    let { required, disabled } = configProps;
    [required, disabled] = [required, disabled].map(
      (prop) => prop === true || (typeof prop === "string" && prop === "true")
    );
  

    this.att_categoryName = "";
    if (value && value.pyCategoryName) {
      this.att_categoryName = value.pyCategoryName;
    }
  
    this.att_valueRef = this.thePConn.getStateProps().value;
    this.att_valueRef = this.att_valueRef.indexOf(".") === 0 ? this.att_valueRef.substring(1) : this.att_valueRef;

    let fileTemp: any = {};
  
    if (value && value.pxResults && +value.pyCount > 0) {
      fileTemp = this.buildFilePropsFromResponse(value.pxResults[0]);

      if (fileTemp.responseProps) {
        if (!this.thePConn.attachmentsInfo) {
          this.thePConn.attachmentsInfo = {
            type: "File",
            attachmentFieldName: this.att_valueRef,
            category: this.att_categoryName
          };
        }
  
        if (
          fileTemp.responseProps.pzInsKey &&
          !fileTemp.responseProps.pzInsKey.includes("temp")
        ) {

          fileTemp.props.type = fileTemp.responseProps.pyMimeFileExtension;
          fileTemp.props.mimeType = fileTemp.responseProps.pyMimeFileExtension;
          fileTemp.props.ID = fileTemp.responseProps.pzInsKey;

          // create the actions for the "more" menu on the attachment
          let arMenuList = new Array();
          let oMenu: any = {};

          oMenu.icon = "download";
          oMenu.text = "Download";
          oMenu.onClick = () => { this._downloadFileFromList(this.value.pxResults[0])}
          arMenuList.push(oMenu);
          oMenu = {};
          oMenu.icon = "trash";
          oMenu.text = "Delete";
          oMenu.onClick = () => { this._removeFileFromList(this.arFileList[0])}
          arMenuList.push(oMenu);
       
          
          this.arFileList = new Array();
          this.arFileList.push(this.getNewListUtilityItemProps({
            att: fileTemp.props,
            downloadFile: null,
            cancelFile: null,
            deleteFile: null,
            removeFile: null
          }));

          this.arFileList[0].actions = arMenuList;

          this.bShowSelector = false;
        }
      }
    }


  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) { console.log(`${this.theComponentName}: onStateChange`); }
    if (this.bDebug){ debugger; }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  getAttachmentHtml() {
    const aHtml = html`
      <span slot="label">${this.annotatedLabel}</span>
      
      ${this.bShowSelector?
      html`
          <div class="psdk-modal-file-selector">
          <input hidden type="file" #uploader id="upload-input" @change="${this.uploadMyFiles}"/>

          ${this.bLoading?
            html`
            <progress-extension ></progress-extension>
            `
            :
            html``
            }
            
          ${this.bDisabled?
          html`
          <lion-button class="btn btn-link" disabled @click="${this._onFileLoad}">
              Upload file
          </lion-button>`
          :
          html`
          <lion-button class="btn btn-link"  @click="${this._onFileLoad}">
              Upload file
          </lion-button>`}
 
        </div>
      `
      :
      html``}

      ${this.arFileList != null && this.arFileList.length > 0?
      html `
        ${this.bShowJustDelete?
        html`
          <div class="psdk-attachment-list">
            <summary-list-extension .arItems="${this.arFileList}" menuIconOverride="trash" .menuIconOverrideAction="${this.removeFileFromList}"></summary-list-extension>
          </div>
        `
        :
        html`
          <div class="psdk-attachment-list">
            <summary-list-extension .arItems="${this.arFileList}" .menuIconOverrideAction="${this.removeFileFromList}"></summary-list-extension>
          </div>
        `}
      `
      :
      html``}

    `;


    return aHtml;
    
  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    const sContent = html`${this.getAttachmentHtml()}`;

    let arHtml: Array<any> = [];


    arHtml.push(attachmentStyles);
    arHtml.push(sContent);


    return arHtml;

  }

  _downloadFileFromList(fileObj: any) {
    PCore.getAttachmentUtils()
      .downloadAttachment(fileObj.pzInsKey, this.thePConn.getContextName())
      .then((content) => {
        const extension = fileObj.pyAttachName.split(".").pop();
        this.fileDownload(content.data, fileObj.pyFileName, extension);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  fileDownload = (data, fileName, ext) => {
    const file = ext ? `${fileName}.${ext}` : fileName;
    download(atob(data), file);
  };

  getCurrentAttachmentsList(context) {
    return PCore.getStoreValue('.attachmentsList', 'context_data', context) || [];
  }

  _removeFileFromList(item: any) {
    const fileIndex = this.arFileList.findIndex(element => element?.id === item?.id);
    if (PCore.getPCoreVersion()?.includes('8.7')) {
      if (this.value && this.value.pxResults[0]) {
        this.thePConn.attachmentsInfo = {
          type: "File",
          attachmentFieldName: this.att_valueRef,
          delete: true
        };
      }
      if (fileIndex > -1) { this.arFileList.splice(fileIndex, 1) };
      
    } else {
      const attachmentsList = [];
      const currentAttachmentList = this.getCurrentAttachmentsList(this.thePConn.getContextName()).filter(
        (f) => f.label !== this.att_valueRef
      );
      if (this.value && this.value.pxResults && +this.value.pyCount > 0) {
        const deletedFile = {
          type: "File",
          label: this.att_valueRef,
          delete: true,
          responseProps: {
            pzInsKey: this.arFileList[fileIndex].id
          },
        };
        // updating the redux store to help form-handler in passing the data to delete the file from server
        PCore.getStateUtils().updateState(
          this.thePConn.getContextName(),
          'attachmentsList',
          [...currentAttachmentList, deletedFile],
          {
            pageReference: 'context_data',
            isArrayDeepMerge: false
          }
        );
      } else {
        PCore.getStateUtils().updateState(
          this.thePConn.getContextName(),
          'attachmentsList',
          [...currentAttachmentList, ...attachmentsList],
          {
            pageReference: 'context_data',
            isArrayDeepMerge: false
          }
        );
      }
      if (fileIndex > -1) { this.arFileList.splice(fileIndex, 1) };
    }
    this.bShowSelector = this.arFileList?.length > 0 ? false : true;
    this.requestUpdate();
  }

  uploadMyFiles($event) {
    //alert($event.target.files[0]); // outputs the first file
    this.arFiles = this.getFiles($event.target.files);



    // convert FileList to an array
    let myFiles = Array.from(this.arFiles);



    if (myFiles.length == 1) {

      this.bLoading = true;

      PCore.getAttachmentUtils()
        .uploadAttachment(
          myFiles[0],
          this.onUploadProgress.bind(this),
          this.errorHandler,
          this.thePConn.getContextName()
        )
        .then((fileRes) => {
          
          let reqObj;
          if (PCore.getPCoreVersion()?.includes('8.7')) {
            reqObj = {
              type: "File",
              attachmentFieldName: this.att_valueRef,
              category: this.att_categoryName,
              ID: fileRes.ID
            };
            this.thePConn.attachmentsInfo = reqObj;
          } else {
            reqObj = {
              type: "File",
              label: this.att_valueRef,
              category: this.att_categoryName,
              handle: fileRes.ID,
              ID: fileRes.clientFileID
            };
            PCore.getStateUtils().updateState(
              this.thePConn.getContextName(),
              'attachmentsList',
              [reqObj],
              {
                pageReference: 'context_data',
                isArrayDeepMerge: false
              }
            );
          }
  
          const fieldName = this.thePConn.getStateProps().value;
          const context = this.thePConn.getContextName();


          PCore.getMessageManager().clearMessages({
            type: PCore.getConstants().MESSAGES.MESSAGES_TYPE_ERROR,
            property: fieldName,
            pageReference: this.thePConn.getPageReference(),
            context
          });

          this.bShowSelector = false;
          myFiles[0].meta = "File uplooaded successfully";
          this.arFileList = myFiles.map((att) => {
            return this.getNewListUtilityItemProps({
              att,
              downloadFile: null,
              cancelFile: null,
              deleteFile: null,
              removeFile: null
            });
          });

          this.bShowJustDelete = true;
          this.bLoading = false;

          this.requestUpdate();



        })
         
        .catch((error) => {
          // just catching the rethrown error at uploadAttachment
          // to handle Unhandled rejections
        });
    }

 
  
  

    
    
  }


  getNewListUtilityItemProps = ({
    att,
    cancelFile,
    downloadFile,
    deleteFile,
    removeFile
  }) => {
    let actions;
    let isDownloadable = false;
  
    if (att.progress && att.progress !== 100) {
      actions = [
        {
          id: `Cancel-${att.ID}`,
          text: "Cancel",
          icon: "times",
          onClick: cancelFile
        }
      ];
    } else if (att.links) {
      const isFile = att.type === "FILE";
      const ID = att.ID.replace(/\s/gi, "");
      const actionsMap = new Map([
        [
          "download",
          {
            id: `download-${ID}`,
            text: isFile ? "Download" : "Open",
            icon: isFile ? "download" : "open",
            onClick: downloadFile
          }
        ],
        [
          "delete",
          {
            id: `Delete-${ID}`,
            text: "Delete",
            icon: "trash",
            onClick: deleteFile
          }
        ]
      ]);
      actions = [];
      actionsMap.forEach((action, actionKey) => {
        if (att.links[actionKey]) {
          actions.push(action);
        }
      });
      isDownloadable = att.links.download;
    } else if (att.error) {
      actions = [
        {
          id: `Remove-${att.ID}`,
          text: "Remove",
          icon: "trash",
          onClick: removeFile
        }
      ];
    }
  
    return {
      id: att.ID,
      visual: {
        icon: Utils.getIconForAttachment(att),
        progress: att.progress == 100 ? undefined: att.progress,
      },
      primary: {
        type: att.type,
        name: att.name,
        icon: "trash",
        click: removeFile,
      },
      secondary: {
        text: att.meta
      },
      actions
    };
  }

  _onFileLoad(event:any) {
    event.target.parentElement.getElementsByTagName("input")[0].click();
  }

  onUploadProgress(ev) {



  }

  errorHandler() {

  }

  getFiles(arFiles: Array<any>): Array<any> {

    return this.setNewFiles(arFiles);
  }

  setNewFiles(arFiles, current = []) {

    let index = 0;
    for (let file of arFiles) {
      if (!this.validateMaxSize(file, 5)) {
        file.error = true;
        file.meta = "File is too big. Max allowed size is 5MB.";
      }
      file.mimeType = file.type;
      file.icon = Utils.getIconFromFileType(file.type);
      file.ID = `${new Date().getTime()}I${index}`;
      index++;
    }

    return arFiles;
  }

  validateMaxSize(fileObj, maxSizeInMB) : boolean {
    const fileSize = (fileObj.size / 1048576).toFixed(2);
    return fileSize < maxSizeInMB;
  }


 buildFilePropsFromResponse(respObj) {
    return {
      props: {
        meta: `${respObj.pyCategoryName}, ${respObj.pxCreateOperator}`,
        name: respObj.pyAttachName,
        icon: Utils.getIconFromFileType(respObj.pyMimeFileExtension)
      },
      responseProps: {
        ...respObj
      }
    };
  }

}

export default Attachment;