/**
 * @fileoverview Neelu back-end.
 * @author tinashekachikoti@gmail.com (Tinashe Nigel Kachikoti)
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
function Database_(name) {
    // Declare and initiate variables
    var databaseName = "";
    var database = {};
    var table = [];
    // get and set methods
    this.getDatabaseName = function () {
        if (!databaseName) {
            this.setDatabaseName();
        }
        return databaseName;
    };
    this.setDatabaseName = function (name) {
        databaseName = (name) ? name : "NEELU_DB";
        return this;
    };
    this.getDatabase = function () {
        if (!Object.keys(database).length) {
            this.setDatabase();
        }
        return database;
    };
    this.setDatabase = function () {
        // set parameter defaults
        switch (this.getDatabaseName()) {
            case "NEELU_DB":
                database = SpreadsheetApp.openById(
                    $Properties.get("NEELU_DB")
                );
                break;
            case "OTHER":
                database = SpreadsheetApp.openById(
                    "1Uu-_opkcwrkFphrluutnYbXrrdCRNmhX7n2XUDGBRaY"
                );
                break;
            default:
                database = null;
        }
        return this;
    };
    this.getTableStateObjectFromTableArray = function (tableArray, tableName) {
        // Declare and initiate variables
        var tableStateObject = {};
        for (var i = 0; i < tableArray.length; i+=1) {
            if (tableArray[i].getTableName() === tableName) {
                tableStateObject = tableArray[i];
                break;
            }
        }
        return tableStateObject;
    };
    this.createTable = function (tableName, columnHeaders) {
        // set parameter defaults
        tableName = (tableName) ?
            tableName :
            "";
        columnHeaders = (Array.isArray(columnHeaders)) ?
            columnHeaders :
            [];
        // Declare and initiate variables
        var HUNDRED_AND_TWENTY_EIGHT_CHARACTERS = 128;
        var ONE_TABLE_ROW = 1;
        var ONE_TABLE_COLUMN = 1;
        var DEFAULT_NUMBER_OF_TABLE_ROWS = 10;
        var defaultColumnHeadersBackgroundColor = "#CCCCCC";
        var columnHeadersBackgroundColor = "#073763";
        var columnHeadersFontColor = "#FFFFFF";
        var columnHeadersFontWeight = "bold";
        var defaultColumnHeaders = [
            "createdAt",
            "updatedAt",
            "tableRowId"
        ];
        var arrayOfAllTableColumnHeaders = copyObject_(defaultColumnHeaders);
        columnHeaders.forEach(function (columnHeader) {
            arrayOfAllTableColumnHeaders.push(columnHeader);
        });
        var totalNumberOfColumns = arrayOfAllTableColumnHeaders.length;
        // validation
        // tableName
        validCamelCase_("Table Name", tableName);
        validCharacterLength_(
            "Table Name",
            tableName,
            HUNDRED_AND_TWENTY_EIGHT_CHARACTERS
        );
        validTypeOf_(
            "Table Name",
            tableName,
            "string"
        );
        stringContains_({
            field: "Table Name",
            string: tableName,
            match: "table"
        });
        // columnHeader
        if (columnHeaders.length) {
            columnHeaders.forEach(function (columnHeader, index) {
                validCharacterLength_(
                    "Column Header [" + index + "]",
                    columnHeader,
                    HUNDRED_AND_TWENTY_EIGHT_CHARACTERS
                );
                validTypeOf_(
                    "Column Header [" + index + "]",
                    columnHeader,
                    "string"
                );
                if (defaultColumnHeaders.some(function (defaultColumnHeader) {
                    return defaultColumnHeader.toLowerCase() ===
                        columnHeader.toLowerCase();
                })) {
                    $WorkflowManager.setStore({
                        commit: "setErrors",
                        data: {
                            type: "serverMessage",
                            message: "The column header \'" + columnHeader +
                                "\' is a protected keyword, and as such, " +
                                "cannot be used as a column header. Please " +
                                "use an alternative column header." +
                                "If this issue persists, please contact " +
                                "an administrator for assistance. "
                        }
                    });
                }
            });
        }
        // validation complete
        // create table
        this.getDatabase().insertSheet(tableName);
        // add columns
        this.getDatabase().getSheetByName(tableName)
            .getRange(
                ONE_TABLE_ROW,
                ONE_TABLE_COLUMN,
                ONE_TABLE_ROW,
                arrayOfAllTableColumnHeaders.length
            ).setValues([arrayOfAllTableColumnHeaders]);
        // delete excess rows
        this.getDatabase().getSheetByName(tableName)
            .deleteRows(
                Number(DEFAULT_NUMBER_OF_TABLE_ROWS + ONE_TABLE_ROW),
                Number(
                    this.getDatabase()
                        .getSheetByName(tableName).getMaxRows() -
                    DEFAULT_NUMBER_OF_TABLE_ROWS
                )
            );
        // delete excess columns
        this.getDatabase().getSheetByName(tableName)
            .deleteColumns(
                Number(totalNumberOfColumns + ONE_TABLE_COLUMN),
                Number(
                    this.getDatabase()
                        .getSheetByName(tableName).getMaxColumns() -
                    totalNumberOfColumns
                )
            );
        // Set the background color of all defaultColumnHeaders and rows
        this.getDatabase().getSheetByName(tableName)
            .getRange(
                ONE_TABLE_ROW,
                ONE_TABLE_COLUMN,
                DEFAULT_NUMBER_OF_TABLE_ROWS,
                defaultColumnHeaders.length
            ).setBackground(defaultColumnHeadersBackgroundColor);
        // Set the background color of all columnHeaders
        if (columnHeaders.length) {
            this.getDatabase().getSheetByName(tableName)
                .getRange(
                    ONE_TABLE_ROW,
                    Number(defaultColumnHeaders.length + ONE_TABLE_COLUMN),
                    ONE_TABLE_ROW,
                    columnHeaders.length
                ).setBackground(columnHeadersBackgroundColor);
            // Set font color for columnHeaders
            this.getDatabase().getSheetByName(tableName)
                .getRange(
                    ONE_TABLE_ROW,
                    Number(defaultColumnHeaders.length + ONE_TABLE_COLUMN),
                    ONE_TABLE_ROW,
                    columnHeaders.length
                ).setFontColors([
                    columnHeaders.map(function () {
                        return columnHeadersFontColor;
                    })
                ]);
        }
        // set font weight for column headers
        this.getDatabase().getSheetByName(tableName)
            .getRange(
                ONE_TABLE_ROW,
                ONE_TABLE_COLUMN,
                ONE_TABLE_ROW,
                totalNumberOfColumns
            ).setFontWeights([
                arrayOfAllTableColumnHeaders.map(function () {
                    return columnHeadersFontWeight;
                })
            ]);
        return this;
    };
    this.getTable = function (tableName) {
        // set parameter defaults
        tableName = tableName || table[0].getTableName();
        // Declare and initiate variables
        var tableStateObject = {};
        if (!Object.keys(database).length) {
            this.setDatabase();
        }
        if (tableName) {
            tableStateObject = 
                this.getTableStateObjectFromTableArray(table, tableName);
        }
        if (!Object.keys(tableStateObject).length) {
            this.setTable({table: tableName});
            tableStateObject = 
                this.getTableStateObjectFromTableArray(table, tableName);
        }
        return tableStateObject;
    };
    this.setTable = function (name) {
        var tableStateObject = {};
        if (name.table) {
            tableStateObject = new Table_(name, this.getDatabase());
            table.push(tableStateObject);
        }
    };
    // Constructor
    //this.setDatabase(name);
    //this.setTable(name);
}
var $Database = new Database_();