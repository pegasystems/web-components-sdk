import { html, customElement, property, nothing } from '@lion/core';
import { FormComponentBase } from '../FormComponentBase';

// NOTE: you need to import ANY component you may render.
import '../../widgets/CaseOperator';

// import the component's styles as HTML with <style>
import { userReferenceStyles } from './user-reference-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;


@customElement('user-reference-form')
class UserReference extends FormComponentBase {
  @property( {attribute: false, type: String })  userName: string = "";
  @property( {attribute: false, type: String})  date: string = "";
  @property( {attribute: false, type: String})  userID: string = "";

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
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
    this.theComponentStyleTemplate = userReferenceStyles;
    
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

    super.updateSelf()

    // Additional processing

    let props = this.thePConn.getConfigProps();

    const {
      label,
      displayAs,
      getPConnect,
      value,
      testId,
      helperText,
      validatemessage,
      placeholder,
      showAsFormattedText,
      dateTimeValue,
      additionalProps
    } = props;

    const OPERATORS_DP = "D_pyGetOperatorsForCurrentApplication";
    const DROPDOWN_LIST = "Drop-down list";
    const SEARCH_BOX = "Search box";

    let { readOnly, required, disabled } = props;
    [readOnly, required, disabled] = [readOnly, required, disabled].map(
      (prop) => prop === true || (typeof prop === "string" && prop === "true")
    );

    const getUserId = (user) => {
      let userId = "";
      if (typeof user === "object" && user !== null && user.userId) {
        userId = user.userId;
      } else if (typeof user === "string" && user) {
        userId = user;
      }
      return userId;
    };
  
    const isUserNameAvailable = (user) => {
      return typeof user === "object" && user !== null && user.userName;
    };
  
    const userId = getUserId(value);
    this.userID = userId;

    if (userId && readOnly && showAsFormattedText) {
      this.label = label;
      if (isUserNameAvailable(value)) {
        //setUserName(value.userName);
        this.userName = value.userName;
      } else {
        // if same user ref field is referred in view as editable & readonly formatted text
        // referenced users won't be available, so get user details from dx api
        const { getOperatorDetails } = PCore.getUserApi();
        getOperatorDetails(userId).then((resp) => {
          if (
            resp.data &&
            resp.data.pyOperatorInfo &&
            resp.data.pyOperatorInfo.pyUserName
          ) {
            //setUserName(res.data.pyOperatorInfo.pyUserName);
            this.userName = resp.data.pyOperatorInfo.pyUserName;
          }
        });
      }
    } else if (displayAs === DROPDOWN_LIST) {
      const queryPayload = {
        dataViewName: OPERATORS_DP
      };

      // PCore.getRestClient()
      //   .invokeRestApi("getListData", { queryPayload })
      //   .then((resp) => {
      //     const ddDataSource = resp.data.data.map((listItem) => ({
      //       key: listItem.pyUserIdentifier,
      //       value: listItem.pyUserName
      //     }));
      //     setDropDownDataSource(ddDataSource);
      //     setLoading(false);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    }

  }


  theRenderedDiv() {
    if (this.bDebug) { console.log(`${this.theComponentName}: theRenderedDiv`); }
    return html`${ this.bVisible ?
      html`
      <div class="form-group psdk-user-reference">
        <case-operator-widget class="psdk-double" .pConn=${this.thePConn} name=${this.userName} label=${this.label} theId=${this.userID}></case-operator-widget>
        </div>
      `
      :
      nothing
      }`;
  }


  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // Handle and return if read only rendering
    if (this.bReadonly) {
      return html`
        <text-form .pConn=${this.thePConn} ?disabled=${this.bDisabled} ?visible=${this.bVisible} label=${this.label} value=${this.value} testId=${this.testId}>
        </text-form>
      `;
    }

    this.renderTemplates.push( this.theRenderedDiv() )

    return this.renderTemplates;

  }

}

export default UserReference;