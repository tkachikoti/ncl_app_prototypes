/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
 */
function doPost(request) {
    //console.log("doPost - request: " + JSON.stringify(request));
    // Declare and initiate variables
    /*
    var response = {};
    $PostRequestManager.setPostRequestAppSettings(request);
    $PostRequestManager.validateToken(request);
    response = $PostRequestManager.processRequest(request);
    
    $Database.getTable("dataDumpTable").setDataByRow({
        request: request
    });
    */
    return $PostRequestManager.returnCode200Response(response);
}