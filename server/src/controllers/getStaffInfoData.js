function getStaffInfoData (input) {
    let staffInfoArray = [];
    //let url = "https://www.ncl.ac.uk/elll/staff/atoz";
    let options = {
        'muteHttpExceptions': true,
    };
    let response = UrlFetchApp.fetch(input.urlInput, options);
    let rawHTML = response.getContentText();
    let staffElementsArray = getStaffElementsFromNCLStaffPage_(rawHTML);
    staffInfoArray = staffElementsArray.map(function (rawHTML) {
        let nameObject = getNameObjectFromRawHTML_(rawHTML);
        let email = getEmailStringFromRawHTML_(rawHTML);
        return {
            firstName: nameObject.firstName,
            lastName: nameObject.lastName,
            email: email
        };
    }).filter(function (staffMember) {
        return staffMember.firstName;
    });

    /*
    Logger.log("staff members: " + stringify_(staffInfoArray.length));

    staffInfoArray = staffInfoArray.filter(function (staffMember) {
        return staffMember.firstName && staffMember.email;
    });
    Logger.log("staff members with emails: " + stringify_(staffInfoArray.length));
    */

    //addDataToDataTable_(staffInfoArray);
    /*
    staffInfoArray.forEach(function (staffMember) {
        Logger.log(stringify_(staffMember));
    });
    */
    $WorkflowManager.setStore({
        commit: "setDataFromArray",
        data: {
            arrayName: "staffInfoData",
            arrayData: staffInfoArray
        }
    }, {aggregate: true});
    if (Array.isArray(staffInfoArray) && staffInfoArray.length) {
        $WorkflowManager.setStore({
            commit: "setDataFromArray",
            data: {
                arrayName: "staffInfoCSVFriendlyData",
                arrayData: staffInfoArray.map(function (staffMember) {
                    let fullNameInCSVFormat = '"' + staffMember.lastName + ", " +
                        staffMember.firstName + '"';
                    return [
                        fullNameInCSVFormat,
                        staffMember.email
                    ];
                })
            }
        }, {aggregate: true});
        $WorkflowManager.setStore({
            commit: "setSnackBarMessages",
            data: {
                message: "Data capture successful."
            }
        }, {aggregate: true});
    } else {
        $WorkflowManager.setStore({
            commit: "setSnackBarMessages",
            data: {
                message: "Data capture failed, please check your URL and try again."
            }
        }, {aggregate: true});
    }
    $WorkflowManager.setRoute(input.route || "");
    return;
}

function getStaffElementsFromNCLStaffPage_(rawHTML) {
    var staffElementTopLevelRegEx =
        /<div class="staff"[^>]*>([\s\S]*?)<\/div>\r\n<\/div>/g;
    var isolatedstaffElementsArray = rawHTML.match(staffElementTopLevelRegEx);
    if (!Array.isArray(isolatedstaffElementsArray)) {
        staffElementTopLevelRegEx =
            /<div class="relatedPerson"[^>]*>([\s\S]*?)<\/div>\n\t\r\n<\/div>/g;
        isolatedstaffElementsArray = rawHTML.match(staffElementTopLevelRegEx);
    }
    return (Array.isArray(isolatedstaffElementsArray)) ?
        isolatedstaffElementsArray :
        [];
}

function getNameObjectFromRawHTML_(rawHTML) {
    var nameTopLevelRegEx = /<div class="name"[^>]*>([\s\S]*?)<\/div>/g;
    var nameTopLevelRegEx2 = /<h4>(.*)\<\/h4>/;
    var nameBottomLevelRegEx = /\\t(.*)\<\/a>/;
    var nameObject = {
        firstName: "",
        lastName: ""
    };
    if (typeof rawHTML === "string" && rawHTML) {
        let nameObjectFromRawHTML =
            rawHTML.match(nameTopLevelRegEx);
        let regExNameOutput = (nameObjectFromRawHTML) ?
            stringify_(nameObjectFromRawHTML).match(nameBottomLevelRegEx) :
            rawHTML.match(nameTopLevelRegEx2);
        if (Array.isArray(regExNameOutput)) {
            let fullName =
                removeStopWordsFromString_(regExNameOutput[1].trim());
            nameObject = {
                firstName: getStaffMemberFirstName_(fullName),
                lastName: getStaffMemberLastName_(fullName)
            }
        }
    }
    return nameObject;
}

