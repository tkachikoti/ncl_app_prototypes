/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
 */
 /**
 * Special function that handles HTTP GET requests to the published web app.
 * @return {HtmlOutput} The HTML page to be served.
 */
function doGet (requestParameters) {
    /*
    var userProperties = PropertiesService.getUserProperties();
    var queryString = "\n</html>";
    */
    /*
    return HtmlService.createTemplateFromFile("index").evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    var index = HtmlService.createTemplateFromFile("client/index")
        .evaluate()
        .getContent();
    */
    var app = new App_(requestParameters).launchApp();
    return HtmlService.createHtmlOutput(new Client_(app).getIndex())
        .setTitle(capitaliseString_(app.getAppName()))
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}