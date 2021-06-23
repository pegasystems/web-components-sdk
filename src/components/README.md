# Web Components SDK - Components

This document is a guide to help you get started adding a new component to the Web Components SDK.

---

## The folder structure of the src directory

*  **bridge** - the directory for the BridgeBase base class from which all of our components are derived. This code should not be changed.
* **components** - the directory in which all of the components will be added and maintained. Each component has its own folder in this folder structure.<br> Component folders can appear directly in the **components** folder or may be classified to belong in one of the subdirectories.<br>The pattern we follow is that each components folder contains the following
    * **index.ts**: a TypeScript file for the component's code
    * **_component-name-styles.ts_**: a Typescript file that returns a lit-element construct for the \<style> block added into the component's rendering. (subject to change)

* **components/forms**: this directory is used for components that are typically placed in the context of a form. For example: TextInput, Dropdown

* **components/templates**: this directory is used for components that represent templates used by Views and Pages in the application. For example: CaseView, OneColumn, TwoColumn

* **components/widgets**: this directory is used for components that classified as widgets (compound elements that may be used in various places in the app). For example: AppAnnouncement

* **_helpers_**: this directory contains various code files for helper functions

---

## Creating a new Component

This section provides some steps that can be taken to quickly create a new component. We provide a simple **Boilerplate** component in the Starter Pack whose code can be copied into the new files you create for the component.

* **Create a directory** for your new component.

    * For example, if I want to create a new template for the **CaseSummary** template that appears in my application, I create a new **CaseSummary** directory in **src/components/templates**

* Then, **create the 2 new (empty) files** for this component in that directory:
    * **index.ts**
    * **case-summary-styles.ts**

* Copy the contents of **src/components/Boilerplate/index.ts** into the newly created **index.ts**

* Copy the contents of **src/components/Boilerplate/boilerplate-styles.ts** into the newly created **case-summary-styles.ts**

At this point, you'll have some code you can start with but it isn't ready to compile and run yet. In the next section, we'll step through some changes that are necessary to adapt the Boilerplate code for use in your component.

---
## Adapt **_yourComponent_/index.ts_** from the Boilerplate code

This file contains the code for your component's implementation. The Boilerplate code we've copied provides some common accessors to the web component lifecyle. We've also setup the component to **extend** BridgeBase (our Web Component bridge to Constellation) so it inherits the ability to interact with the Bridge.

To get started, we first need to update the copied Boilerplate/index.js to remove references to Boilerplate and have our new component ready to be used.

* You _may_ need to update the path to find the BridgeBase class that we're extending. For example, we created our CaseSummary in the _templates_ folder so we need to update the path for the extra level of depth since Boilerplate was directly in the src/components folder.<br><br>
import { BridgeBase } from '../../../bridge/BridgeBase';

* Update the import for the styling to match the exported const name and file for your component:<br><br>
import { caseSummaryStyles } from './case-summary-styles';

* Update the decorator that defines the tag name that will be used to refer to this component. **NOTE: the Custom Element standard _**requires**_ that the tag name include a hyphen!**<br><br>
@customElement('case-summary-template')

* Rename your element's **class name** to reflect the appropriate class name for your component<br><br>
class CaseSummary extends BridgeBase {<br><br>
and while we're thinking of it, go to the bottom of the file and export your new class name (rather than Boilerplate):<br><br>
export default CaseSummary;

* In connectedCallback, use the name of the styles constant that will be exported from your new *-styles.ts file (see below)<br><br>
this.theComponentStyleTemplate = caseSummaryStyles;

* We also want to remove the "default content" that we include so the Boilerplate component renders something and, to get started, we rely on the call to render the component's children by default. (Since all PConnect components are passed with props=`<the component's PConnect>, this PConnect will typically have children components that can be rendered.) So, remove these lines:<br><br>
```diff
-    // For test purposes, add some more content to be rendered
-    //  This isn't the best way to add inner content. Just here to see that the style's
-    //  be loaded and can be applied to some inner content.
-    const sampleContent = html`<div class='boilerplate-class'>boilerplate-component: ${this.value}</div>`;
-    this.renderTemplates.push( sampleContent );~~
```

At this point, your code should compile. However, the Starter Pack won't know when and how to use your new component because we haven't tried to render it yet.

In the next section, we'll make some adjustments in other code in the Starter Pack to recognize and use your new component.

---

## Update _**other**_ code to recognize and use your new component

* Identify which component(s) need to render your new component and **include** your component in their index.ts

    * When developing the new component, we need to know which existing component(s) may render our new component. For example, during our development, we noticed that a **View** component was trying to render the **CaseSummary**.<br><br>
    To let the **View** implementation know that our **CaseSummary** is a web component that it may render, we need to import our **CaseSummary** class into the **View** component. So, in **src/components/View/index.ts**, we add the following:<br><br>
    import '../templates/CaseSummary';

* Add the new component to the BridgeBase functions that can render a component's children by default or know how to access a template, etc.<br><br>
There are 3 methods in BridgeBase that are used as helpers (especially useful when getting the component initially wired into the system). We'll add our new component to each of these 3 methods to get the component wired in to the infrastructure.<br><br>
Open **src/bridge/BridgeBase/index.ts** and add case statements to the switch clause of the following functions. Note that we use the tag name we defined in our component (ex: case-summary-template) when we render our component. And, by default, we add a **.pConn** property to pass along the component's PConnect object):

    * In **addChildTemplates**, add the following **case** to the **switch** statement:<br>
    ```
    case "CaseSummary":
      this.renderTemplates.push( html`<case-summary-template .pConn=${child}></case-summary-template>` );
      break;
    ```

    * In **getChildTemplateArray**, add the following **case** to the **switch** statement:<br>
    ```
    case "CaseSummary":
      theChildTemplates.push( html`<case-summary-template .pConn=${child}></case-summary-template>` );
        break;
    ```

    * [**NOTE: Only do this if your component is a _template_.**]<br> In **getTemplateForTemplate**, add the following **case** to the **switch** statement:<br>
    ```
    case "CaseSummary":
      theTemplateForTemplate = html`<case-summary-template .pConn=${inPConnToUse}></case-summary-template>` ;
      break;
    ```


---
## Adapt **_yourComponent_/_yourcomponent-styles.ts_** from the Boilerplate code

This file is where (for now, since we are still investigating the best way to provide component styles) we will put styles that will apply only to this component.

To get this file be correctly used, we'll update the code to remove references to the Boilerplate styles that were copied in and provide a simple style so we know that the styles are being correctly applied to the component.

Make the following initial changes to the **_yourComponent_/_yourcomponent-styles.ts_**: 

* Change the name of the exported constant _from_ **boilerplateStyles** to an appropriate name for your component's styles. For example: **case-summary-styles**<br><br>
export const caseSummaryStyles = html`


* Replace the contents between the \<style> and \</style> tags with something that you should see rendered when this new component is rendered. (You'll replace and update this as you work on your component.) For example, apply a background-color to your new component and all its children:

    case-summary-template * {
      background-color: dodgerblue;
    }

---