function getEmailStringFromRawHTML_(rawHTML) {
    var emailTopLevelRegEx = /<a class="email"[^>]*>([\s\S]*?)<\/a>/g;
    var emailTopLevelRegEx2 = /mailto:(.*)\">/;
    var emailBottomLevelRegEx = /\>(.*)\<\/a>/;
    var emailString = "";
    if (typeof rawHTML === "string" && rawHTML) {
        let emailObjectFromRawHTML =
            rawHTML.match(emailTopLevelRegEx);
        let regExEmailOutput = (emailObjectFromRawHTML) ?
            stringify_(emailObjectFromRawHTML).match(emailBottomLevelRegEx) :
            rawHTML.match(emailTopLevelRegEx2);
        if (Array.isArray(regExEmailOutput)) {
            emailString = regExEmailOutput[1].trim();
        }
    }
    return emailString;
}

function removeStopWordsFromString_(stringInput) {
    var STOP_WORDS = [
        "dr",
        "professor",
        "emeritus",
        "mbe"
    ];
    var modifiedWordArray = [];
    if (typeof stringInput === "string" && stringInput) {
        let wordArray =
            normaliseString_(stringInput).split(/\s+/);
        if (stringInput.toLowerCase().indexOf("theresa") >= 0) {
            Logger.log("stringInput: " + stringify_(stringInput));
            Logger.log("wordArray: " + stringify_(wordArray));
        }
        wordArray.forEach(function (word) {
            if (!STOP_WORDS.some(function (stopWord) {
                    return word.toLowerCase() === stopWord;
            })) {
                modifiedWordArray.push(word);
            }
        });
    }
    return (modifiedWordArray.length) ?
        modifiedWordArray.join(" ") :
        "";
}

