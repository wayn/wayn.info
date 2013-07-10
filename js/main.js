$(document).ready(function() {
    $('pre').addClass('prettyprint linenums');
    prettyPrint();
    hideHello();
    addTitleList();
});
function hideHello() {
	$('article:first').delay(10000).animate({height:0, margin:0},"slow",function(){$(this).hide();});
}
function addTitleList() {
	$.getJSON('api/titleList', function(data) {
		var items = [];

		$.each(data, function(key, val) {
			items.push('<li><a href="edit?id=' + val._id + '">' + val.title + '</a></li>');
		});

		$('<ul/>', {html: items.join('')}).appendTo('.side .content');
	});
}