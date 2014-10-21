var request = require('request');
var cheerio = require('cheerio');
var parseType = require('./type-parser');
var root_url = 'http://comiclist.com';

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
