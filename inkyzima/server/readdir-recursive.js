/*
TODO
options obj: how deep, ignore by name, ignore big folders
(stats) times, sort by times, filesize
slice recursion (level-by-level rather than going deep)
first xk files, then stop

DB with changes per day, so you can say: file x has been created on x, then  [array of modification days], then deleted on x
	DB evolution
duplicate file names checker (probably using sort)
	which is the newest?

search for a file (recursively in folders) and return stats of it
	fuzzy search/regex

DB cleanup plan by file/folder access/modify/change/birth dates 
	since all up to day x has been deep archived, no need to keep things that have not been modified since then
	
stop writing on ctrl+c kill
performance improvement
*/

var fs = require("fs");

/*
@param {string} logfile - absolute path to log file to be created/overwritten
@param {string} path - absolute starting path for the function
@param {string} howdeep - how many levels to go recursively. use progressively
@param {boolean} [dirsonly] - if yes, only the dir names get logged instead of the files
*/
function reademall (logfile, path, howdeep, dirsonly) {
	//input error handling
	if (logfile.indexOf(":") === -1) throw "absolute paths plz!";
	if (path.indexOf(":") === -1) throw "absolute paths plz!";
	howdeep = parseInt(howdeep);
	if (howdeep < 0 || howdeep > 100) throw "can recurse only 0 to 100 levels deep";
	
	var log = fs.createWriteStream(logfile);
	var startt = new Date().getTime();
	var howoftentoodeep = 0;
	reademallint(path,howdeep, 0);
	
	function reademallint (path, howdeep, currentlvl) {
		var ls = fs.readdirSync(path);
		for (let i = 0 ; i<ls.length ; i++) {
			let termcounter = currentlvl;
			try {
				let currentstats = fs.statSync(path + "\\" + ls[i]);
				if (currentstats.isFile()) { //console.log("isfile");
					////console.log(path + "\\" + ls[i] + " is file");
					if (!dirsonly) log.write(path + "\\" + ls[i] + "\n");
				} else if (currentstats.isDirectory()) {//console.log("isdirectory");
					termcounter++;
					//console.log(termcounter);
					if (termcounter > howdeep) {howoftentoodeep++; return;}
					else {
						if (dirsonly) log.write(path + "\\" + ls[i] + "\n");
						if (path === "D:\\") {reademallint(path + ls[i], howdeep , termcounter)} else {reademallint(path + "\\" + ls[i], howdeep, termcounter)}
					}
				}
				
			}catch(err){
				log.write(err.toString() + "\n");
			};
		}
	}
	
	var endt = new Date().getTime(); 
	let deepstring = "finished with " + howoftentoodeep + " times going too deep.";
	let benchstring = "finished in " + ((endt - startt) / 1000) + " seconds.";
	// console.log(deepstring);
	// console.log(benchstring);
	return [howoftentoodeep, ((endt - startt) / 1000) ];
}

function reademall_sliced (logfile, path, howdeep, dirsonly) {
		//input error handling
	if (logfile.indexOf(":") === -1) throw "absolute paths plz!";
	if (path.indexOf(":") === -1) throw "absolute paths plz!";
	howdeep = parseInt(howdeep);
	if (howdeep < 0 || howdeep > 100) throw "can recurse only 0 to 100 levels deep";
	
	var log = fs.createWriteStream(logfile);
	/*
	process.on('SIGINT', function () {
	  //log.close();
	  console.log("detected sigint");
	  process.exit(0);
	});
	*/
	var startt = new Date().getTime();
	var howoftentoodeep = 0;
	
	var ls = fs.readdirSync(path);
	shallow(ls, howdeep, 0);
	function shallow (ls, maxlvl, currentlvl) {
		var queue = [];
		var currentstats;
		for (let i = 0 ; i < ls.length ; i++) {
			try 
				{
				if (!(path === "D:\\")) {
					currentstats = fs.statSync(path + "\\" + ls[i]);
				} else {
					currentstats = fs.statSync(path + ls[i]);
				}
				if (currentstats.isFile()) {
					if (!dirsonly) log.write(path + "\\" + ls[i] + "\n");
				} else if (currentstats.isDirectory()) {
					if (dirsonly) log.write(path + "\\" + ls[i] + "\n");
					if (path === "D:\\") {
						fs.readdirSync(path + "\\" + ls[i]).forEach((el) => {
							queue.push(ls[i] + "\\" + el);
						});
					} else {
						fs.readdirSync(path + "\\" + ls[i]).forEach((el)=> {
							queue.push(ls[i] + "\\" + el);
						});
					}
				}
			} catch (err) {
				log.write(err.toString() + "\n");
			}
		}
		if (!(currentlvl > maxlvl)) {
			if (queue.length === 0) {console.log("finished shallow prematurely with max lvl: " +currentlvl); return;}
			shallow(queue ,maxlvl, currentlvl+1);
		} else {
			howoftentoodeep++;
			console.log("finished shallow!");
		}

	}
	var endt = new Date().getTime(); 
	return [howoftentoodeep, ((endt - startt) / 1000) ];
}

// variant: ignore folders with over bigfolder elements
function reademall_x (logfile, path, howdeep, dirsonly) {
	//input error handling
	if (logfile.indexOf(":") === -1) throw "absolute paths plz!";
	if (path.indexOf(":") === -1) throw "absolute paths plz!";
	howdeep = parseInt(howdeep);
	if (howdeep < 0 || howdeep > 100) throw "can recurse only 0 to 100 levels deep";
	
	var log = fs.createWriteStream(logfile);
	var startt = new Date().getTime();
	var howoftentoodeep = 0;
	reademallint(path,howdeep, 0);
	
	function reademallint (path, howdeep, currentlvl) {
		var bigfolder = 50;
		var ls = fs.readdirSync(path);
		if (ls.length >= bigfolder) { // big folder
			log.write(path + " ignored: Has over " +bigfolder+ " elements." + "\n");
			return;
		}
		for (let i = 0 ; i<ls.length ; i++) {
			let termcounter = currentlvl;
			try {
				let currentstats = fs.statSync(path + "\\" + ls[i]);
				if (currentstats.isFile()) { //console.log("isfile");
					////console.log(path + "\\" + ls[i] + " is file");
					if (!dirsonly) log.write(path + "\\" + ls[i] + "\n");
				} else if (currentstats.isDirectory()) {//console.log("isdirectory");
					termcounter++;
					//console.log(termcounter);
					if (termcounter > howdeep) {howoftentoodeep++; return;}
					else {
						if (dirsonly) log.write(path + "\\" + ls[i] + "\n");
						if (path === "D:\\") {reademallint(path + ls[i], howdeep , termcounter)} else {reademallint(path + "\\" + ls[i], howdeep, termcounter)}
					}
				}
				
			}catch(err){
				log.write(err.toString() + "\n");
			};
		}
	}
	
	var endt = new Date().getTime(); 
	let deepstring = "finished with " + howoftentoodeep + " times going too deep.";
	let benchstring = "finished in " + ((endt - startt) / 1000) + " seconds.";
	// console.log(deepstring);
	// console.log(benchstring);
	return [howoftentoodeep, ((endt - startt) / 1000) ];
}


module.exports = {reademall,reademall_x, reademall_sliced};

