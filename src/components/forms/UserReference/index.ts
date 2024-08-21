import { html, customElement, property, nothing } from '@lion/core';
import { FormComponentBase } from '../FormComponentBase';

// NOTE: you need to import ANY component you may render.
import '../../widgets/CaseOperator';

// import the component's styles as HTML with <style>
import { userReferenceStyles } from './user-reference-styles';

// Declare that PCore will be defined when this code is run
declare let PCore: any;

@customElement('user-reference-form')
class UserReference extends FormComponentBase {
  @property({ attribute: false, type: String }) userName = '';
  @property({ attribute: false, type: String }) date = '';
  @property({ attribute: false, type: String }) label = '';
  @property({ attribute: false, type: Array }) dropDownDataSource: any = [];
  @property({ attribute: false, type: String }) displayAs = '';
  @property({ attribute: false, type: String }) SEARCH_BOX = 'Search box';
  @property({ attribute: false, type: String }) DROPDOWN_LIST = 'Drop-down list';

  rawViewMetadata: any;
  viewName: any;
  firstChildMeta: any;
  OPERATORS_DP: string = PCore.getEnvironmentInfo().getDefaultOperatorDP();
  userID = '';
  readOnly = false;
  showAsFormattedText = false;

  isUserNameAvailable = user => {
    return typeof user === 'object' && user !== null && user.userName;
  };

  getUserId = user => {
    let userId = '';
    if (typeof user === 'object' && user !== null && user.userId) {
      userId = user.userId;
    } else if (typeof user === 'string' && user) {
      userId = user;
    }
    return userId;
  };

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
    if (this.bDebug) {
      debugger;
    }

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }

    // setup this component's styling...
    this.theComponentStyleTemplate = userReferenceStyles;

    this.getData();
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }
  }

  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: updateSelf`);
    }
    if (this.bDebug) {
      debugger;
    }

    super.updateSelf();

    // Additional processing

    const props = this.thePConn.getConfigProps();

    const { label, displayAs, value, showAsFormattedText } = props;

    this.displayAs = displayAs;
    this.showAsFormattedText = showAsFormattedText;
    this.userID = value.userId;
    this.userName = value.userName;

    let { readOnly, required, disabled } = props;
    this.readOnly = readOnly;
    [readOnly, required, disabled] = [readOnly, required, disabled].map(prop => prop === true || (typeof prop === 'string' && prop === 'true'));

    const userId = this.getUserId(value);
    if (this.userID === undefined) {
      this.userID = userId;
    }
    if (this.label === undefined) {
      this.label = label;
    }
    if (this.displayAs === undefined) {
      this.displayAs = displayAs;
    }

    if (!this.dropDownDataSource) {
      this.getData();
    }

    if (this.userID && this.readOnly && this.showAsFormattedText) {
      if (this.isUserNameAvailable(value)) {
        this.userName = value.userName;
      } else {
        // if same user ref field is referred in view as editable & readonly formatted text
        // referenced users won't be available, so get user details from dx api
        const { getOperatorDetails } = PCore.getUserApi();
        getOperatorDetails(this.userID).then(resp => {
          if (resp.data && resp.data.pyOperatorInfo && resp.data.pyOperatorInfo.pyUserName) {
            this.userName = resp.data.pyOperatorInfo.pyUserName;
          }
        });
      }
    }
  }

  theRenderedDiv() {
    if (this.bDebug) {
      console.log(`${this.theComponentName}: theRenderedDiv`);
    }
    return html`${this.bVisible
      ? html`
          <div class="psdk-user-reference">
            <case-operator-widget
              class="psdk-double"
              .pConn=${this.thePConn}
              name=${this.userName}
              label=${this.label}
              theId=${this.userID}
            ></case-operator-widget>
          </div>
        `
      : nothing}`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (name === 'dropDownDataSource') {
      if (oldValue !== newValue) {
        this.getData();
      }
    }
  }

  getData() {
    if (this.displayAs === this.DROPDOWN_LIST || this.displayAs === this.SEARCH_BOX) {
      const queryPayload = {
        dataViewName: this.OPERATORS_DP
      };

      PCore.getRestClient()
        .invokeRestApi('getListData', { queryPayload })
        .then(resp => {
          const ddDataSource = resp.data.data.map(listItem => ({
            key: listItem.pyUserIdentifier,
            value: listItem.pyUserName
          }));
          this.dropDownDataSource = ddDataSource;
          this.dropDownDataSource = JSON.stringify(this.dropDownDataSource);
          this.requestUpdate();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`);
    }
    if (this.bDebug) {
      debugger;
    }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // Handle and return if read only rendering
    if (this.readOnly) {
      return html` <operator-extension class="psdk-double" name=${this.userName} label=${this.label} theId=${this.userID}></operator-extension> `;
    }
    if (this.displayAs === this.DROPDOWN_LIST) {
      return html`<dropdown-form .pConn=${this.thePConn} .value=${this.userID} datasource=${this.dropDownDataSource}></dropdown-form>`;
    }

    if (this.displayAs === this.SEARCH_BOX) {
      // const columns = [
      //   {
      //     value: 'pyUserName',
      //     display: 'true',
      //     useForSearch: true,
      //     primary: 'true'
      //   },
      //   {
      //     value: 'pyUserIdentifier',
      //     setProperty: 'Associated property',
      //     key: 'true',
      //     display: 'true',
      //     secondary: 'true',
      //     useForSearch: 'true'
      //   }
      // ];

      return html` <autocomplete-form .pConn=${this.thePConn} datasource=${this.dropDownDataSource}></autocomplete-form> `;
    }

    // this.renderTemplates.push( this.theRenderedDiv() )

    // return this.renderTemplates;
  }
}

export default UserReference;
