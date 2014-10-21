# ComicList Scraper
[![Build Status](https://secure.travis-ci.org/dmamills/comic-list.png)](http://travis-ci.org/dmamills/comic-list)

Scrapes the upcoming comic book releases from [ComicList](http://comiclist.com) and converts them into a json array.

### Usage

```
var comiclist = require('comic-list');

comiclist(function(comics) {
	comics.forEach(function(issue) {
		console.log(issue.raw_name);
	});
});
````

You will recieve an array of objects in the following structure
```
{ 
	publisher: 'MARVEL COMICS',
	store_url: 'http://www.shareasale.com/r.cfm?u=167587&b=84187&m=8908&afftrack=special1&urllink=www.tfaw.com/Profile/All-New-X-Factor-15___460564%3Fqt%3Dssnrp20141020',
	raw_name: 'All-New X-Factor #15',
	type: 'single issue',
	issue_num: 15,
	title: 'All-New X-Factor'
}

```

Possible types are
* hardcover
* graphic novel
* trade paperback
* single issue

### Tests

Tests are written with mocha and shouldjs, run using `npm test`

### Note

I'm just a comicbook fan who needed this for his own personal gains, I have no affliation with ComicList, just tons of affection.
