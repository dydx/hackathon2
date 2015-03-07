if(navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(render_form);
}

function render_form(p) {
	var lat = p.coords.latitude;
	var lon = p.coords.longitude;
	document.getElementById('lat').value = lat;
	document.getElementById('lon').value = lon;
}