function normaliseString_(stringInput) {
    var normalisedStringInput = "";
    if (typeof stringInput === "string" && stringInput) {
        normalisedStringInput =
        renderHTMLEncodedCharacters_(stringInput)
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return (normalisedStringInput) ?
        normalisedStringInput :
        string;
}

function renderHTMLEncodedCharacters_(stringInput) {
    var modifiedStringInput = "";
    try {
        if (typeof stringInput === "string" && stringInput) {
            let document = XmlService.parse('<d>' + stringInput + '</d>');
            modifiedStringInput = document.getRootElement().getText();
        }
    } catch (err) {}
    return (typeof modifiedStringInput === "string" && modifiedStringInput) ?
        modifiedStringInput :
        stringInput;
}

function getStaffMemberFirstName_(fullName) {
    return fullName.split(/\s+/)[0];
}

function getStaffMemberLastName_(fullName) {
    var MINIMUM_NUMBER_OF_WORDS = 1;
    return (typeof fullName === "string" &&
            fullName.split(/\s+/).length > MINIMUM_NUMBER_OF_WORDS) ?
        fullName.substr(fullName.indexOf(" ") + MINIMUM_NUMBER_OF_WORDS) :
        "";
}

function addDataToDataTable_(dataArray) {
    dataArray.forEach(function (element) {
        $Database.getTable("nclStaffInfoTable").setDataByRow(element, {
            applyAllPendingTableChanges: false
        });
    });
    if (Array.isArray(dataArray) && dataArray.length) {
        $Database.getTable("nclStaffInfoTable").setDataByArray();
    }
    return;
}

function generateCharacterArray_(stringInput) {
    var characterArray = [];
    if (typeof stringInput === "string" && stringInput) {
        let stringInputArray = stringInput.split('');
        stringInputArray.forEach(function (character) {
            if (character) {
                characterArray.push(character.toLowerCase());
            }
        });
    }
    return characterArray;
}

function removeDuplicatesFromCharacterArray_(characterArray) {
    var duplicateFreeCharacterArray = characterArray.concat();
    for (var i = 0; i < duplicateFreeCharacterArray.length; ++i) {
        for (var j = i + 1; j < duplicateFreeCharacterArray.length; ++j) {
            if (duplicateFreeCharacterArray[i] ===
                    duplicateFreeCharacterArray[j]) {
                duplicateFreeCharacterArray.splice(j--, 1);
            }
        }
    }
    return duplicateFreeCharacterArray;
}

function calculateTextCosineSimilarity_(textA, textB) {
    var cosineSimilarity = 0;
    const characterArrayA = generateCharacterArray_(textA);
    const characterArrayB = generateCharacterArray_(textB);
    var characterArrayIndex = removeDuplicatesFromCharacterArray_(
        characterArrayA.concat(characterArrayB)
    );
    const vectorA =
        characterArrayToVector_(characterArrayA, characterArrayIndex);
    const vectorB =
        characterArrayToVector_(characterArrayB, characterArrayIndex);
    cosineSimilarity = Number(getFixedPointNotation_(
        100 * calculateCosineSimilarity_(vectorA, vectorB),
        0
    ));
    return (typeof cosineSimilarity === "number") ?
        cosineSimilarity :
        0;
}

function characterArrayToVector_(characterArray, characterArrayIndex) {
    var vector = [];
    characterArrayIndex.forEach(function (indexCharacter) {
        let characterCounter = 0;
        characterArray.forEach(function (character) {
            if (indexCharacter === character) {
                characterCounter += 1;
            }
        });
        vector.push(characterCounter);
    });
    return vector;
}

function dotProduct_(vectorA, vectorB){
    let product = 0;
    for (let i = 0; i < vectorA.length; i++) {
        product += vectorA[i] * vectorB[i];
    }
    return product;
}

function magnitude_(vector) {
    let sum = 0;
    for (let i = 0; i < vector.length; i++) {
        sum += vector[i] * vector[i];
    }
    return Math.sqrt(sum);
}

function calculateCosineSimilarity_(vectorA, vectorB){
    return dotProduct_(vectorA, vectorB) /
        (magnitude_(vectorA) * magnitude_(vectorB));
}

function getLocalPartFromEmail_(email) {
    var localPart = "";
    if (typeof email === "string" && email) {
        localPart = email.substring(0, email.indexOf("@"));
    }
    return localPart;
}

function findStaffMemberEmailFromArray_(staffMemberName, emailsArray) {
    var textCosineSimilarity = 0;
    var textCosineSimilarityCache = 0;
    var indexCache = null;
    if (typeof staffMemberName === "string" &&
                staffMemberName &&
                Array.isArray(emailsArray)
        ) {
        emailsArray.forEach(function (email, index) {
            textCosineSimilarity = calculateTextCosineSimilarity_(
                staffMemberName,
                getLocalPartFromEmail_(sanitiseLocalPartOfEmail_(email))
            )
            if (textCosineSimilarity > textCosineSimilarityCache) {
                indexCache = index;
                textCosineSimilarityCache = textCosineSimilarity;
            }
        });
    }
    return (doesStringContainAnySelectedWords_(
                emailsArray[indexCache],
                staffMemberName.split(/\s+/)
            )
        ) ?
        emailsArray[indexCache] :
        "";
}

function sanitiseLocalPartOfEmail_(email) {
    var STOP_CHARACTERS = [
        ".",
        "-"
    ];
    STOP_CHARACTERS.forEach(function (character) {
        email = email.replace(character, function () {
            return "";
        });
    });
    return email;
}

function doesStringContainAnySelectedWords_(string, wordsArray) {
    var doesStringContainAnySelectedWords = false;
    if (typeof string === "string" &&
            Array.isArray(wordsArray) &&
            string) {
        wordsArray.forEach(function (word) {
            if (string.toLowerCase().indexOf(word.toLowerCase()) >= 0) {
                doesStringContainAnySelectedWords = true;
            }
        });
    }
    return doesStringContainAnySelectedWords;
}