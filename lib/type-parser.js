var volumePattern = /Volume [0-9]+/;
var issuePattern = /#[0-9]+/;

module.exports = function(issue) {

	var raw_name = issue.raw_name;
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
		issue.volume_num = volumeNum;
	}

	if(idx) {
		issue.title = raw_name.substr(0,idx-1);
	}

	return issue;
}
