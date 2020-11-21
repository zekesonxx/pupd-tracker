const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const child_process = require('child_process');

const GITROOT = child_process.execSync("git rev-parse --show-toplevel", { encoding: 'utf8' }).trim();

const $ = cheerio.load(fs.readFileSync(path.join(GITROOT, 'pages', 'warrants.html')));

/*
 * A typical line we deal with looks something like this:
 * UNDERWOOD, Renita C.----------(DOB: 5-17-72) <br/> FAILURE TO APPEAR-CHECK DECEPTION
 * This carefully extracts the data, cleans it up, and echos a CSV of it.
 */

// CSV header
console.log("name,dob,reason");
$('article p').each(function(k, b) {
	// Split the string for any double linebreaks. Sometimes two records are within one <p>, this handles that
	$(this).html().split(/<br\/?><br\/?>/).forEach((line) => {
		// Ignore the initial Date line
		if (line.startsWith('Date')) { return; }


		var line = line.replace(/<br\/?>/, '');
		var tmp = line.split(/-{3,}/);
		// If there wasn't any case of -------... in the string, then we have some bogus line
		// Just ignore it
		if (!tmp[1]) { return; }

		// Extract the fields with some shifty trickery
		var name = tmp.shift().trim();
		var tmp = tmp.join('-').split(/\)/);;
		var dob = tmp.shift();

		// run the reason through cheerio to parse out any special characters
		var reason = cheerio.load(tmp.join(')').trim()).text();
		// date of birth extraction
		if (dob.indexOf('Unknown') != -1) {
			dob = 'Unknown';
		} else {
			var dobext = /([0-9]{1,2})-([0-9]{1,2})-([0-9]{1,4})/.exec(dob);
			var month = parseInt(dobext[1]).toString().padStart(2, '0');
			var day = parseInt(dobext[2]).toString().padStart(2, '0');
			var year = parseInt(dobext[3]);
			// turn the 2 digit year into a 4 digit year
			if (year < 100) {
				if (year > 25) { // 1900s vs 2000s breaking point. Currently set at 2025.
					year += 1900;
				} else {
					year += 2000;
				}
			}
			dob = year + '-' + month + '-' + day;
		}
		console.log(`"${name}",${dob},"${reason.replace('"', '""')}"`);
	});
});
