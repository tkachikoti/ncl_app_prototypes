/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
 */
function WorkflowManager_() {
    // set parameter defaults
    // Declare and initiate variables
    var store = {
        commit: [],
        dispatch: []
    };
    var route = "";
    var workflowCompleted = [];
    var callbackOptions = {};
    var activeScript = {};
    // get/set methods
    this.getActiveScript = function () {
        return activeScript;
    };
    this.setActiveScript = function (script) {
        activeScript = script;
        return this;
    };
    this.executeScripts = function (scripts) {
        // Declare and initiate variables
        for (var i = 0; i < scripts.length; i++) {
            console.time("executeScripts - " + scripts[i].serverMethod.name);
            this.setActiveScript(scripts[i]);
            $GlobalScopeRef[scripts[i].serverMethod.name]
                (scripts[i].serverMethod.parameters);
            console.timeEnd("executeScripts - " +
                scripts[i].serverMethod.name);
            this.logActiveScriptAsCompleted();
        }
        return this.getResponse();
    };
    this.getStore = function () {
        return store;
    };
    this.setStore = function (payload, options) {
        if (payload.commit) {
            this.setStoreCommit(payload, options);
        } else if (payload.dispatch) {
            this.setStoreDispatch(payload, options);
        }
        this.checkStoreForSessionIdValidationError();
        if (payload.commit === "setErrors") {
            this.logActiveScriptAsCompleted();
            throw stringify_({
                success: false,
                store: this.getStore(),
                workflowCompleted: this.getWorkflowCompleted()
            });
        }
        return this;
    };
    this.setStoreCommit = function (payload, options) {
        // set parameter defaults
        options = (options) ? options : {};
        // Declare and initiate variables
        var match = false;
        for (var i = 0; i < store.commit.length; i++) {
            if (store.commit[i].commit === payload.commit) {
                if (options.aggregate) {
                    store.commit.push(payload);
                } else {
                    store.commit[i] = payload;
                }
                match = true;
                break;
            }
        }
        if (!match) {
            store.commit.push(payload);
        }
        return this;
    };
    this.setStoreDispatch = function (payload, options) {
        // set parameter defaults
        options = (options) ? options : {};
        // Declare and initiate variables
        var match = false;
        for (var i = 0; i < store.dispatch.length; i++) {
            if (store.dispatch[i].dispatch === payload.dispatch) {
                if (options.aggregate) {
                    store.dispatch.push(payload);
                } else {
                    store.dispatch[i] = payload;
                }
                match = true;
                break;
            }
        }
        if (!match) {
            store.dispatch.push(payload);
        }
        return this;
    };
    this.getRoute = function () {
        return route;
    };
    this.setRoute = function (payload) {
        route = (payload) ?
            payload :
            route;
        return this;
    };
    this.generateStackTrace = function () {
        try {
            throw new Error();
        } catch(e) {
            return e.stack.match(/\(([^)]+)\)/g)[0]
                .replace("(", "")
                .replace(")", "");
        }
    };
    this.logActiveScriptAsCompleted = function () {
        // Declare and initiate variables
        this.setWorkflowCompleted(this.getActiveScript());
        return this;
    };
    this.checkStoreForSessionIdValidationError = function () {
        // Declare and initiate variables
        for (var i = 0; i < store.dispatch.length; i++) {
            if (store.dispatch[i].dispatch === "deleteSessionState" ||
                    store.dispatch[i].dispatch === "deleteUserSessionState") {
                this.setWorkflowCompleted(undefined);
            }
        }
        return this;
    };
    this.getWorkflowCompleted = function () {
        return workflowCompleted;
    };
    this.setWorkflowCompleted = function (workflow) {
        if (typeof workflow === "object") {
            workflowCompleted.push(workflow);
        }
        return this;
    };
    this.getCallbackOptions = function () {
        return callbackOptions;
    };
    this.setCallbackOptions = function (option) {
        var key = Object.keys(option)[0];
        callbackOptions[key] = option[key];
        return this;
    };
    this.getServerBusyResponse = function () {
        this.setStoreCommit({
            commit: "setErrors",
            data: {
                type: "serverMessage",
                message: "Sorry, but our server is currently " +
                    "too busy to process your request. Please " +
                    "wait a moment and try your request again. " +
                    "We apologise for any inconvenience this " +
                    "may have caused you."
            }
        });
        this.logActiveScriptAsCompleted();
        this.checkStoreForSessionIdValidationError();
        throw stringify_({
            success: false,
            store: this.getStore(),
            workflowCompleted: this.getWorkflowCompleted()
        });
        return this;
    };
    this.getResponse = function () {
        SpreadsheetApp.flush();
        return {
            success: true,
            store: this.getStore(),
            route: this.getRoute(),
            workflowCompleted: this.getWorkflowCompleted(),
            options: this.getCallbackOptions()
        };
    };
}
var $WorkflowManager = new WorkflowManager_();