var should = require('should');
var parseType = require('../lib/type-parser');

describe('type-parser',function() {

	it('hardcover',function() {
		var titles = [
			'Avengers: Do Thing Volume 2 HC',
			'Spiderman HC',
			'HC Pawn HC'
		];

		for(var i=0; i < titles.length;i++) {
			var issue = parseType({raw_name: titles[i]});
			issue.type.should.equal('hardcover');
		}
	});

	it('trade paperback',function() {
		var titles = [
			'Avengers: Do Thing Volume 2 TP',
			'Spiderman TP',
			'HC Pawn TP'
		];

		for(var i=0; i < titles.length;i++) {
			var issue = parseType({raw_name: titles[i]});
			issue.type.should.equal('trade paperback');
		}
	});


	it('graphic novel',function() {
		var titles = [
			'Avengers: Do Thing Volume 2 GN',
			'Spiderman GN',
			'HC Pawn GN'
		];

		for(var i=0; i < titles.length;i++) {
			var issue = parseType({raw_name: titles[i]});
			issue.type.should.equal('graphic novel');
		}
	});

	it('volume number',function() {
		var titles = [
			'Avengers: Do Thing Volume 2 GN',
			'Swamp Thing Volume 23',
			'Animal Man Volume 1337 TP'
		];

		for(var i=0; i < titles.length;i++) {
			var issue = parseType({raw_name: titles[i]});
			var issueIdx = /[0-9]+/.exec(titles[i]).index;
			issue.volume_num.should.equal(parseInt(titles[i].substr(issueIdx),10));
		}
	});

	it('issue number',function() {
		var titles = [
			'Avengers #2',
			'Swamp Thing #23',
			'Animal Man #1337',
			'Batman #1 (1 of 4)'
		];

		for(var i=0; i < titles.length;i++) {
			var issue = parseType({raw_name: titles[i]});
			var issueIdx = /[0-9]+/.exec(titles[i]).index;
			issue.type.should.equal('single issue');
			issue.issue_num.should.equal(parseInt(titles[i].substr(issueIdx),10));
		}
	});

});
