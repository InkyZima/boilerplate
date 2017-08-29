/* loads first excel sheet into sqlite.
creates an .csv with the excel sheet data (UTF-8 encoded!) as a side effect.
*/
/* caller args to load more sheets/sheets by name? */

/*usage: cmd shell -> node xlstosql.js [excel file]*/

var fs = require("fs");
var sqlite = require("sqlite3");
var XLSX = require('xlsx');
const { execSync } = require('child_process');

var c = console.log;

var filename = process.argv[2];

if (!filename) {
	c("no xlsx file provided as argument. exiting.");
	return ;
}
if (filename.indexOf(".xls") < 1) {
	c("please provide filename with file extension (e.g. .xlsx). exiting.");
	return ;
}

var workbook = XLSX.readFile(filename);
var worksheetname = workbook.SheetNames[0];
var worksheet = workbook.Sheets[worksheetname];
filename = filename.split(".")[0];
c("loading sheet " +worksheetname + " into sql db/table of name " + filename);
var csvdata = XLSX.utils.sheet_to_csv(worksheet);
fs.writeFileSync(filename + ".csv", csvdata);

execSync('sqlite3.exe '+filename+'.db "drop table if exists '+filename+';"');
execSync('sqlite3.exe '+filename+'.db ".separator ," ".import '+filename+'.csv '+filename+'"');
c("xlsx -> csv -> sql done.")


