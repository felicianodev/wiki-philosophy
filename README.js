This is a script to automatically play the "Wikipedia:getting to philosophy" game. 

more information: https://en.wikipedia.org/wiki/Wikipedia:Getting_to_Philosophy

In theory starting from any term and clicking the first non-parenthesized should eventually lead to the page for Philosophy.
This script uses webdriverio and selenium to do that automatically

INSTALL DEPENDENCIES:
npm i webdriverio
npm i selenium-standalone
./node_modules/selenium-standalone/bin/selenium-standalone install
./node_modules/selenium-standalone/bin/selenium-standalone start

START THE SCRIPT:
node wiki_philosophy.js
