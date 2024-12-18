// serverstatus.js
var error = 0;
var d = 0;
var server_status = new Array();

function timeSince(date) {
	if(date == 0)
		return "Never.";

	var seconds = Math.floor((new Date() - date) / 1000);
	var interval = Math.floor(seconds / 31536000);

	if (interval > 1)
		return interval + " Years ago.";
	interval = Math.floor(seconds / 2592000);
	if (interval > 1)
		return interval + " Months ago.";
	interval = Math.floor(seconds / 86400);
	if (interval > 1)
		return interval + " Days ago.";
	interval = Math.floor(seconds / 3600);
	if (interval > 1)
		return interval + " Hours ago.";
	interval = Math.floor(seconds / 60);
	if (interval > 1)
		return interval + " Minutes ago.";
	/*if(Math.floor(seconds) >= 5)
		return Math.floor(seconds) + " seconds";*/
	else
		return "Seconds ago.";
}

function bytesToSize(bytes, precision, si)
{
	var ret;
	si = typeof si !== 'undefined' ? si : 0;
	if(si != 0) {
		var kilobyte = 1000;
		var megabyte = kilobyte * 1000;
		var gigabyte = megabyte * 1000;
		var terabyte = gigabyte * 1000;
	} else {
		var kilobyte = 1024;
		var megabyte = kilobyte * 1024;
		var gigabyte = megabyte * 1024;
		var terabyte = gigabyte * 1024;
	}

	if ((bytes >= 0) && (bytes < kilobyte)) {
		return bytes + ' B';

	} else if ((bytes >= kilobyte) && (bytes < megabyte)) {
		ret = (bytes / kilobyte).toFixed(precision) + ' K';

	} else if ((bytes >= megabyte) && (bytes < gigabyte)) {
		ret = (bytes / megabyte).toFixed(precision) + ' M';

	} else if ((bytes >= gigabyte) && (bytes < terabyte)) {
		ret = (bytes / gigabyte).toFixed(precision) + ' G';

	} else if (bytes >= terabyte) {
		ret = (bytes / terabyte).toFixed(precision) + ' T';

	} else {
		return bytes + ' B';
	}
	if(si != 0) {
		return ret + 'B';
	} else {
		return ret + 'iB';
	}
}

