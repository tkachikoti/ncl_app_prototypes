/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
 */
 function Properties_(scope) {
    // Declare and initiate variables
    var properties = {};
    // get and set methods
    this.getProperties = function (scope) {
        if (!Object.keys(properties).length) {
            this.setProperties(scope);
        }
        return properties;
    };
    this.setProperties = function (scope) {
        // set parameter defaults
        scope = (scope) ? scope : "script";
        switch (scope) {
            case "user":
                properties = PropertiesService.getUserProperties();
                break;
            case "script":
                properties = PropertiesService.getScriptProperties();
                break;
            case "document":
                properties = PropertiesService.getDocumentProperties();
                break;
            default:
                properties = null;
        }
        return this;
    };
    this.get = function (key) {
        // set parameter defaults
        key = (key) ? key : "";
        // Declare and initiate variables
        var properties = this.getProperties();
        return parse_(properties.getProperty(key));
    };
    this.set = function (key, value) {
        // Declare and initiate variables
        var properties = this.getProperties();
        properties.setProperty(key, value);
        return this;
    };
}
var $Properties = new Properties_();