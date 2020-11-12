const readline = require('readline');
var webdriverCommands = require('./webdriverCommands.js');


function getSearchTerm(){
	const rl = readline.createInterface({
  	input: process.stdin,
  	output: process.stdout
	});
		rl.question('What do you want to search? ', (startingpoint) => {
	  	searchTerm = startingpoint	  	
	  	// TODO: Log the answer in a database
	  	console.log(`Thanks, I will search ${startingpoint} for you now` );
	  	webdriverCommands.wiki(startingpoint);
	});	
}

exports.getSearchTerm = getSearchTerm;
