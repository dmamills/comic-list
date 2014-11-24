var request = require('request');
var cheerio = require('cheerio');
var parseType = require('./type-parser');
var root_url = 'http://comiclist.com';

var util = require('util');
var scrape = function(cb) {

	var comics = [];
	request(root_url,function(err,res,body) {
		var $ = cheerio.load(body);
		var release_date  = new Date($('h3')[1].children[0].data).toJSON();
		var PRICE_REGEX = /\$[0-9]+.[0-9]{2}/;

		$('p').each(function(i,el) {
			var pEl = $(el);

			var firstChild = pEl.children().first();
			if(firstChild) {
				var publisher = firstChild.children().first().children().first().text();
				if(!publisher || publisher === '') return;

				var issues = pEl.children().each(function(i,el) {
					if(i==0)return; 

					//3console.log(el);
					var price = null;
					if(el.next.type === 'text') {
						var m = PRICE_REGEX.exec(el.next.data);
						if(m !== null) {
							price = m[0].substr(1);
						}
					}
					
					var store_url = $(this).attr('href') || undefined; 
					var raw_name = $(this).text() || undefined;
					var issue = {
						publisher:publisher,
						store_url:store_url,
						raw_name:raw_name,
						release_date:release_date
					};

					if(price) issue.price = price;

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
