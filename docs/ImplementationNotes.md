* LitElement related info
    * The @property syntax is referred to as a decorator.  It is documented here:  https://lit-element.polymer-project.org/guide/decorators
        * attribute refers to whether the property is an element attribute.  Should every attribute your element supports have a @property statement within the implementation?
    * The ?attribute= syntax is related to binding to a boolean attribute.  More info here: https://lit-element.polymer-project.org/guide/templates

* CSS related info
    * psdk- prefix class names
    * form- prefix class names are Bootstrap specific

* Bootstrap info
    * https://getbootstrap.com/docs/4.6/components/forms/

* Constellation related info
    * Every Web Component that connects to the Bridge is going to have PConnect object associated with it
    
* dayjs library (and near plug compatibility with moment)
    * https://medium.datadriveninvestor.com/https-medium-com-sabesan96-why-you-should-choose-day-js-instead-of-moment-js-9cf7bb274bbd
    * The Z format is different with dayjs it seems to map to lowercase z

* esModuleInterop
    * Several module imports (such as dayjs inclusion within utils.js) need to use a "* as <modulename>" syntax to properly compile without adding this compiler setting to tsconfig.json.  If we add this compiler setting, then the following imports might be adjusted to avoid the "* as ":
        Four imports in utils.js
        One import in BridgeBase & ModalViewContainer

