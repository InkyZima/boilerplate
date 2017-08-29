
var inky = require("./csv-byline-operator.js");

inky.bylinefun("unicode_test.txt",bla);

function bla (el){return el.split(";").join(" ")}