/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
 */
function ModuleBundler_(appConfig) {
 	// Declare and initiate variables
 	var vueComponentTemplate = HtmlService
        .createTemplateFromFile("client/src/components/componentTemplate")
        .getRawContent();
    var singleInstanceComponentNames = "";
    var vueModulesBase = "";
	var vueModulesView = "";
	var cssLibraries = "";
    var jsLibraries = "";
    var vueCoreMainTemplate = "";
    var vueStoreModules = "";
    var vueCoreMainJs = "";
    var vueFramework = "";
    var vueMixin = "";
 	// get/set methods
 	this.getVueComponentTemplate = function () {
 		return vueComponentTemplate;
 	};
 	this.getSingleInstanceComponentNames = function () {
 		return singleInstanceComponentNames;
 	};
 	this.setSingleInstanceComponentNames = function (data) {
 		singleInstanceComponentNames += data;
 	};
 	this.getVueModulesBase = function () {
 		return vueModulesBase;
 	};
 	this.setVueModulesBase = function (data) {
 		vueModulesBase = data;
 		return this;
 	};
 	this.getVueModulesView = function () {
 		return vueModulesView;
 	};
 	this.setVueModulesView = function (data) {
 		vueModulesView = data;
 		return this;
 	};
 	this.getCssLibraries = function () {
 		return cssLibraries;
 	};
 	this.setCssLibraries = function (data) {
 		cssLibraries = data;
 		return this;
 	};
 	this.getJsLibraries = function () {
 		return jsLibraries;
 	};
 	this.setJsLibraries = function (data) {
 		jsLibraries = data;
 		return this;
 	};
 	this.getVueCoreMainTemplate = function () {
 		return vueCoreMainTemplate;
 	};
 	this.setVueCoreMainTemplate = function (data) {
 		vueCoreMainTemplate = data;
 		return this;
 	};
 	this.getVueCoreMainJs = function () {
 		return vueCoreMainJs;
 	};
 	this.setVueCoreMainJs = function (data) {
 		vueCoreMainJs = data;
 		return this;
 	};
 	this.getVueStoreModules = function () {
 		return vueStoreModules ;
 	};
 	this.setVueStoreModules = function (data) {
 		vueStoreModules = data;
 		return this;
 	};
 	this.getVueFramework = function () {
 		return vueFramework;
 	};
 	this.setVueFramework = function (data) {
 		vueFramework = data;
 	};
 	this.getVueMixin = function () {
 		return vueMixin;
 	};
 	this.setVueMixin = function (data) {
 		vueMixin = data;
 	};
 	this.isolateTemplate = function (rawContent) {
 		// Declare and initiate variables
 		var templateRegEx = /<template[^>]*>([\s\S]*)<\/template>/;
 		var regEx1 = new RegExp("<template>");
    	var regEx2 = new RegExp(/^<\/template>\s*$/m);
    	var sanitisedContent = (templateRegEx.exec(rawContent)) ?
    		templateRegEx.exec(rawContent)[0] :
    		"";
        sanitisedContent = sanitisedContent.replace(regEx1, function () {
        	return "<div>";
        });
        sanitisedContent = sanitisedContent.replace(regEx2, function () {
        	return "</div>";
        });
        return sanitisedContent.trim();
 	};
 	this.isolateModule = function (rawContent) {
 		// Declare and initiate variables
 		var moduleRegEx = 
 			/<script type="text\/javascript"[^>]*>([\s\S]*?)<\/script>/;
 		var regEx3 = new RegExp("<script type=\"text/javascript\">", "gi");
	    var regEx4 = new RegExp(/(^|\s)module.export = \{(?=\s|$)/);
	    var regEx5 = new RegExp(/};([^};]*)$/);
	    var sanitisedContent = (moduleRegEx.exec(rawContent)) ?
	    	moduleRegEx.exec(rawContent)[0] :
	    	"";
        sanitisedContent = sanitisedContent.replace(regEx3, function () {
        	return "";
        });
        sanitisedContent = sanitisedContent.replace(regEx4, function () {
        	return "";
        });
        sanitisedContent = sanitisedContent.replace(regEx5, function () {
        	return "";
        });
 		return sanitisedContent.trim();
 	};
 	this.isolateScript = function (rawContent) {
 		// Declare and initiate variables
 		var scriptRegEx = 
 			/<script type="text\/javascript"[^>]*>([\s\S]*?)<\/script>/;
	    var sanitisedContent = (scriptRegEx.exec(rawContent)) ?
	    	scriptRegEx.exec(rawContent)[0] :
	    	"";
 		return sanitisedContent.trim();
 	};
 	this.isolateStyle = function (rawContent) {
 		// Declare and initiate variables
 		var styleRegEx = 
 			/<style type="text\/css\"[^>]*>([\s\S]*?)<\/style>/;
	    var sanitisedContent = (styleRegEx.exec(rawContent)) ?
	    	styleRegEx.exec(rawContent)[0] :
	    	"";
 		return sanitisedContent.trim();
 	};
 	this.buildComponent = function (data) {
 		// Declare and initiate variables
 		var regEx6 = new RegExp("<name/>", "gi");
 		var addTemplateRegEx = new RegExp("<template/>", "gi");
        var addModuleRegEx = new RegExp("<module/>", "gi");
 		var vueComponentTemplate = this.getVueComponentTemplate();
 		var vueComponent = vueComponentTemplate.replace(regEx6, function () {
        	return data.name;
        });
        vueComponent = vueComponent.replace(addTemplateRegEx, function () {
        	return stringify_(data.template);
        });
        vueComponent = vueComponent.replace(addModuleRegEx, function () {
        	return data.module;
        });
        return vueComponent;
 	};
	this.bundleVueComponents = function (components) {
		var rawContent = "";
		var data = {};
		var vueComponent = "";
		var vueComponentBundle = "";
		var singleInstanceComponentNames = "";
		for (var i = 0; i < components.length; i++) {
			rawContent = components[i].file;
			data.name = components[i].name;
            data.template = this.isolateTemplate(rawContent);
            data.module = this.isolateModule(rawContent);
            data.style = this.isolateStyle(rawContent);
            vueComponent = this.buildComponent(data);
            vueComponentBundle += vueComponent.trim() + "\n";
            if (components[i].singleInstanceComponentName) {
            	singleInstanceComponentNames +=
            		components[i].singleInstanceComponentName;
            }
		}
		this.setSingleInstanceComponentNames(singleInstanceComponentNames);
	 	return vueComponentBundle;
	};
	this.bundleCss = function (components) {
		var cssBundle = "";
		for (var i = 0; i < components.length; i++) {
            cssBundle += this.isolateStyle(components[i].file).trim() + "\n";
		}
	 	return cssBundle;
	};
	this.bundleJs = function (components) {
		var jsBundle = "";
		for (var i = 0; i < components.length; i++) {
            jsBundle += this.isolateScript(components[i].file).trim() + "\n";
		}
	 	return jsBundle;
	};
	this.buildStoreModules = function (components) {
		var storeModulesBundle = "";
		var objectInitialisation = "";
		var regEx = {};
		for (var i = 0; i < components.length; i++) {
            storeModulesBundle +=
            	this.isolateScript(components[i].file).trim() + "\n";
            if (components[i].objectInitialisation) {
            	objectInitialisation +=
            		components[i].objectInitialisation.trim() + ",\n" 
            }
		}
		regEx = new RegExp("<objectInitialisation/>", "gi");
	    storeModulesBundle = storeModulesBundle.replace(regEx, function () {
        	return objectInitialisation;
        });
	 	return storeModulesBundle;
	};
	this.getBundlesAsObject = function () {
		return {
			vueModulesBase: this.getVueModulesBase(),
			vueModulesView: this.getVueModulesView(),
			cssLibraries: this.getCssLibraries(),
		    jsLibraries: this.getJsLibraries(),
		    vueCoreMainTemplate: this.getVueCoreMainTemplate(),
		    vueFramework: this.getVueFramework(),
		    vueCoreMainJs: this.getVueCoreMainJs(),
		    vueStoreModules: this.getVueStoreModules(),
		    vueMixin: this.getVueMixin(),
		    singleInstanceComponentNames:
				this.getSingleInstanceComponentNames()
		};
	};
	this.build = function (appConfig) {
		this.setVueModulesBase(
			this.bundleVueComponents(appConfig.vueModules.base)
		);
		this.setVueModulesView(
			this.bundleVueComponents(appConfig.vueModules.view)
		);
 		this.setCssLibraries(this.bundleCss(appConfig.cssLibraries));
        this.setJsLibraries(this.bundleJs(appConfig.jsLibraries));
        this.setVueCoreMainTemplate(
        	this.isolateTemplate(appConfig.vueCoreMainTemplate.file)
        );
        this.setVueCoreMainJs(this.bundleJs(appConfig.vueCoreMainJs));
        this.setVueStoreModules(
        	this.buildStoreModules(appConfig.vueStoreModules)
        );
        this.setVueFramework(
        	this.isolateScript(appConfig.vueFramework.file)
        );
        this.setVueMixin(
        	this.isolateScript(appConfig.vueMixin.file)
        );
        return this;
	};
	// constructors
	this.build(appConfig);
}