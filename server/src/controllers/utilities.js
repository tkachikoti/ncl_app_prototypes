/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
 */
/**
 * A function that creates a random number, encodes this random number with a 
 * HMAC_SHA_512 algorithm. Finally, it concatenates the aforementioned number 
 * with a unique user identifier (UUID) string, and returns a base 64 encoded
 * string.
 * @return {String} A long string of random characters.
 */
function createNonce_() {
    var min = Math.ceil(100000000000000);
    var max = Math.floor(999999999999999999999999999999);
    var token = Math.floor(Math.random() * (max - min + 1)) + min;
    return sanitiseString_(
        Utilities.base64Encode(
            hashLevelTwo_(
                Utilities.getUuid() + "-" + token + "-" +
                    Date.now() + "-" + Utilities.getUuid()
            )
        )
    );
}
/**
 * Takes a string and splits it (by white space) into an array of strings.
 * returning the string indexed 0. In the context of a full name
 * this function will take the string "Julie Murphy", and turn it into an 
 * array containing ["Julie","Murphy"]. Following this, the function returns
 * the string "Julie".
 * @param {String} fullName: String representing a person's full name.
 * @return {String} String representing a person's first name.
 */
function getFirstName_(fullName) {
    /*
    var fullName = "Julie Murphy";
    var firstName = fullName.split(/\s+/)[0];
    console.info("First Name:" + JSON.stringify(firstName));
    return firstName;
    */
    return fullName.split(/\s+/)[0];
}
/**
 * Takes a string and splits it (by white space) into an array of strings.
 * returning the string indexed last. In the context of a full name
 * this function will take the string "Julie Murphy", and turn it into an 
 * array containing ["Julie","Murphy"]. Following this, the function returns
 * the string "Murphy".
 * @param {String} fullName: String representing a person's full name.
 * @return {String} String representing a person's last name.
 */
function getLastName_(fullName) {
    //var fullName = "Julie Murphy";
    var lastItemInArray = fullName.split(/\s+/).length - 1;
    //var lastName = fullName.split(" ")[lastItemInArray];
    //console.info("Last Name:" + JSON.stringify(lastItemInArray));
    //console.info("Last Name:" + JSON.stringify(lastName));
    return fullName.split(/\s+/)[lastItemInArray];
}
/**
 * Takes an email (e.g. "test@gmail.com") and returns the domain name ("gmail")
 * @param {String} userEmail: String representing an email.
 * @return {String} the domain of the userEmail string.
 */
function getEmailDomain_(userEmail) {
    //var userEmail = "natsegkg.abery@hotmail.co.uk";
    if (userEmail !== null && userEmail !== undefined) {
        var emailRegex = /@(.*)/;
        var domainRegex = /(?:[\w]+\.)+[\w]+/;
        var atDomain = emailRegex.exec(userEmail);
        var result = domainRegex.exec(atDomain);
        var domain = result[0].split(".")[0];
        //console.info("result: " + JSON.stringify(domain));
        return domain;
    }
    return undefined;
}
/**
 * Takes a String and encrypts it using a 512 SHA algorithm and
 * a 300 character key. it then removes the brackets around the 
 * resulting bit array and returns the numbers as a string.
 * @param {String} string: a String to be encrypted.
 * @return {String} the resulting String.
 * every time the client makes a transaction.
 */
function hashLevelOne_(string) {
    var key = $Properties.get("hashLevelOneKey");
    var encrypted = Utilities.computeHmacSignature(
            Utilities
            .MacAlgorithm
            .HMAC_SHA_512, key, string, Utilities
            .Charset.UTF_8
        );
    return stringify_(encrypted).replace(/\[|\]/g, "");
}
function hashLevelTwo_(string, inputKey) {
    var key = inputKey || $Properties.get("hashLevelTwoKey");
    var encrypted = Utilities.computeHmacSignature(
            Utilities
            .MacAlgorithm
            .HMAC_SHA_512, key, string, Utilities
            .Charset.UTF_8
        );
    return stringify_(encrypted).replace(/\[|\]/g, "");
}
/**
 * Creates a random six digit number that serves as a
 * verification code.
 * @param {Number} min: a number representing the lowest possible
 * number the verification code can be.
 * @param {Number} max: a number representing the highest possible
 * number the verification code can be.
 * @return {Number} a random six digit number between min and max.
 */
