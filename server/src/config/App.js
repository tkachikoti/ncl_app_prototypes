function App_(requestParameters) {
	// Declare and initiate variables
	var webAppUrl = "";
	var env = "";
	var requestParametersCache = {};
	var appName = "";
	var url = {
		domainAndAppName: "",
		pathInfo: ""
	};
	var appConfig = {};
	// get/set methods
	this.getRequestParametersCache = function () {
		return requestParametersCache;
	};
	this.setRequestParametersCache = function (requestParameters) {
		requestParametersCache = requestParameters;
		return this;
	};
	this.getWebAppUrl = function () {
		return webAppUrl;
	};
	this.setWebAppUrl = function () {
		webAppUrl = ScriptApp.getService().getUrl();
		return this;
	};
	this.getEnv = function () {
		return env;
	};
	this.setEnv = function () {
		// Declare and initiate variables
		var devPath = $Properties.get("devPath");
		var regEx = new RegExp(devPath, "gi");
		var requestParameters = this.getRequestParametersCache();
		var setEnv = "";
		if (requestParameters) {
			setEnv = (requestParameters.parameter.setEnv) ? 
			requestParameters.parameter.setEnv : 
			"";
		}
		if (!setEnv) {
			env = (regEx.test(this.getWebAppUrl())) ?
				"dev" :
				"exec";
		} else {
			env = setEnv;
		}
		return this;
	};
	this.getAppName = function () {
		return appName;
	};
	this.setAppName = function () {
		var app = this.getRequestParametersCache().parameter.app;
		appName = (app) ?
			app :
			$Properties.get("defaultAppName");
		return this;
	};
	this.getUrl = function () {
		return url;
	};
	this.setUrl = function () {
		var requestParameters = this.getRequestParametersCache();
		var compositePathInfo = "";
		var splitPathInfo = [];
		var appName = this.getAppName();
		if (requestParameters.parameter.pathInfo) {
			splitPathInfo = requestParameters.parameter.pathInfo
				.split("/");
			for (var i = 0; i < splitPathInfo.length; i++) {
				if (splitPathInfo[i].length) {
					compositePathInfo += "/" + splitPathInfo[i];
				}
			}
		}
		url.pathInfo = (compositePathInfo) ?
			compositePathInfo + "?" :
			$Properties.get("defaultPathInfo_" + appName) + "?";
		for (var key in requestParameters.parameter) {
			if (requestParameters.parameter.hasOwnProperty(key)) {
				if (key !== "app" && key !== "pathInfo" && key) {
					url.pathInfo += key + "=" +
						requestParameters.parameter[key] + "&";
				}
			}
		}
		this.setUrlDomain();
		this.setUrlDomainAndAppName();
		return this;
	};
	this.setUrlDomain = function () {
		url.domain = {};
		if (this.getEnv() === "dev") {
			url.domain.consultant = 
				this.getWebAppUrl().replace(
					"exec",
					"dev"
				) + "/";
			url.domain.client = 
				this.getWebAppUrl().replace(
					"exec",
					"dev"
				) + "/";
		}
		return this;
	};
	this.setUrlDomainAndAppName = function () {
		if (this.getEnv() === "dev") {
			url.domainAndAppName = 
				this.getWebAppUrl().replace(
					"exec",
					"dev"
				) + "/" + this.getAppName();
		}
		return this;
	};
	this.getAppConfig = function () {
		return appConfig;
	};
	this.setAppConfig = function () {
		var appName = this.getAppName();
		switch (appName) {
            case "staff-data-capture":
                appConfig = new Staff_Data_Capture_(this.getEnv());
                break;
            case "image-cropper":
                appConfig = new Image_Cropper_(this.getEnv());
                break;
            case "autocomplete-field":
                appConfig = new Autocomplete_Field_(this.getEnv());
                break;
            default:
                appConfig = new Staff_Data_Capture_(this.getEnv());
        }
		return this;
	};
	this.launchApp = function () {
		this.setWebAppUrl();
		this.setEnv();
		this.setAppName();
		this.setUrl();
		this.setAppConfig();
		return this;
	};
	// constructors
	this.setRequestParametersCache(requestParameters);
}