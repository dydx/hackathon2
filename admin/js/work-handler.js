$(document).ready(function() {
	$.getJSON('http://192.168.3.193:8000/api/all', function(data) {
		data.forEach(function(data) {
			console.log(data);
			$("#work-list").append(
				"<li><a href='/admin/work-order.html#"+data._id+"'>"+data.properties.name+"</a></li>"
			);
		})
	})
});