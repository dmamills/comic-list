const cheerio   = require('cheerio');
const parseType = require('./type-parser');
const request   = require('request');
const util      = require('util');

const ROOT_URL    = 'http://comiclist.com';
const PRICE_REGEX = /\$[0-9]+.[0-9]{2}/;
const RELEASE_DATE_REGEX = /(?:.*?, ){1}(.*[^.])/;

var scrape = new Promise(function(resolve, reject) {
	var comics = [];

	request(ROOT_URL, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var $ = cheerio.load(body);
			var page_title = $('h1')[0].children[0].data
			var release_date = new Date(page_title.match(RELEASE_DATE_REGEX)[1]).toJSON();

			$('p').each(function(i,el) {
				var pEl = $(el);
				var firstChild = pEl.children().first();

				if(firstChild) {
					var publisher = firstChild.children().first().children().first().text();
					if(!publisher || publisher === '') return;

					var issues = pEl.children().each(function(i,el) {
						if(i==0)return; 

						var store_url = $(this).attr('href') || undefined; 
						var raw_name  = $(this).text() || undefined;
						var issue = {
							publisher,
							store_url,
							raw_name,
							release_date
						};

						if(el.next.type === 'text') {
							var m = PRICE_REGEX.exec(el.next.data);
							if(m !== null) {
								issue.price = m[0].substr(1);
							}
						}

						if(store_url && raw_name) {
							comics.push(issue);
						}
					});
				}
			});

			comics.forEach(function(issue) {
				issue = parseType(issue);
			});

			resolve(comics);
		} else {
			reject(err);
		}
	});
});

module.exports = scrape;
