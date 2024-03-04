import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
import { Utils } from '../../../helpers/utils';
import download from "downloadjs";
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { fileUtilityStyles } from './file-utility-styles';

import '../../designSystemExtension/ListUtility';
import '../../designSystemExtension/SummaryList';
import '../../ActionButtons';




// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('file-utility-component')
class FileUtility extends BridgeBase {

  arFullListAttachments: Array<any> = [];

  lu_name: string = "";
  lu_icon: string = "";
  lu_bLoading: boolean = false;
  lu_count: number = 0;
  lu_arActions: Array<any> = [];
  lu_arItems: Array<any> = [];

  va_arItems: Array<any> = [];

  lu_onViewAllFunction: any;

  @property( {attribute: false, type: Boolean}) bShowFileModal = false;
  @property( {attribute: false, type: Boolean}) bShowLinkModal = false;
  @property( {attribute: false, type: Boolean}) bShowViewAllModal = false;

  arFileMainButtons: Array<any> = [];
  arFileSecondaryButtons: Array<any> = [];

  arLinkMainButtons: Array<any> = [];
  arLinkSecondaryButtons: Array<any> = [];

  arFiles: Array<any> = [];
  arFileList: Array<any> = [];
  removeFileFromList: any;

  arLinks: Array<any> = [];
  arLinksList: Array<any> = [];
  removeLinksFromList: any;

  @property( {attribute: false} ) link_title: string = "";
  @property( {attribute: false} ) link_url: string = "";

  currentLink: string = "";
  currentUrl: string = "";

  closeSvgIcon: string = "";

  currentCaseID: string = "";

