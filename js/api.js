function callApi(requestUrl, callback) {
	var myRequest = new XMLHttpRequest();
	myRequest.open("GET", requestUrl, true);
	myRequest.onreadystatechange = callback;
	myRequest.send();
	return myRequest;
}

function buildApiRequest(endpoint, parameters) {
	if (!parameters || parameters.length === 0) {
		return endpoint;
	}
	var url = endpoint + "?";
	for (var key in parameters) {
		var val = parameters[key];
		url += encodeURIComponent(key) + "=" + encodeURIComponent(val) + "&";
	}
	url = url.slice(0, -1); // Remove the extra "&" from the end of the url
	return url;
}