function Autocomplete_Field_(env) {
    // Declare and initiate variables
    //var moduleBundler = new ModuleBundler_();
    this.vueModules = {
        base: [
            {
                name: "TheAppMainView",
                location: "client/src/components/base/" +
                    "TheAutocompleteFieldAppMainView",
                get file () {
                    return HtmlService
                    .createTemplateFromFile(this.location)
                    .getRawContent();
                }
            },
            {
                name: "AppInstructionBox",
                location: "client/src/components/base/AppInstructionBox",
                get file () {
                    return HtmlService
                    .createTemplateFromFile(this.location)
                    .getRawContent();
                }
            },
            {
                name: "TheSnackBar",
                location: "client/src/components/base/TheSnackBar",
                singleInstanceComponentName: "<the-snack-bar/>",
                get file () {
                    return HtmlService
                    .createTemplateFromFile(this.location)
                    .getRawContent();
                }
            },
            {
                name: "AppAutocompleteTextField",
                location: "client/src/components/base/" +
                    "AppAutocompleteTextField",
                get file () {
                    return HtmlService
                    .createTemplateFromFile(this.location)
                    .getRawContent();
                }
            },
            {
                name: "AppChipSet",
                location: "client/src/components/base/AppChipSet",
                get file () {
                    return HtmlService
                    .createTemplateFromFile(this.location)
                    .getRawContent();
                }
            },
            {
                name: "AppVueTable",
                location: "client/src/components/base/AppVueTable",
                get file () {
                    return HtmlService
                    .createTemplateFromFile(this.location)
                    .getRawContent();
                }
            },
            {
                name: "TheSingleInstanceComponents",
                location: "client/src/components/base/" +
                    "TheSingleInstanceComponents",
                get file () {
                    return HtmlService
                    .createTemplateFromFile(this.location)
                    .getRawContent();
                }
            }
        ],
        view: [
            {
                name: "AppTopLevelView",
                location: "client/src/components/base/AppTopLevelView",
                get file () {
                    return HtmlService
                    .createTemplateFromFile(this.location)
                    .getRawContent();
                }
            },
            {
                name: "AutocompleteFieldIndex",
                location: "client/src/components/autocomplete-field/Index",
                get file () {
                    return HtmlService
                    .createTemplateFromFile(this.location)
                    .getRawContent();
                }
            }
        ]
    };
    this.cssLibraries = [
        {
            name: "bootstrap-v4.5.2-css",
            location: "client/src/libraries/bootstrap-v4.5.2",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "NProgressCss",
            location: "client/src/libraries/NProgress-v0.2.0",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "material-components-web-css",
            location: "client/src/libraries/material-components-web",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "Roboto-300-Work-Sans-200",
            location: "client/src/libraries/Roboto-300-Work-Sans-200",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "css",
            location: "client/src/AppUnminified",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        }
    ];
    this.jsLibraries = [
        {
            name: "jQuery-v3.5.1",
            location: "client/src/libraries/jQuery-v3.5.1",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "bootstrap-v4.5.2-js",
            location: "client/src/libraries/bootstrap-v4.5.2",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "material-components-web-js",
            location: "client/src/libraries/material-components-web",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "vue-router-js",
            location: "client/src/libraries/vue-router",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "vuex-js",
            location: "client/src/libraries/vuex",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "moment-v2.24.0-js",
            location: "client/src/libraries/moment-v2.24.0",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "NProgress-js",
            location: "client/src/libraries/NProgress-v0.2.0",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        }
    ];
    this.vueCoreMainTemplate = {
        name: "App",
        location: "client/src/App",
        get file () {
            return HtmlService
            .createTemplateFromFile(this.location)
            .getRawContent();
        }
    };
    this.vueFramework = {
        name: "vueFramework",
        location: "client/src/framework/vue_" + env,
        get file () {
            return HtmlService
            .createTemplateFromFile(this.location)
            .getRawContent();
        }
    };
    this.vueMixin = {
        name: "mixin",
        location: "client/src/mixin/Index",
        get file () {
            return HtmlService
            .createTemplateFromFile(this.location)
            .getRawContent();
        }
    };
    this.vueStoreModules = [
        {
            name: "autocompleteFieldModule",
            objectInitialisation: "autocompleteField: autocompleteFieldModule",
            location: "client/src/store/modules/autocompleteFieldModule",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "systemDataModule",
            objectInitialisation: "systemData: systemDataModule",
            location: "client/src/store/modules/systemDataModule",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "store",
            location: "client/src/store/index",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        }
    ];
    this.vueCoreMainJs = [
        {
            name: "router",
            location: "client/src/router/autocompleteFieldRouter",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "googleAppsScriptApi",
            location: "client/src/googleAppsScriptApi",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        },
        {
            name: "main",
            location: "client/src/main",
            get file () {
                return HtmlService
                .createTemplateFromFile(this.location)
                .getRawContent();
            }
        }
    ];
}