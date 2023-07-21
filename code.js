var appPrefs = {
	outlineFont: "Ubuntu",
	outlineFontSize: 17,
	outlineLineHeight: 27,
	flInitOutlinerKeys: false
	};

const urlInitialOutline = "http://scripting.com/code/sallyreader/hellosally.opml";
const urlIndexMenu = "http://scripting.com/code/sallyreader/indexmenu.opml";

function httpRequest (url, timeout, headers, callback) {
	timeout = (timeout === undefined) ? 30000 : timeout;
	var jxhr = $.ajax ({ 
		url: url,
		dataType: "text", 
		headers,
		timeout
		}) 
	.success (function (data, status) { 
		callback (undefined, data);
		}) 
	.error (function (status) { 
		var message;
		try { //9/18/21 by DW
			message = JSON.parse (status.responseText).message;
			}
		catch (err) {
			message = status.responseText;
			}
		var err = {
			code: status.status,
			message
			};
		callback (err);
		});
	}
function readOutline (urlOpml, callback) {
	httpRequest (urlOpml, undefined, undefined, callback);
	}

function viewOutline (urlOpml, callback) {
	var whenstart = new Date ();
	readOutline (urlOpml, function (err, opmltext) {
		if (err) {
			console.log ("viewOutline: urlOpml == " + urlOpml + ", err.message == " + err.message);
			callback (err);
			}
		else {
			console.log ("viewOutline: urlOpml == " + urlOpml + ", secs == " + secondsSince (whenstart)); 
			opInitOutliner (opmltext, true, true);
			if (callback !== undefined) {
				callback ();
				}
			}
		});
	}
function buildOutlinesMenu (urlOpml, idMenuToInsertAfter) {
	console.log ("buildOutlinesMenu: urlOpml == " + urlOpml);
	readOutline (urlOpml, function (err, opmltext) {
		if (!err) {
			xmlBuildMenusFromOpmltext (opmltext, idMenuToInsertAfter, function (theUrl) {
				viewOutline (theUrl);
				});
			}
		});
	}
function startup () {
	function initMenus () {
		var cmdKeyPrefix = getCmdKeyPrefix (); //10/6/14 by DW
		$("#idMenubar .dropdown-menu li").each (function () {
			var li = $(this);
			var liContent = li.html ();
			liContent = liContent.replace ("Cmd-", cmdKeyPrefix);
			li.html (liContent);
			});
		}
	console.log ("startup");
	
	viewOutline (urlInitialOutline, function () {
		opFirstSummit ();
		opExpand (1);
		});
	buildOutlinesMenu (urlIndexMenu, "idOutlinerMenu");
	
	hitCounter ();
	}
