'use strict'
// here all the main webdriver commands happen

var options = ({ capabilities: {browserName: 'chrome'}, logLevel: 'silent'})

var webdriverio = require('webdriverio');
var client;

var wordbank = [];
var hopCount = 0;

// if the searchterm (should be only the first) doesn't exist the search stops early
function isExistingSearchTerm(){
	client.getText('h1#firstHeading.firstHeading').then(function(res){
		if ( res  === 'Search results') {
			client.deleteSession();
		}
		else {
		}
		isPhilosophy();
	})
}

// wikipedia annotations shouldn't be parsed as links
function containsAnumber(string){
	if ( string.match(/[0-9]+/g) !== null) {
	console.log('it contains numbers', string)

		return true
	}
	return false
}

// if the link was already visited stop
function linkAlreadyVisited(string){
	console.log("already visited", wordbank, wordbank.indexOf(string))
	if ( wordbank.indexOf(string) > 1) {
		//console.log(`you already visited that link and are running through a loop \nit took you ${hopCount} hops, through these pages \n-> ${wordbank} \nto get to get to the last page of the loop`)
		return true
	}

}


async function getLink(client) {
	let nthParagraph = 1;
	let nthLink = 1;
	let currentParagraph;

	// wikipedia has some empty paragraphs, we need to get the first ACTUAL paragraph
	async function getValidParagraph(client){
		let paragraph = await client.$(`#mw-content-text > .mw-parser-output > p:nth-of-type(${nthParagraph}`)
   	let paragraphText = await paragraph.getText()

   	// assuming most intro paragraphs have more than 50 chars
		if (paragraphText.length < 50) {
			nthParagraph = nthParagraph + 1
			getValidParagraph(client)
		}
		else {
			currentParagraph = paragraphText
			clickValidLink(client)
		}
	}

	async function clickValidLink(client){
		const link = await client.$(`#mw-content-text > .mw-parser-output > p:nth-of-type(${nthParagraph}) > a:nth-of-type(${nthLink})`)
		const linkText = await link.getText();
		console.log("LINK IS ", linkText, nthParagraph, nthLink)
		const openingBracket = currentParagraph.indexOf('(')
		const closingBracket = currentParagraph.indexOf(')')		
		var subString = currentParagraph.indexOf(linkText)

		// dont wan't to click annotations in brackets, numbers, or links inside parentheses (at least not the first parentheses of the paragraph)
		if (linkText.includes('[') || containsAnumber(linkText) || (subString > openingBracket && subString < closingBracket) ){
			console.log('invalid link', linkText)
			nthLink = nthLink + 1
			clickValidLink(client);
		}

		// link was already visited
		else if (linkAlreadyVisited(linkText)) {
			console.log("break, link already visited")
			await client.deleteSession()
		} else {
			const titleEl = await client.$('h1#firstHeading.firstHeading')
			const titleText = await titleEl.getText()
			await link.click()
			await isPhilosophy(client);			
		}

	}
	getValidParagraph(client)
}

// if the title of the page is Philosophy stop
async function isPhilosophy(client){
	const el = await client.$('h1#firstHeading.firstHeading')

	const text = await el.getText()
		if ( text !== 'Philosophy' ) {
			wordbank.push(text)
			await getLink(client);
		} 
		else {
			console.log(`congratulations, you got to Philosophy \nit took you ${hopCount} hops, through these pages \n-> ${wordbank} \nto get to Philosophy`)
			await client.deleteSession();
		}
}

async function wiki(searchTerm) { 
	client = await webdriverio.remote(options)
	await client.navigateTo('https://wikipedia.org')
  const searchInput = await client.$('input#searchInput')
  await searchInput.setValue(searchTerm)
  const searchBtn = await client.$('button[type="submit"]')
  await searchBtn.click()  	

	.then(function(){
		isPhilosophy(client);
	})
}

exports.wiki = wiki;
