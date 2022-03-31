/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
 */
 function Cache_(scope) {
    // Declare and initiate variables
    var cache = {};
    // get and set methods
    this.getCache = function (scope) {
        if (!Object.keys(cache).length) {
            this.setCache(scope)
        }
        return cache;
    };
    this.setCache = function (scope) {
        // set parameter defaults
        scope = (scope) ? scope : "script";
        switch (scope) {
            case "user":
                cache = CacheService.getUserCache();
                break;
            case "script":
                cache = CacheService.getScriptCache();
                break;
            case "document":
                cache = CacheService.getDocumentCache();
                break;
            default:
                cache = null;
        }
        return this;
    };
    this.get = function (key) {
        // set parameter defaults
        key = (key) ? key : "";
        // Declare and initiate variables
        var cache = this.getCache();
        return parse_(cache.get(key));
    };
    this.set = function (key, data, options) {
        // set parameter defaults
        data = (data) ? data : "";
        options = (options) ? options : {};
        // Declare and initiate variables
        var cache = this.getCache();
        var SIX_HOURS_IN_SECONDS = 21600;
        if (data) {
            if (options.setExpiry) {
                cache.put(
                    key,
                    stringify_(data),
                    options.setExpiry
                );
            } else {
                // expiry defaults to 6 hours
                cache.put(
                    key,
                    stringify_(data),
                    SIX_HOURS_IN_SECONDS
                );
            }
        }
        return this;
    };
    this.getAll = function (key) {
        // set parameter defaults
        key = (key) ? key : "";
        // Declare and initiate variables
        var cache = this.getCache();
        return parse_(cache.getAll(key));
    };
}
var $Cache = new Cache_();