function uptime() {
	$.getJSON("json/stats.json", function(result) {
		$("#loading-notice").remove();
		if(result.reload)
			setTimeout(function() { location.reload(true) }, 1000);

		let total_in = 0;
		let total_out = 0;
		for (var i = 0, rlen=result.servers.length; i < rlen; i++) {
			var TableRow = $("#servers tr#r" + i);
			var ExpandRow = $("#servers #rt" + i);
			var hack; // fuck CSS for making me do this
			if(i%2) hack="odd"; else hack="even";
			if (!TableRow.length) {
				$("#servers").append(
					"<tr id=\"r" + i + "\" data-toggle=\"collapse\" data-target=\"#rt" + i + "\" class=\"accordion-toggle " + hack + "\">" +
						"<td id=\"online4\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"ip_status\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"name\">Loading</td>" +
						"<td id=\"type\">Loading</td>" +
						"<td id=\"location\">Loading</td>" +
						"<td id=\"uptime\">Loading</td>" +
						"<td id=\"load\">Loading</td>" +
						"<td id=\"network\">Loading</td>" +
						"<td id=\"traffic\">Loading</td>" +
						"<td id=\"cpu\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"memory\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"hdd\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"ping\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
					"</tr>" +
					"<tr class=\"expandRow " + hack + "\"><td colspan=\"16\"><div class=\"accordian-body collapse\" id=\"rt" + i + "\">" +
						"<div id=\"expand_mem\">Loading</div>" +
						"<div id=\"expand_swap\">Loading</div>" +
						"<div id=\"expand_hdd\">Loading</div>" +
						"<div id=\"expand_tupd\">Loading</div>" +
						"<div id=\"expand_ping\">Loading</div>" +
						"<div id=\"expand_custom\">Loading</div>" +
					"</div></td></tr>"
				);
				TableRow = $("#servers tr#r" + i);
				ExpandRow = $("#servers #rt" + i);
				server_status[i] = true;
			}
			TableRow = TableRow[0];
			if(error) {
				TableRow.setAttribute("data-target", "#rt" + i);
				server_status[i] = true;
			}

			// Online4
			if (result.servers[i].online4 && !result.servers[i].online6) {
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>IPv4</small>";
			} else if (result.servers[i].online4 && result.servers[i].online6) {
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>Dual</small>";
			} else if (!result.servers[i].online4 && result.servers[i].online6) {
			    TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>IPv6</small>";
			} else {
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-danger";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>close</small>";
			}

			// Online6
			//if (result.servers[i].online6) {
			//	TableRow.children["online6"].children[0].children[0].className = "progress-bar progress-bar-success";
			//	TableRow.children["online6"].children[0].children[0].innerHTML = "<small>开启</small>";
			//} else {
			//	TableRow.children["online6"].children[0].children[0].className = "progress-bar progress-bar-danger";
			//	TableRow.children["online6"].children[0].children[0].innerHTML = "<small>close</small>";
			//}

			// Ipstatus
			// mh361 or mh370, mourn mh370, 2014-03-08 01:20　lost from all over the world.
			if (result.servers[i].ip_status) {
				TableRow.children["ip_status"].children[0].children[0].className = "progress-bar progress-bar-success";
			} else {
				TableRow.children["ip_status"].children[0].children[0].className = "progress-bar progress-bar-danger";
			}
			TableRow.children["ip_status"].children[0].children[0].innerHTML=""+(result.servers[i].tcp_count || "-");

			// Name
			TableRow.children["name"].innerHTML = result.servers[i].name;

			// Type
			TableRow.children["type"].innerHTML = result.servers[i].type;

			// Location
			TableRow.children["location"].innerHTML = result.servers[i].location;
			if (!result.servers[i].online4 && !result.servers[i].online6) {
				if (server_status[i]) {
					TableRow.children["uptime"].innerHTML = "–";
					TableRow.children["load"].innerHTML = "–";
					TableRow.children["network"].innerHTML = "–";
					TableRow.children["traffic"].innerHTML = "–";
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["cpu"].children[0].children[0].style.width = "100%";
					TableRow.children["cpu"].children[0].children[0].innerHTML = "<small>close</small>";
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["memory"].children[0].children[0].style.width = "100%";
					TableRow.children["memory"].children[0].children[0].innerHTML = "<small>close</small>";
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["hdd"].children[0].children[0].style.width = "100%";
					TableRow.children["hdd"].children[0].children[0].innerHTML = "<small>close</small>";
					TableRow.children["ping"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["ping"].children[0].children[0].style.width = "100%";
					TableRow.children["ping"].children[0].children[0].innerHTML = "<small>close</small>";
					if(ExpandRow.hasClass("in")) {
						ExpandRow.collapse("hide");
					}
					TableRow.setAttribute("data-target", "");
					server_status[i] = false;
				}
			} else {
				if (!server_status[i]) {
					TableRow.setAttribute("data-target", "#rt" + i);
					server_status[i] = true;
				}

				// Uptime
				TableRow.children["uptime"].innerHTML = result.servers[i].uptime;

				// Load: default load_1, you can change show: load_1, load_5, load_15
				if(result.servers[i].load == -1) {
				    TableRow.children["load"].innerHTML = "–";
				} else {
				    TableRow.children["load"].innerHTML = result.servers[i].load_1.toFixed(2);
				}

				// Network
				var netstr = "";
				total_in += result.servers[i].network_rx;
				total_out += result.servers[i].network_tx;
				if(result.servers[i].network_rx < 1024)
					netstr += result.servers[i].network_rx.toFixed(0) + "B";
				else if(result.servers[i].network_rx < 1024*1024)
					netstr += (result.servers[i].network_rx/1024).toFixed(0) + "K";
				else
					netstr += (result.servers[i].network_rx/1024/1024).toFixed(1) + "M";
				netstr += " | "
				if(result.servers[i].network_tx < 1024)
					netstr += result.servers[i].network_tx.toFixed(0) + "B";
				else if(result.servers[i].network_tx < 1024*1024)
					netstr += (result.servers[i].network_tx/1024).toFixed(0) + "K";
				else
					netstr += (result.servers[i].network_tx/1024/1024).toFixed(1) + "M";
				TableRow.children["network"].innerHTML = netstr;

				//Traffic
				var trafficstr = "";
				if(result.servers[i].network_in < 1024)
					trafficstr += result.servers[i].network_in.toFixed(0) + "B";
				else if(result.servers[i].network_in < 1024*1024)
					trafficstr += (result.servers[i].network_in/1024).toFixed(0) + "K";
				else if(result.servers[i].network_in < 1024*1024*1024)
					trafficstr += (result.servers[i].network_in/1024/1024).toFixed(1) + "M";
				else if(result.servers[i].network_in < 1024*1024*1024*1024)
					trafficstr += (result.servers[i].network_in/1024/1024/1024).toFixed(2) + "G";
                else
                    trafficstr += (result.servers[i].network_in/1024/1024/1024/1024).toFixed(2) + "T";
				trafficstr += " | "
				if(result.servers[i].network_out < 1024)
					trafficstr += result.servers[i].network_out.toFixed(0) + "B";
				else if(result.servers[i].network_out < 1024*1024)
					trafficstr += (result.servers[i].network_out/1024).toFixed(0) + "K";
				else if(result.servers[i].network_out < 1024*1024*1024)
					trafficstr += (result.servers[i].network_out/1024/1024).toFixed(1) + "M";
				else if(result.servers[i].network_out < 1024*1024*1024*1024)
				    trafficstr += (result.servers[i].network_out/1024/1024/1024).toFixed(2) + "G";
				else
					trafficstr += (result.servers[i].network_out/1024/1024/1024/1024).toFixed(2) + "T";
				TableRow.children["traffic"].innerHTML = trafficstr;

				// CPU
				if (result.servers[i].cpu >= 90)
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (result.servers[i].cpu >= 80)
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["cpu"].children[0].children[0].style.width = result.servers[i].cpu + "%";
				TableRow.children["cpu"].children[0].children[0].innerHTML = result.servers[i].cpu + "%";

				// Memory
				var Mem = ((result.servers[i].memory_used/result.servers[i].memory_total)*100.0).toFixed(0);
				if (Mem >= 90)
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (Mem >= 80)
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["memory"].children[0].children[0].style.width = Mem + "%";
				TableRow.children["memory"].children[0].children[0].innerHTML = Mem + "%";
				ExpandRow[0].children["expand_mem"].innerHTML = "Ram: " + bytesToSize(result.servers[i].memory_used*1024, 2) + " / " + bytesToSize(result.servers[i].memory_total*1024, 2);
				// Swap
				ExpandRow[0].children["expand_swap"].innerHTML = "Swap: " + bytesToSize(result.servers[i].swap_used*1024, 2) + " / " + bytesToSize(result.servers[i].swap_total*1024, 2);

				// HDD
				var HDD = ((result.servers[i].hdd_used/result.servers[i].hdd_total)*100.0).toFixed(0);
				if (HDD >= 90)
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (HDD >= 80)
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["hdd"].children[0].children[0].style.width = HDD + "%";
				TableRow.children["hdd"].children[0].children[0].innerHTML = HDD + "%";
				ExpandRow[0].children["expand_hdd"].innerHTML = "Disk: " + bytesToSize(result.servers[i].hdd_used*1024*1024, 2) + " / " + bytesToSize(result.servers[i].hdd_total*1024*1024, 2);

                // delay time

				// tcp, udp, process, thread count
				ExpandRow[0].children["expand_tupd"].innerHTML = "TCP+UDP/Proc/Thread: " + result.servers[i].udp_count + " / " + result.servers[i].process_count+ " / " + result.servers[i].thread_count;
				ExpandRow[0].children["expand_ping"].innerHTML = "EDU/CU/CT/CM: " + result.servers[i].time_edu + "ms / " + result.servers[i].time_10010 + "ms / " + result.servers[i].time_189 + "ms / " + result.servers[i].time_10086 + "ms"

                // ping
                var PING_10010 = result.servers[i].ping_10010.toFixed(0);
                var PING_189 = result.servers[i].ping_189.toFixed(0);
                var PING_10086 = result.servers[i].ping_10086.toFixed(0);
                var PING_edu = result.servers[i].ping_edu.toFixed(0);
                if (PING_10010 >= 20 || PING_189 >= 20 || PING_10086 >= 20 || PING_edu >= 20)
                    TableRow.children["ping"].children[0].children[0].className = "progress-bar progress-bar-danger";
                else
                    TableRow.children["ping"].children[0].children[0].className = "progress-bar progress-bar-success";
	            TableRow.children["ping"].children[0].children[0].innerHTML = PING_edu + '% / ' + PING_10010 + "% / " + PING_189 + "% / " + PING_10086 + "%";

				// Custom
				if (result.servers[i].custom) {
					ExpandRow[0].children["expand_custom"].innerHTML = result.servers[i].custom
				} else {
					ExpandRow[0].children["expand_custom"].innerHTML = ""
				}
			}
		};

		d = new Date(result.updated*1000);
		$('#total_in')[0].innerHTML = Math.round(100*total_in/1024/1024)/100;
		$('#total_out')[0].innerHTML = Math.round(100*total_out/1024/1024)/100;
		error = 0;
	}).fail(function(update_error) {
		if (!error) {
			$("#servers > tr.accordion-toggle").each(function(i) {
				var TableRow = $("#servers tr#r" + i)[0];
				var ExpandRow = $("#servers #rt" + i);
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>error</small>";
				//TableRow.children["online6"].children[0].children[0].className = "progress-bar progress-bar-error";
				//TableRow.children["online6"].children[0].children[0].innerHTML = "<small>error</small>";
				TableRow.children["ip_status"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["ip_status"].children[0].children[0].innerHTML = "<small>error</small>";
				TableRow.children["uptime"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["uptime"].children[0].children[0].innerHTML = "<small>error</small>";
				TableRow.children["load"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["load"].children[0].children[0].innerHTML = "<small>error</small>";
				TableRow.children["network"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["network"].children[0].children[0].innerHTML = "<small>error</small>";
				TableRow.children["traffic"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["traffic"].children[0].children[0].innerHTML = "<small>error</small>";
				TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["cpu"].children[0].children[0].style.width = "100%";
				TableRow.children["cpu"].children[0].children[0].innerHTML = "<small>error</small>";
				TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["memory"].children[0].children[0].style.width = "100%";
				TableRow.children["memory"].children[0].children[0].innerHTML = "<small>error</small>";
				TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["hdd"].children[0].children[0].style.width = "100%";
				TableRow.children["hdd"].children[0].children[0].innerHTML = "<small>error</small>";
				TableRow.children["ping"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["ping"].children[0].children[0].style.width = "100%";
				TableRow.children["ping"].children[0].children[0].innerHTML = "<small>error</small>";
				if(ExpandRow.hasClass("in")) {
					ExpandRow.collapse("hide");
				}
				TableRow.setAttribute("data-target", "");
				server_status[i] = false;
			});
		}
		error = 1;
		$("#updated").html("Update error.");
	});
}

function updateTime() {
	if (!error)
		$("#updated").html("Last update: " + timeSince(d));
}

uptime();
updateTime();
setInterval(uptime, 2000);
setInterval(updateTime, 2000);


// styleswitcher.js
function setActiveStyleSheet(title) {
	var i, a, main;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
			if(a.getAttribute("title") == title) a.disabled = false;
		}
	}
}

function getActiveStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled)
			return a.getAttribute("title");
	}
	return null;
}

function getPreferredStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1	&& a.getAttribute("rel").indexOf("alt") == -1 && a.getAttribute("title"))
			return a.getAttribute("title");
	}
return null;
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ')
			c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length,c.length);
	}
	return null;
}

window.onload = function(e) {
	var cookie = readCookie("style");
	var title = cookie ? cookie : getPreferredStyleSheet();
	setActiveStyleSheet(title);
}

window.onunload = function(e) {
	var title = getActiveStyleSheet();
	createCookie("style", title, 365);
}

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