function generateVerificationCode_() {
    var min = Math.ceil(100000);
    var max = Math.floor(999999);
    //The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Removes special characters from a given string that match
 * santizeRegEx. Returning the string without the aforementioned 
 * special characters in it.
 * @param {String} string: a string that potentially contains 
 * special characters.
 * @return {String} returns string without special characters or throws an
 * error if string is not a String or if string is undefined.
 */
function sanitiseString_(input) {
    //var input = "Leave it out@lads"
    var santizeRegEx = /[^A-Za-z0-9áéíóúñü£$%&@\u0020\\.;:"',?!+_*><\/()\r?\n|\r-]/gim;
    if (typeof input !== "undefined") {
        //console.info("sanitiseString_ - sanitisedString: " + JSON.stringify(sanitisedString));
        return input.replace(santizeRegEx,"").trim();
    } else {
        return "sanitiseString_ failed because typeof is undefined. " +
            "input = " + stringify_(input);
    }
}
function capitaliseString_(string) {
    // Declare and initiate variables
    //string = "Declare and initiate variables";
    var array = string.trim().split(/\s+/);
    var newString = "";
    for (var i = 0; i < array.length; i+=1) {
        newString += array[i].charAt(0).toUpperCase() +
            array[i].slice(1).toLowerCase() + " ";
    }
    //console.info("newString: " + JSON.stringify(newString.trim()));
    return newString.trim();
}
function normaliseCamelCaseString_(string) {
    return capitaliseString_(
        string.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    );
}
function stringify_(input) {
    return JSON.stringify(input);
}
function parse_(input) {
    return JSON.parse(input);
}
function copyObject_(objectData) {
    return parse_(stringify_(objectData));
}
function toLowerCase_(input) {
    return input.toLowerCase().trim();
}
function toUpperCase_(input) {
    return input.toUpperCase().trim();
}
function normaliseSpecialCharactersInString_(string) {
    var normalisedString = "";
    normalisedString = string.replace(/\’/gi, "\'");
    normalisedString = normalisedString.replace(/\‘/gi, "\'");
    return normalisedString;
}
function camelise_(str) {
    var regEx = /[^a-zA-Z0-9]+(.)/g;
    if (str) {
        return str.toLowerCase().replace(
            regEx,
            function(match, chr) {
                return chr.toUpperCase();
            }
        );
    }
}
function generateAbbreviationForString_(string) {
    var characterSplitRegEx = /(?=(?:[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/;
    var words = string.split(" ");
    var characterIndex = 0;
    var characters ="";
    var abbreviatedString = "";
    var increment = 1;
    if (words.length > 1) {
        for (var i = 0; i < words.length; i++) {
            abbreviatedString += words[i].toUpperCase()
                .charAt(characterIndex);
        }
    } else {
        characters = string.split(characterSplitRegEx);
        if (characters.length > 6) {
           for (var i = 0; i < characters.length; i+=increment) {
                abbreviatedString += characters[i].toUpperCase();
                if (i > 5) {
                    break;
                }
            }
        } else {
            abbreviatedString = string.toUpperCase();
        }
    }
    return abbreviatedString;
}
function sortArrayBy_(input) {
    // Declare and initiate variables
    var ascendingSortOrder =
        (typeof input.ascendingSortOrder === "boolean") ?
        input.ascendingSortOrder :
        true;
    var A = "";
    var B = "";
    var objectArray = this.copyObject_(input.objectArray);
    if (ascendingSortOrder) {
        objectArray = objectArray.sort(function(a, b) {
            if (a[input.referenceKey] !== undefined &&
                    b[input.referenceKey] !== undefined &&
                    input.referenceKey) {
                try {
                    A = a[input.referenceKey].toUpperCase();
                    B = b[input.referenceKey].toUpperCase();
                } catch (err) {
                    A = a[input.referenceKey];
                    B = b[input.referenceKey];
                }
                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                // referenceKey must be equal
                return 0;
            } else {
                try {
                    A = a.toUpperCase();
                    B = b.toUpperCase();
                } catch (err) {
                    A = a;
                    B = b;
                }
                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
            }
        });
    } else {
        objectArray = objectArray.sort(function(a, b) {
            if (a[input.referenceKey] !== undefined &&
                    b[input.referenceKey] !== undefined &&
                    input.referenceKey) {
                try {
                    A = a[input.referenceKey].toUpperCase();
                    B = b[input.referenceKey].toUpperCase();
                } catch (err) {
                    A = a[input.referenceKey];
                    B = b[input.referenceKey];
                }
                if (A > B) {
                    return -1;
                }
                if (A < B) {
                    return 1;
                }
                // referenceKey must be equal
                return 0;
            } else {
                try {
                    A = a.toUpperCase();
                    B = b.toUpperCase();
                } catch (err) {
                    A = a;
                    B = b;
                }
                if (A > B) {
                    return -1;
                }
                if (A < B) {
                    return 1;
                }
            }
        });
    }
    return objectArray;
}
function getGenderByFirstName_(fullName) {
    var firstName = getFirstName_(fullName);
    var regEx = new RegExp("firstName", "gi");
    var url = $Properties.get("gender-api-url");
    var response = {};
    url = url.replace(regEx, function () {
        return firstName;
    });
    try {
        response = parse_(UrlFetchApp.fetch(url, {
            "muteHttpExceptions": true
        }).getContentText());
    } catch (err) {
        console.error(stringify_(err));
    }
    return (response.gender === "male" || response.gender === "female") ?
        response.gender :
        "";
}
function getPreviousAcademicYear_(currentAcademicYear) {
    var splitCurrentAcademicYear =
        currentAcademicYear.split("/").map(function (element) {
            return Number(element);
        });
    return Number(splitCurrentAcademicYear[0] - 1) +
        "/" +
        Number(splitCurrentAcademicYear[1] - 1);
}
function getNextAcademicYear_(currentAcademicYear) {
    var splitCurrentAcademicYear =
        currentAcademicYear.split("/").map(function (element) {
            return Number(element);
        });
    return Number(splitCurrentAcademicYear[0] + 1) +
        "/" +
        Number(splitCurrentAcademicYear[1] + 1);
}
function getPercentageDifference_(a, b, decimalPlaces) {
    decimalPlaces = (typeof decimalPlaces === "number") ?
        decimalPlaces : 
        2;
    var HUNDRED_PERCENT = 100;
    var value = HUNDRED_PERCENT * Math.abs((a - b) / ((a + b)/2));
    return parseFloat(
        Number(
            Math.round(parseFloat(value + 'e' + decimalPlaces)) +
                "e-" + decimalPlaces
        ).toFixed(decimalPlaces)
    );
}
function getFixedPointNotation_(number, decimalPlaces) {
    decimalPlaces = (typeof decimalPlaces === "number") ?
        decimalPlaces : 
        2;
    return Number.parseFloat(number).toFixed(decimalPlaces);
}
function sumIntegersInObject_(object, keys) {
    var sum = 0;
    var arrayLength = keys.length;
    for (var i = 0; i < arrayLength; i++) {
        if (Number(object[keys[i]])) {
            sum += Number(object[keys[i]]);
        }
    }
    return sum;
}
/**
 * Original code from: https://dev.to/afewminutesofcode/how-to-convert-an-array-into-an-object-in-javascript-25a4
 */
function convertArrayToObject_(array, key) { 
    return array.reduce(function (accumulator, currentValue) {
        accumulator[currentValue[key]] = currentValue;
        return accumulator;
    }, {});
}
/**
 * A function that creates a time string in the format HH:MM
 * @param {number} timeInMilliseconds: a number which
 * corresponds to the unix timestamp milliseconds
 * @returns {string} time in the format HH:MM
 */
function getTimeString_(timeInMilliseconds) {
    var timeString = ""
    if (new Date(timeInMilliseconds).toString() !== "Invalid Date") {
        timeString = moment.tz(timeInMilliseconds, "Europe/London")
            .format("HH:MM:SS z");
    }
    return timeString;
}
/**
 * A function that creates a date string in the format
 * DDDD DD MMMM YYYY.
 * @param {number} timeInMilliseconds: a number which
 * corresponds to the unix timestamp milliseconds
 * @returns {string} date in the format DDDD DD MMMM YYYY
 */
function getDateString_(timeInMilliseconds) {
    var dateString = "";
    if (new Date(timeInMilliseconds).toString() !== "Invalid Date") {
        dateString = moment.tz(timeInMilliseconds, "Europe/London")
            .format("Do MMMM YYYY");
    }
    return dateString;
}