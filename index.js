var express = require("express");
var app = express();

var port = 3000;
var link = "0.0.0.0";

app.use("/", express.static("Wubba"));
app.use("/lib", express.static("lib"));

app.listen(port, link, function(){
	console.log("Server started on " + link + ":" + port);
});