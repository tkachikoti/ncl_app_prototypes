/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
 */
 function Client_(app) {
	// Declare and initiate variables
	var index = "";
	var indexTemplate =  HtmlService.createTemplateFromFile("client/index")
        .getRawContent();
	// get/set methods
	this.getIndex = function () {
		return index;
	};
	this.setIndex = function (data) {
		index = data;
	};
	this.getIndexTemplate = function () {
		return indexTemplate;
	};
	this.appendNonce = function (data) {
	    var key =  createNonce_();
	    var regEx1 = new RegExp("%generateNonce%", "gi");
	    var nonce1 = key;
	    var regEx2 = new RegExp("<script", "gi");
	    var nonce2 = "<script nonce='" + key + "' ";
	    var index = data.replace(regEx1, nonce1);
	    index = index.replace(regEx2, nonce2);
	    return index;
	};
	this.run = function (app) {
		// Declare and initiate variables
		var modules = new ModuleBundler_(app.getAppConfig())
			.getBundlesAsObject();
		var regEx = {};
		var index = this.getIndexTemplate();
	    for (var key in modules) {
            if (modules.hasOwnProperty(key)) {
            	regEx = new RegExp("<" + key + "/>", "gi");
		        index = index.replace(regEx, function () {
		        	return modules[key];
		        });
            }
        }
	    regEx = new RegExp("<pathInfo/>", "gi");
	    index = index.replace(regEx, function () {
        	return app.getUrl().pathInfo;
        });
        regEx = new RegExp("<appName/>", "gi");
	    index = index.replace(regEx, function () {
        	return capitaliseString_(app.getAppName());
        });
        regEx = new RegExp("<clientDomain/>", "gi");
	    index = index.replace(regEx, function () {
        	return app.getUrl().domain.client;
        });
        regEx = new RegExp("<domainAndAppName/>", "gi");
	    index = index.replace(regEx, function () {
        	return app.getUrl().domainAndAppName;
        });
        regEx = new RegExp("<devMode/>", "gi");
	    index = index.replace(regEx, function () {
        	return (app.getEnv() === "dev") ?
        		true :
        		false;
        });
        regEx = new RegExp("<VALUE_DATA_ARRAY_UPDATED_AT/>", "gi");
	    index = index.replace(regEx, function () {
        	return $Properties.get("VALUE_DATA_ARRAY_UPDATED_AT") || 0;
        });
	    this.setIndex(this.appendNonce(index));
	};
	// constructors
 	this.run(app);
}