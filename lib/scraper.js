var request = require('request');
var cheerio = require('cheerio');
var root_url = 'http://comiclist.com';

function parseType(issue) {

	var raw_name = issue.raw_name;
	var volumePattern = /Volume [0-9]+/;
	var issuePattern = /#[0-9]+/;

	var l = raw_name.substr(raw_name.length-2);	
	var idx;
	if(l === 'HC') {
		issue.type = 'hardcover';
		issue.title = raw_name.substr(0,3);
	} else if(l === 'GN') {
		issue.type = 'graphic novel';
		issue.title = raw_name.substr(0,3);
	} else if(l === 'TP') {
		issue.type = 'trade paperback';
		issue.title = raw_name.substr(0,3);
	}

	if(issuePattern.test(raw_name)) {
		idx = issuePattern.exec(raw_name).index;
		var issueNum = parseInt(raw_name.substr(idx+1),10);
		issue.type = 'single issue';
		issue.issue_num = issueNum;
	}

	if(volumePattern.test(raw_name)) {
		idx = volumePattern.exec(raw_name).index;
		var volumeNum = parseInt(raw_name.substr(idx+7),10);
		issue.volume_number = volumeNum;
	}

	if(idx) {
		issue.title = raw_name.substr(0,idx-1);
	}


	return issue;
}

var scrape = function(cb) {

	var comics = [];
	request(root_url,function(err,res,body) {
		var $ = cheerio.load(body);
		$('p').each(function(i,el) {
			var pEl = $(el);
			
			var firstChild = pEl.children().first();
			if(firstChild) {
				var publisher = firstChild.children().first().children().first().text();
				if(!publisher || publisher === '') return;

				var issues = pEl.children().each(function(i,el) {
					if(i==0)return; 
					
					var store_url = $(this).attr('href') || undefined; 
					var raw_name = $(this).text() || undefined;
					var issue = {
						publisher:publisher,
						store_url:store_url,
						raw_name:raw_name
					};

					if(store_url && raw_name) {
						comics.push(issue);
					}
				});
			}
		});

		comics.forEach(function(issue) {
			issue = parseType(issue);
		});

		cb(comics);
	});
}

module.exports = scrape;
