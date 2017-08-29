
var fs = require("fs");
var rl = require("readline");

/*
reads a csv. performs a by-line operation (passed function). creates a new csv with result of operation in new column.
operation must take 1 argument and return a string synchronously
*/

function byline(inputcsv, outputcsv, op, colindex) {
	var read = rl.createInterface({input: fs.createReadStream(inputcsv)});
	var write = fs.createWriteStream(outputcsv);
	read.on("line", (data) => {
		if (colindex !== undefined) {
			let row = data.split(";");
			data += ";" + op(row[colindex]) + "\n";
		} else {
			data += ";" + op(data) + "\n";
		}
		write.write(data);
	});

	read.on("end" , () => {
		setTiemout(write.close(),1000);
	});
}

/* variant with function name in new file name */
function bylinefun(inputcsv, op, colindex) {
	var newfilename;
	if (inputcsv.substr(inputcsv.length-4,1) === ".") {
		newfilename = inputcsv.substr(0, inputcsv.length-4) + "_" + op.name + inputcsv.substr(inputcsv.length-4,4);
	} else {
		newfilename = inputcsv + "_" + op.name;
	}
	return byline(inputcsv, newfilename, op, colindex);
}

module.exports = {byline, bylinefun};