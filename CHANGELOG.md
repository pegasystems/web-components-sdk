# [24.2.11](https://github.com/pegasystems/web-components-sdk/tree/release/24.2.11) - Released: 18/02/2026

## Non Breaking changes

### **Features**

*   Implemented a "Save for Later" feature.
    * Github: [PR-234](https://github.com/pegasystems/web-components-sdk/pull/234)

*   Added support for edit table in dialog in EmbeddedData.
    * Github: [PR-236](https://github.com/pegasystems/web-components-sdk/pull/236)

*   Added support for 'DISPLAY_ONLY' mode in field components.
    * Github: [PR-255](https://github.com/pegasystems/web-components-sdk/pull/255)

*   `OneColumnPage` component has been added.
    * Github: [PR-258](https://github.com/pegasystems/web-components-sdk/pull/258)

*   Implemented field-level formatter support for Currency, Date, Decimal, Percentage, and Time components.
    * Github: [PR-265](https://github.com/pegasystems/web-components-sdk/pull/265)

*   Added a `showModalsInEmbeddedMode` flag to sdk-config.json. When set to true, modals will open in embedded mode.
    * Github: [PR-276](https://github.com/pegasystems/web-components-sdk/pull/276)

### **Bug fixes**

*   **The issue with the DataReference SingleSelect displaying an "undefined" item has been fixed**
      * Github: [PR-238](https://github.com/pegasystems/web-components-sdk/pull/238)
*   **Autocomplete readonly fields appeared editable in the details template issue fixed**
      * Github: [PR-240](https://github.com/pegasystems/web-components-sdk/pull/240)
*   **The "Edit Details" action within the Case Summary now works as expected**
      * Github: [PR-241](https://github.com/pegasystems/web-components-sdk/pull/241)
*   **Added "View is not defined for this step" message when a view is missing.**
      * Github: [PR-242](https://github.com/pegasystems/web-components-sdk/pull/242)
*   **Fixed an issue where primary fields in embedded data tables were not being hidden as expected**
      * Github: [PR-243](https://github.com/pegasystems/web-components-sdk/pull/243)
*   **Fixed an issue where lifecycle methods were not triggering correctly.**
      * Github: [PR-246](https://github.com/pegasystems/web-components-sdk/pull/246)
*   **Fixed table height display issue.**
      * Github: [PR-247](https://github.com/pegasystems/web-components-sdk/pull/247) 
*   **Fixed Column headers not visible in ListView read-only tables issue.**
      * Github: [PR-248](https://github.com/pegasystems/web-components-sdk/pull/248) 
*   **Fixed multiple issues in the Autocomplete control.**
      * Github: [PR-249](https://github.com/pegasystems/web-components-sdk/pull/249), [PR-259](https://github.com/pegasystems/web-components-sdk/pull/259)
*   **Fixed the behavior of DataReference to ensure it works as expected**
      * Github: [PR-251](https://github.com/pegasystems/web-components-sdk/pull/251), [PR-258](https://github.com/pegasystems/web-components-sdk/pull/251)
*   **Checkbox values inside field group are now correctly passing in to the payload.**
      * Github: [PR-252](https://github.com/pegasystems/web-components-sdk/pull/252)
*   **Adjusted the display format for DateTime fields in read-only mode**
      * Github: [PR-256](https://github.com/pegasystems/web-components-sdk/pull/256)
*   **Fixed validation errors on empty read-only percentage and currency fields**
      * Github: [PR-260](https://github.com/pegasystems/web-components-sdk/pull/260)
*   **checkbox component was not functioning correctly within Conditional Forms issue addressed.**
      * Github: [PR-261](https://github.com/pegasystems/web-components-sdk/pull/261)
*   **removed redundant validation logic for the RadioButton component**
      * Github: [PR-264](https://github.com/pegasystems/web-components-sdk/pull/264)
*   **Lifecycle methods now execute as expected inside ModalViewContainer component**
      * Github: [PR-266](https://github.com/pegasystems/web-components-sdk/pull/266)
*   **The Pconn object passing from RootContainer to ViewContainer have been created and passing as expected**
      * Github: [PR-267](https://github.com/pegasystems/web-components-sdk/pull/267)
*   **The Checkbox component now correctly displays the required field indicator when mandatory**
      * Github: [PR-269](https://github.com/pegasystems/web-components-sdk/pull/269)
*   **Playwright tests have been fixed**
      * Github: [PR-270](https://github.com/pegasystems/web-components-sdk/pull/270)
*   **Fixed multiple issues related to checkbox label**
      * Github: [PR-268](https://github.com/pegasystems/web-components-sdk/pull/268), [PR-271](https://github.com/pegasystems/web-components-sdk/pull/271)
*   **Fixed an issue where the userReference value was not displaying correctly within the Details template**
      * Github: [PR-277](https://github.com/pegasystems/web-components-sdk/pull/277)
---

### Refactoring

* **FieldValueList** component has been added for the field components to display 'DISPLAY_ONLY' and 'STACKED_LARGE_VAL' mode values
    * Github: [PR-255](https://github.com/pegasystems/web-components-sdk/pull/255)

---

### **Dependencies & Infrastructure**

*   The `npm` vulerabilities have been reduced.
    * Github: [PR-253](https://github.com/pegasystems/web-components-sdk/pull/253), [PR-280](https://github.com/pegasystems/web-components-sdk/pull/280)

*   The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **@pega/constellationjs** | 24.2.2 |
| **@pega/auth** | 0.2.36 |
| **@pega/pcore-pconnect-typedefs** | 3.2.2 |
