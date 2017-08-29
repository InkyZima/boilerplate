
var fs = require("fs");

var readdirrec = require("./readdir-recursive.js");

var documentspath = "D:\\users\\f18825b\\Documents";

var logfilepath = documentspath + "\\" + "readdir.txt";
var startpath = "D:\\";
var startt = new Date().getTime();
var res = readdirrec.reademall_sliced(logfilepath, startpath,15);

/*
for (let i = 0 ; i < 4 ; i++) {
	var res = readdirrec.reademall_sliced(logfilepath, startpath,i);
	fs.appendFileSync("dirstats.csv", i + ";" + res[0] + ";" + res[i] + "\n");
}*/
var endt = new Date().getTime();
var bencht = (endt - startt) / 1000;
console.log("finished in " + bencht + " seconds");

//fs.readdirSync(documentspath).forEach((el) => console.log(fs.statSync(el))); 