  addAttachmentsActions: Array<any> = [
    {
      text: "Add files",
      id: "addNewFiles",
      onClick: () => this.createModal("addLocalFile")
    },
    {
      text: "Add links",
      id: "addNewLinks",
      onClick: () => this.createModal("addLocalLink")
    }
  ];

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
    this.theComponentStyleTemplate = fileUtilityStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    let configProps: any = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());

    this.lu_name = configProps.label;
    this.lu_icon = "paper-clip";

    this.closeSvgIcon = Utils.getImageSrc("times", Utils.getSDKStaticContentUrl());



    this.lu_onViewAllFunction = { onClick: this.onViewAll.bind(this) }

    this.removeFileFromList = { onClick: this._removeFileFromList.bind(this) }
    this.removeLinksFromList = { onClick: this._removeLinksFromList.bind(this) }

    
    let onViewAllCallback = () => this.onViewAll(this.arFullListAttachments);

    this.lu_onViewAllFunction = { onClick: () => this.onViewAll }
  

    this.createModalButtons();
    
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


    const attachmentUtils = PCore.getAttachmentUtils();
    const caseID = this.thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    if (caseID && caseID != "" ) {
      let attPromise = attachmentUtils.getCaseAttachments(caseID, this.thePConn.getContextName());

      this.lu_bLoading = true;
  
      attPromise
        .then( (resp) => {
          this.arFullListAttachments = this.addAttachments(resp);
          this.lu_count = this.arFullListAttachments.length;
          this.lu_arActions = this.addAttachmentsActions;
  
          this.lu_arItems= this.arFullListAttachments.slice(0, 3).map((att) => {
            return this.getListUtilityItemProps({
              att,
              downloadFile: !att.progress ? () => this.downloadFile(att) : null,
              cancelFile: att.progress ? () => this.cancelFile(att.ID) : null,
              deleteFile: !att.progress ? () => this.deleteFile(att) : null,
              removeFile: att.error ? () => this.removeFile(att.ID) : null
            });
          });
  
          this.va_arItems= this.arFullListAttachments.map((att) => {
            return this.getListUtilityItemProps({
              att,
              downloadFile: !att.progress ? () => this.downloadFile(att) : null,
              cancelFile: att.progress ? () => this.cancelFile(att.ID) : null,
              deleteFile: !att.progress ? () => this.deleteFile(att) : null,
              removeFile: att.error ? () => this.removeFile(att.ID) : null
            });
          });
  
          this.requestUpdate();
  
  
        });
    }
    

  }
  
  caseHasChanged() : boolean {
    const caseID = this.thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    if (this.currentCaseID !== caseID) {
      this.currentCaseID = caseID;
      return true;
    }

    return false;
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

    // adding a property to track in configProps, when ever the attachment file changes
    // need to trigger a redraw
    this.thePConn.registerAdditionalProps({
      lastRefreshTime: `@P ${
        PCore.getConstants().SUMMARY_OF_ATTACHMENTS_LAST_REFRESH_TIME
      }`
    });

    const bShouldUpdate = super.shouldComponentUpdate();


    if (bShouldUpdate || this.caseHasChanged()) {
      this.updateSelf();
    }
  }

  getFilesHtml() : any {
    const arFilesHtml: Array<any> = [];

    for (let myFile of this.arFiles) {
      arFilesHtml.push(html`
        <li>${myFile.name}</li>
      `);
    }

    return arFilesHtml;

  }

  getFileUtilityHtml() : any {


    const fUHtml = html `
      <div>
        <list-utility-extension name="${this.lu_name}" icon="${this.lu_icon}"
            .bLoading="${this.lu_bLoading}" .count="${this.lu_count}"
            .arActions="${this.lu_arActions}" .arItems="${this.lu_arItems}"
            @ViewAll="${this._onViewAll}"></list-utility-extension>
      </div>

    ${this.bShowFileModal?
    html`
    <div class="psdk-dialog-background">
      <div class="psdk-modal-file-top">
          <h3>Add local files</h3>
          <div class="psdk-modal-body">
            <input hidden type="file" multiple #uploader @change="${this.uploadMyFiles}" id="utility-upload-input"/>
            
            <lion-button class="btn btn-link" @click="${this._onFileLoad}">
                Upload file(s)
            </lion-button>

            <summary-list-extension .arItems="${this.arFileList}" menuIconOverride="trash" .menuIconOverrideAction="${this.removeFileFromList}"></summary-list-extension>
          </div>


          <action-buttons-component .arMainButtons="${this.arFileMainButtons}" .arSecondaryButtons="${this.arFileSecondaryButtons}"
              @ActionButtonClick="${this._onFileActionButtonClick}">
          </action-buttons-component>
      </div>
    </div>`
    :
    html``}

    ${this.bShowLinkModal?
    html`
    <div class="psdk-dialog-background">
        <div class="psdk-modal-link-top">
            <h3>Add local link</h3>
            <div class="psdk-modal-body">
              <div class="psdk-modal-links-row">
                <div class="psdk-links-two-column">
                  <div>
                    <lion-input name="linkTitle" .modelValue=${this.link_title} @change=${this._changeTitle}>
                      <span slot="label"><span>Link title <super style="color: var(--app-warning-color-dark); font-weight: var(--app-form-required-color)">*</super></span></span>
                    </lion-input>
                  </div>
                  <div>
                    <lion-input name="linkUrl" .modelValue=${this.link_url} @change=${this._changeUrl}>
                      <span slot="label"><span>URL <super style="color: var(--app-warning-color-dark); font-weight: var(--app-form-required-color)">*</super></span></span>
                    </lion-input>
                  </div>
                </div>
                <div class="psdk-links-add-link">
                  <lion-button class="btn btn-link" @click="${this._addLink}">Add link</lion-button>
                </div>
              </div>
              <summary-list-extension .arItems="${this.arLinksList}" menuIconOverride="trash" .menuIconOverrideAction="${this.removeLinksFromList}"></summary-list-extension>

            </div>

            <action-buttons-component .arMainButtons="${this.arLinkMainButtons}" .arSecondaryButtons="${this.arLinkSecondaryButtons}"
              @ActionButtonClick="${this._onLinkActionButtonClick}">
            </action-buttons-component>

        </div>
    </div>`
    :
    html``}


    ${this.bShowViewAllModal?
    html`
    <div class="psdk-dialog-background">
      <div class="psdk-modal-file-top">
          <div class="psdk-view-all-header">
          <div><h3>Attachments</h3></div>
          <div><lion-button class="btn btn-link" @click=${this._closeViewAll}><img class="psdk-view-all-close-icon" src="${this.closeSvgIcon}" ></lion-button></div>
          </div>
          <div class="psdk-view-all-body" >
            <summary-list-extension .arItems="${this.va_arItems}"></summary-list-extension>
          </div>
          
      </div>
    </div>
    `
    :
    html``}



    `;

    return fUHtml;

  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // For test purposes, add some more content to be rendered
    //  This isn't the best way to add inner content. Just here to see that the style's
    //  be loaded and can be applied to some inner content.
    this.prepareForRender();

  
    const sContent = html`${this.getFileUtilityHtml()}`;

    this.renderTemplates.push( sContent );

    return this.renderTemplates;

  }

  _addLink(event: any) {

    // copy list locally
    let localList = this.arLinksList.slice();

    let url = this.link_url;
    
    if (!/^(http|https):\/\//.test(this.link_url )) {
      this.link_url  = `http://${this.link_url }`;
    }

    // list for display
    let oLink: any = {};
    oLink.icon = "chain";
    oLink.ID = `${new Date().getTime()}`;


    oLink = this.getNewListUtilityItemProps({
      att: oLink,
      downloadFile: null,
      cancelFile: null,
      deleteFile: null,
      removeFile: null
    });

    oLink.type = "URL";
    oLink.primary.name = this.link_title;
    oLink.primary.icon = "open";
    oLink.secondary.text = url;

    // need to create a new array or summary list won't detect changes
    this.arLinksList = localList.slice();
    this.arLinksList.push(oLink);


    // list for actually attachments
    let link: any = {};
    link.id = oLink.id;
    link.linkTitle = this.link_title;
    link.type = oLink.type;
    link.url = url;

    this.arLinks.push(link);


    // clear values
    this.link_title = "";
    this.link_url = "";

    this.requestUpdate();

 

  }

  _changeTitle(event: any) {
    this.link_title = event.srcElement.value;

  }

  _changeUrl(event: any) {
    this.link_url = event.srcElement.value;
    
  }

  _onFileLoad(event:any) {
    event.target.parentElement.getElementsByTagName("input")[0].click();
  }

  downloadFile(att: any) {

    let attachUtils = PCore.getAttachmentUtils();
    const {ID, name, extension, type} = att;
    let context = this.thePConn.getContextName();

    attachUtils
    .downloadAttachment(ID, context)
    .then((content) => {
      if (type === "FILE") {
        this.fileDownload(content.data, name, extension);
      } else if (type === "URL") {
        let { data } = content;
        if (!/^(http|https):\/\//.test(data)) {
          data = `//${data}`;
        }
        window.open(content.data, "_blank");
      }
    })
    .catch(console.error);
  }

  fileDownload = (data, fileName, ext) => {
    const file = ext ? `${fileName}.${ext}` : fileName;
    download(atob(data), file);
  };

  cancelFile(attID: string) {
    alert("cancel");
  }

  deleteFile(att: any) {

    setTimeout(() => {
      let attachUtils = PCore.getAttachmentUtils();
      const {ID} = att;
      let context = this.thePConn.getContextName();
  
      attachUtils
      .deleteAttachment(ID, context)
      .then(() => {
        this.updateSelf();
        // let newAttachments;
        // setAttachments((current) => {
        //   newAttachments = current.filter((file) => file.ID !== ID);
        //   return newAttachments;
        // });
        // if (callbackFn) {
        //   callbackFn(newAttachments);
        // }
      })
      .catch(console.error);
    });


  }

  removeFile(attID: string) {
    alert("remove");
  }

  removeNewFile(attID: string) {
    alert("remove");
  }


  onViewAll(arAttachments: Array<any> = []) : void {
    alert("onView:" + arAttachments);
  }

  onAttachFiles(files) {
    const attachmentUtils = PCore.getAttachmentUtils();
    const caseID = this.thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    if (files.length > 0) {
      this.lu_bLoading = true;
    }


    for (let file of files) {
      attachmentUtils
      .uploadAttachment(
        file,
        this.onUploadProgress,
        this.errorHandler,
        this.thePConn.getContextName()
      )
      .then((fileResponse) => {

        if (fileResponse.type === "File") {
          attachmentUtils.linkAttachmentsToCase(
            caseID,
            [ fileResponse ],
            "File",
            this.thePConn.getContextName()
          )
          .then((attachments) => {
            this.refreshAttachments(file.ID);
          })
          .catch(console.error);
        }
      })
      .catch(console.error);


    }

    // reset the list
    this.arFiles = [];
  }





  refreshAttachments(attachedFileID) {

    this.updateSelf();

  }


  onUploadProgress(file) {

  }

  errorHandler(isFetchedCanceled, file) {

  }

  onAttachLinks(links) {

    const attachmentUtils = PCore.getAttachmentUtils();
    const caseID = this.thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    if (links.length > 0) {
      this.lu_bLoading = true;
    }

    const linksToAttach = links.map((link) => ({
      type: "URL",
      category: "URL",
      url: link.url,
      name: link.linkTitle
    }));

    attachmentUtils
      .linkAttachmentsToCase(caseID, linksToAttach, "URL", this.thePConn.getContextName())
      .then( (data) => {
        this.refreshAttachments(data);
      })
      .catch(console.log);
  }

  addAttachments(attsFromResp: Array<any> = [], attachedFileID: string = "") {
    this.lu_bLoading = false;

    attsFromResp = attsFromResp.map((respAtt) => {
      const updatedAtt = {
        ...respAtt,
        meta: `${respAtt.category} . ${Utils.generateDateTime(respAtt.createTime, "DateTime-Since")}, ${
          respAtt.createdBy
        }`
      };
      if (updatedAtt.type === "FILE") {
        updatedAtt.nameWithExt = updatedAtt.fileName;
      }
      return updatedAtt;
    });


    return attsFromResp;

  }

  _removeFileFromList(item: any) {
    if (item != null) {
      for (let fileIndex in this.arFileList) {
        if (this.arFileList[fileIndex].id == item.id) {
          // remove the file from the list and redraw

          this.arFileList.splice(parseInt(fileIndex), 1);
          this.requestUpdate();

          break;
        }
      }
    }
  }

  _removeLinksFromList(item: any) {

    let localLinksList = this.arLinksList.slice();

    if (item != null) {
      for (let linkIndex in localLinksList) {
        if (localLinksList[linkIndex].id == item.id) {
          // remove the file from the list and redraw

          localLinksList.splice(parseInt(linkIndex), 1);

          this.arLinksList = localLinksList.slice();
          this.requestUpdate();

          break;
        }
      }
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

  getListUtilityItemProps = ({
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
        icon: "open",
        click: downloadFile,
      },
      secondary: {
        text: att.meta
      },
      actions
    };
  }



  _onViewAll(e: any) {

    this.bShowViewAllModal = true;

    // add clickAway listener
    window.addEventListener('mouseup', this._clickAway.bind(this));

  }

  _clickAway(event: any) {

    var bInPopUp = false;

    //run through list of elements in path, if menu not in th path, then want to 
    // hide (toggle) the menu
    for (let i in event.path) {
      if (event.path[i].className == "psdk-modal-file-top") {
        bInPopUp = true;
        break;
      }
    }
    if (!bInPopUp) {

        this.bShowViewAllModal = false;

        window.removeEventListener('mouseup', this._clickAway.bind(this));
    }





  }

  _closeViewAll() {
    this.bShowViewAllModal = false;

    window.removeEventListener('mouseup', this._clickAway.bind(this));
  }


  createModal(modalType: string) {
    switch (modalType) {
      case "addLocalFile" :

        this.bShowFileModal = true;
        break;
      case "addLocalLink" :

        this.bShowLinkModal = true;
        break;
    }
  }

  createModalButtons() {

    this.arFileMainButtons.push({ actionID: "attach", jsAction: "attachFiles", name: "Attach files"});
    this.arFileSecondaryButtons.push({ actionID: "cancel", jsAction: "cancel", name: "Cancel"});

    this.arLinkMainButtons.push({ actionID: "attach", jsAction: "attachLinks", name: "Attach links"});
    this.arLinkSecondaryButtons.push({ actionID: "cancel", jsAction: "cancel", name: "Cancel"});

  }

  uploadMyFiles($event) {
    //alert($event.target.files[0]); // outputs the first file
    this.arFiles = this.getFiles($event.target.files);

    // convert FileList to an array
    let myFiles = Array.from(this.arFiles);

    this.arFileList = myFiles.map((att) => {
      return this.getNewListUtilityItemProps({
        att,
        downloadFile: !att.progress ? () => this.downloadFile(att) : null,
        cancelFile: att.progress ? () => this.cancelFile(att.ID) : null,
        deleteFile: !att.progress ? () => this.deleteFile(att) : null,
        removeFile: att.error ? () => this.removeNewFile(att.ID) : null
      });
    });

    this.requestUpdate();

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
      file.icon = this.getIconFromFileType(file.type);
      file.ID = `${new Date().getTime()}I${index}`;
      index++;
    }

    return arFiles;
  }

  validateMaxSize(fileObj, maxSizeInMB) : boolean {
    const fileSize = (fileObj.size / 1048576).toFixed(2);
    return fileSize < maxSizeInMB;
  }

  getIconFromFileType(fileType: string): string {
    let icon: string = "document-doc";
    if (!fileType) return icon;
    if (fileType.startsWith("audio")) {
      icon = "audio";
    } else if (fileType.startsWith("video")) {
      icon = "video";
    } else if (fileType.startsWith("image")) {
      icon = "picture";
    } else if (fileType.includes("pdf")) {
      icon = "document-pdf";
    } else {
      const [, subtype] = fileType.split("/");
      const foundMatch = (sources) => {
        return sources.some((key) => subtype.includes(key));
      };
  
      if (foundMatch(["excel", "spreadsheet"])) {
        icon = "document-xls";
      } else if (foundMatch(["zip", "compressed", "gzip", "rar", "tar"])) {
        icon = "document-compress";
      }
    }
  
    return icon;
  }

  _onFileActionButtonClick(event: any) {
    // modal buttons
    switch (event.detail.data.action) {
      case "cancel" :
        this.bShowFileModal= false;
        // clear out arrays
        this.clearOutFiles();
        break;
      case "attachFiles":
        this.bShowFileModal= false;
        this.onAttachFiles(this.arFiles);

        // clear out arrays
        this.clearOutFiles();
        break;
    }

  }

  _onLinkActionButtonClick(event: any) {
    switch (event.detail.data.action) {
      case "cancel" :
        this.bShowLinkModal= false;
        // clear out arrays
        this.clearOutLinks();
        break;
      case "attachLinks":
        this.bShowLinkModal= false;
        this.onAttachLinks(this.arLinks);

        // clear out arrays
        this.clearOutLinks();
        break;
    }

  }

  clearOutFiles() {
    this.arFileList = [];
    this.arFiles = [];
  }

  clearOutLinks() {
    this.arLinksList = [];
    this.arLinks = [];
    this.link_title = "";
    this.link_url = "";
  }

}

export default FileUtility;