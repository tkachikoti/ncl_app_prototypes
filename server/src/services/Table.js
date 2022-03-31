/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
 * @author scott.clark.sc18@gmail.com (Scott Clark)
 */
/**
* Access and modify Google Sheets files.
* @typedef {Object} Spreadsheet
* Access and modify spreadsheet sheets.
* @typedef {Object} Sheet
* @typedef {Object} DatabaseClassObject
* A class object that allows for data manipulation
* of Database.
*/
/**
* Opens a sheet (database table) within a given google sheet file 
* (database) by the database table name (name.table).
* For more information about flat file database operations, visit:
* https://en.wikipedia.org/wiki/Flat-file_database
* For a guide on how to utilise google sheets as a flat file database
* visit: https://developers.google.com/apps-script/reference/spreadsheet/
* @param {Object} name - An object containg the name of the database and/or
* table to be opened.
* @param {String} name.database - the name of the database.
* @param {String} name.table - the name of the database table.
* @return {DatabaseClassObject} - the database table data as an object.
**/
function Table_(name, database) {
    // Declare and initiate variables
    var tableName = "";
    var array = [];
    var objectArray = [];
    var map = {};
    var columnHeader = {};
    // get and set methods
    this.getTableName = function () {
        return tableName;
    };
    this.setTableName = function (name) {
        tableName = name;
        return this;
    };
    this.getArray = function () {
        return array;
    };
    this.setArray = function (newArray) {
        array = newArray;
    };
    this.getObjectArray = function () {
        return objectArray;
    };
    this.setObjectArray = function (newArray) {
        objectArray = newArray;
    };
    this.getMap = function () {
        return map;
    };
    this.setMap = function (key, value) {
        map[key.toString()] = value;
    };
    this.getTableData = function (name) {
        // set parameter defaults
        name.table = (name.table) ?
            this.setTableName(name.table) :
            this.setTableName();
        this.setArray(database.getSheetByName(this.getTableName())
            .getDataRange().getValues());
        return this;
    };
    this.setTableData = function (data, options) {
        var tableName = this.getTableName();
        var array = this.getArray();
        var columnHeader = this.getColumnHeader();
        var id = {};
        var timestamp = new Date().getTime();
        var i = 1;
        var applyAllPendingTableChanges = true;
        if (Object.keys(options).length) {
            applyAllPendingTableChanges =
                (typeof options.applyAllPendingTableChanges === "boolean") ?
                    options.applyAllPendingTableChanges :
                    true;
        }
        if (data.rowRef) {
            data.updatedAt = timestamp;
            data.append.splice(columnHeader.updatedAt, 1, timestamp);
            if (applyAllPendingTableChanges) {
                database.getSheetByName(tableName)
                    .getRange(data.rowRef + 1, 1, 1, array[0].length)
                    .setValues([data.append]);
            }
            array[data.rowRef] = data.append;
            this.setArray(array);
        } else {
            id = this.createId();
            if (columnHeader.idColumn && !data[columnHeader.idColumn.name]) {
                data[columnHeader.idColumn.name] = id.idValue;
                data.append.splice(columnHeader.idColumn.index, 1, id.idValue);
            }
            data.tableRowId = id.tableRowId;
            data.append.splice(columnHeader.tableRowId, 1, id.tableRowId);
            data.createdAt = timestamp;
            data.append.splice(columnHeader.createdAt, 1, timestamp);
            if (applyAllPendingTableChanges) {
                database.getSheetByName(tableName).appendRow(data.append);
            }
            array.push(data.append);
            this.setArray(array);
        }
        delete data.append;
        return this;
    };
    /**
     * A function that facilitates the programmatic deletion of a table row 
     * based on the zero index of the row.
     * @param {number} rowPosition - a zero index integer which corresponding
     * to the row to be deleted.
     */
    this.deleteTableRow = function (rowPosition) {
        // Declare and initiate variables
        var tableName = this.getTableName();
        var _array = this.getArray();
        database.getSheetByName(tableName).deleteRow(Number(rowPosition + 1));
        _array.splice(rowPosition, 1);
        this.setArray(_array);
        return this;
    };
    /**
     * A function that creates an id, ensuring it does not duplicate one that
     * is already in use on the given table. It first generates a random number 
     * then checks it against other numbers on the given table (tableData).
     * If the newly generated number matches one on tableData, the inner loop 
     * counter rests and another random number is generated. The process is 
     * repeated until either the newly generated number does not match any of
     * the ids on the tableData, or, b = tableDataL.
     * @param {Object} columnHeader: an object with tableData column headers as
     * property ids and column indices as corresponding property values.
     * @param {Array.<Object>} tableData: an array containing data from a given
     * database table.
     * @return {Number} A number representing a unique Id on the given table.
     */
    this.createId = function () {
        var array = this.getArray();
        var arrayL = array.length;
        var columnHeader = this.getColumnHeader;
        var min = Math.ceil(1000);
        var max = Math.floor(9999999999);
        var complete = false;
        var match = false;
        var idValue = 0;
        var tableRowId = "";
        var i = 1;
        while (!complete) {
            idValue = Math.floor(Math.random() * (max - min + 1)) + min;
            tableRowId = createNonce_();
            match = false;
            i = 1;
            for (i; i < arrayL; i += 1) {
                try {
                    if (array[i][columnHeader.createdAt]) {
                        if (array[i][columnHeader.idColumn.index] === idValue) {
                            match = true;
                            break;
                        } else if (array[i][columnHeader.tableRowId] === tableRowId) {
                            match = true;
                            break;
                        }
                    }
                } catch (err) {
                    if (array[i][columnHeader.createdAt]) {
                        if (array[i][columnHeader.tableRowId] === tableRowId) {
                            match = true;
                            break;
                        }
                    }
                }
            }
            complete = (!match) ? true : false;
        }
        return {
            idValue: idValue,
            tableRowId: tableRowId
        };
    };
    this.getColumnHeader = function () {
        return columnHeader;
    };
    this.setColumnHeader = function () {
        // Declare and initiate variables
        var REG_EX = "_";
        this.getArray()[0].forEach(
            function (element, index) {
                if (element.match(REG_EX)) {
                    element = element.replace(REG_EX, "");
                    columnHeader[element] = Number(index);
                    columnHeader.idColumn = {};
                    columnHeader.idColumn.name = element;
                    columnHeader.idColumn.index = Number(index);
                } else {
                    columnHeader[element] = Number(index);
                }
            }
        );
        return this;
    };
    this.removeDataProcessingOptionsFromKey = function (key) {
        // Declare and initiate variables
        try {
            key.forEach(
                function (element, index) {
                    if (element === "breakLoop" || element === "indexBy") {
                        key.splice(index, 1);
                    }
                }
            );
        } catch (err) {
        }
        return this;
    };
    /**
     * Iterates through a given database table (tableName) and creates an
     * Object. Column headers are the property ids. The data entries which are
     * associated with the given user identification number (uid), are the
     * corresponding property values. Following this, the newly populated Object
     * is pushed into an array. The process repeats until b = tableDataL. Thus, 
     * creating an array of objects, which contain all of the data associated with
     * the given uid.
     * @param {Number} uid: a unique number that represents a specific user.
     * @param {String} tableName: the name of the database to iterate over.
     * @return {Array.<Object> or <Object>} if dataArray > 1 then it returns
     * an object array containing all of the data from the given 
     * tableName, that is associated with the given uid. However, if
     * dataArray <= 1 then it returns an object instead.
     */
    this.getDataBy = function (data) {
        // set parameter defaults
        data = (data) ? data : {};
        // Declare and initiate variables
        var array = this.getArray();
        var arrayL = array.length;
        var columnHeader = this.getColumnHeader();
        var i = 1;
        var j = 0;
        var object = {};
        var key = Object.keys(data);
        var parseData = this.parseData();
        var objectArray = [];
        var breakLoop = (data.breakLoop) ? true : false;
        var rowRefOrTableRowIdMatch = false;
        var indexBy = (data.indexBy) ? data.indexBy : "tableRowId";
        this.removeDataProcessingOptionsFromKey(key);
        if (data.rowRef && data.tableRowId) {
            try {
                if (array[data.rowRef][columnHeader.tableRowId] ===
                    data.tableRowId) {
                    i = data.rowRef;
                    rowRefOrTableRowIdMatch = true;
                    breakLoop = true;
                }
            } catch (err) {
                console.error(stringify_(err));
            }
        }
        if (!rowRefOrTableRowIdMatch && data.tableRowId) {
            for (var k = 0; k < arrayL; k += 1) {
                if (array[k][columnHeader.tableRowId]) {
                    if (array[k][columnHeader.tableRowId] ===
                        data.tableRowId) {
                        i = k;
                        rowRefOrTableRowIdMatch = true;
                        breakLoop = true;
                        break;
                    }
                }
            }
        }
        for (i; i < arrayL; i += 1) {
            if (rowRefOrTableRowIdMatch ||
                array[i][columnHeader[key[0]]] === data[key[0]] ||
                !key) {
                object = {};
                array[0].forEach(
                    function (element, index) {
                        parseData(object, element, array[i][index]);
                    }
                );
                object.rowRef = i;
                objectArray.push(object);
                this.setMap(array[i][columnHeader[indexBy]], object);
                if (breakLoop) {
                    break;
                }
            }
        }
        //console.info("Table_ - objectArray: " + JSON.stringify(objectArray));
        this.setObjectArray(objectArray);
        return this;
    };
    this.parseData = function () {
        return function (object, element, data) {
            var key = "";
            var REG_EX = "_";
            element = element.replace(REG_EX, "")
            try {
                object[element] = JSON.parse(data);
                /*
                if (typeof object[element] === "object" &&
                    !Array.isArray(object[element])) {
                    for (key in object[element]) {
                        if (object[element].hasOwnProperty(key)) {
                            try {
                                object[element + "_" + key] =
                                    JSON.parse(object[element][key]);
                            } catch (err) {
                                object[element + "_" + key] =
                                    object[element][key];
                            }
                        }
                    }
                }
                */
            } catch (err) {
                object[element] = data;
            }
            return this;
        };
    };
    this.sortBy = function (referenceKey, ascendingSortOrder) {
        // set parameter defaults
        referenceKey = referenceKey ? referenceKey : "";
        // Declare and initiate variables
        this.setObjectArray(sortArrayBy_({
            referenceKey: referenceKey,
            objectArray: objectArray,
            ascendingSortOrder: ascendingSortOrder
        }));
        return this;
    };
    this.removeColumn = function (data) {
        // Declare and initiate variables
        var dataL = data.length;
        var objectArray = this.getObjectArray();
        var i = 0;
        for (i; i < dataL; i += 1) {
            objectArray.forEach(
                function (object) {
                    delete object[data[i]];
                }
            );
        }
        //console.info("removeColumn_ - objectArray: " + JSON.stringify(objectArray));
        this.setObjectArray(objectArray);
        return this;
    };
    this.removeDuplicates = function (referenceKey) {
        // sort
        this.sortBy(referenceKey);
        // Remove duplicates
        var objectArray = this.getObjectArray();
        var objectArrayL = objectArray.length;
        for (var i = 0; i < objectArrayL; i += 1) {
            try {
                if (objectArray[i][referenceKey] === objectArray[i + 1][referenceKey]) {
                    objectArray.splice(i, 1);
                    i -= 1;
                }
            } catch (err) { }
        }
        //console.info("removeDuplicates_ - objectArray:" + JSON.stringify(objectArray));
        this.setObjectArray(objectArray);
        return this;
    };
    this.stringifyAllObjectsInArray = function (array) {
        // Declare and initiate variables
        var parsedElement = "";
        array.forEach(function (element, index) {
            try {
                if (typeof element === "object") {
                    array.splice(
                        index,
                        1,
                        JSON.stringify(element)
                    );
                } else if (typeof element === "string") {
                    parsedElement = JSON.parse(element);
                    if (typeof parsedElement === "object") {
                        array.splice(
                            index,
                            1,
                            JSON.stringify(parsedElement)
                        );
                    }
                }
            } catch (err) {
            }
        });
        return this;
    };
    this.removeRestrictedFields = function (data, keys) {
        // Declare and initiate variables
        delete data.append;
        keys.forEach(function (element, index) {
            if (element === "createdAt" ||
                element === "updatedAt" ||
                element === "tableRowId") {
                keys.splice(index, 1);
            }
        });
        return this;
    };
    this.setDataByRow = function (data, options) {
        // set parameter defaults
        data = data ? data : {};
        options = options ? options : {};
        // Declare and initiate variables
        var array = this.getArray();
        var arrayL = array.length;
        var columnHeader = this.getColumnHeader();
        var keys = Object.keys(data);
        var i = 1;
        this.removeRestrictedFields(data, keys);
        if (data.rowRef) {
            if (data.tableRowId === array[data.rowRef][columnHeader.tableRowId]) {
                data.append = array[data.rowRef];
            } else {
                // send security alert
                // log this
            }
        }
        if (!data.append) {
            if (data.tableRowId) {
                for (i; i < arrayL; i += 1) {
                    if (array[i][columnHeader.tableRowId]) {
                        if (array[i][columnHeader.tableRowId] ===
                            data.tableRowId) {
                            data.rowRef = i;
                            data.append = array[data.rowRef];
                            break;
                        }
                    }
                }
            }
        }
        if (!data.append) {
            data.append = [];
            array[0].forEach(
                function () {
                    data.append.push("");
                }
            );
        }
        keys.forEach(function (element) {
            try {
                if (columnHeader[element]) {
                    if (element !== "createdAt" ||
                        element !== "updatedAt" ||
                        element !== "tableRowId") {
                        data.append.splice(
                            columnHeader[element],
                            1,
                            data[element]
                        );
                    }
                }
            } catch (err) {
            }
        });
        this.stringifyAllObjectsInArray(data.append);
        this.setTableData(data, options);
        return this;
    };
    this.setDataByArray = function () {
        var array = this.getArray();
        var tableName = this.getTableName();
        database.getSheetByName(tableName)
            .getRange(1, 1, array.length, array[0].length)
            .setValues(array);
        SpreadsheetApp.flush();
        return this;
    };
    /**
     * A function that facilitates the programmatic changing of column headers
     * @param {string} columnHeader: a camel case string corresponding to the 
     * column header to be modified
     * @param {string} modifiedColumnHeader: a camel case string to replace 
     * the existing column header
     */
    this.updateColumnHeader = function (columnHeader, modifiedColumnHeader) {
        var _array = this.getArray();
        var _columnHeader = this.getColumnHeader();
        var _tableName = this.getTableName();
        var _isValidHeader = false;
        var protectedColumnHeaders = [
            "createdAt",
            "updatedAt",
            "tableRowId"
        ];
        // validation
        if (_columnHeader[columnHeader] &&
                typeof modifiedColumnHeader === "string" &&
                _array[0].lastIndexOf(modifiedColumnHeader) === -1) {
            _isValidHeader = true;
        }
        if (protectedColumnHeaders.some(function (protectedColumnHeader) {
            return protectedColumnHeader.toLowerCase() ===
                columnHeader.toLowerCase();
        })) {
            // column header is protected
            $WorkflowManager.setStore({
                commit: "setErrors",
                data: {
                    type: "serverMessage",
                    message: "The column header \'" + columnHeader +
                        "\' is a protected keyword, and as such, " +
                        "cannot be used as a column header. Please " +
                        "use an alternative column header."
                }
            });
        } else if (_isValidHeader) {
            try {
                database.getSheetByName(_tableName)
                    .getRange(1, _columnHeader[columnHeader] + 1)
                    .setValue(modifiedColumnHeader);
                _array[0][_columnHeader[columnHeader]] = modifiedColumnHeader;
                this.setArray(_array);
                this.setColumnHeader();
            } catch (err) {
                // error in changing cloud state
                $WorkflowManager.setStore({
                    commit: "setErrors",
                    data: {
                        type: "serverMessage",
                        message: "There was an error in " +
                            "accessing the database while trying to " +
                            "update the column header. " +
                            "Please try again later."
                    }
                });
            }
        } else {
            // column not in table or column already exists
            $WorkflowManager.setStore({
                commit: "setErrors",
                data: {
                    type: "serverMessage",
                    message: "The column header, " + columnHeader +
                        ", you have selected to " +
                        "update either does not exist, " +
                        "or " + modifiedColumnHeader + " appears in the" +
                        " table already. Please choose a different value."
                }
            });
        }
        return this;
    };
    /**
     * A function that facilitates the programmatic deletion of columns 
     * based on a given header
     * @param {string} columnHeader: a camel case string corresponding to the 
     * header of the column to be deleted
     */
    this.deleteTableColumn = function (columnHeader) {
        var _tableName = this.getTableName();
        var _columnHeader = this.getColumnHeader();
        var _array = this.getArray();
        var protectedColumnHeaders = [
            "createdAt",
            "updatedAt",
            "tableRowId"
        ];
        if (protectedColumnHeaders.some(function (protectedColumnHeader) {
            return protectedColumnHeader.toLowerCase() ===
                columnHeader.toLowerCase();
        })) {
            // column header is protected
            $WorkflowManager.setStore({
                commit: "setErrors",
                data: {
                    type: "serverMessage",
                    message: "The column header \'" + columnHeader +
                        "\' is a protected keyword, and as such, " +
                        "cannot be used as a column header. Please " +
                        "use an alternative column header."
                }
            });
        } else if (_columnHeader[columnHeader]) {
            try {
                database.getSheetByName(_tableName).deleteColumn(
                    Number(_columnHeader[columnHeader] + 1)
                );
                _array.forEach(function (element) {
                    element.splice(_columnHeader[columnHeader], 1);
                });
                this.setArray(_array);
                this.setColumnHeader();
            } catch (err) {
                // error in changing cloud state
                $WorkflowManager.setStore({
                    commit: "setErrors",
                    data: {
                        type: "serverMessage",
                        message: "There was an error in " +
                            "accessing the database while trying to" +
                            "delete the table column." +
                            "Please try again later."
                    }
                });
            }
        } else {
            // column is not in the table or column appears twice
            $WorkflowManager.setStore({
                commit: "setErrors",
                data: {
                    type: "serverMessage",
                    message: "The column, " + columnHeader +
                        ", you have selected to " +
                        "delete either does not exist, " +
                        "Please choose a different value."
                }
            });
        }
        return this;
    };
    // Constructor
    this.getTableData(name);
    this.setColumnHeader();
}