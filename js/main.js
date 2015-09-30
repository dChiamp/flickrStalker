// _____________________________________________________________________________
// Setting up API requests

var flickrEndpoint = "https://api.flickr.com/services/rest/";
var flickrParameters = {
	"method": "flickr.photos.search",
	"api_key": "0e9a3b35d1051515bd41a61b8250c175",
	"format": "json",
	"has_geo": "1", // Make sure the photo has geo information
	"per_page": "30", // Get a bunch of results
	"page": "1",
	"nojsoncallback": "1",
	"media": "1",
	"extras": "geo,owner_name",
	"privacy_filter": "1",
	"sort": "date-taken-desc", // relevance, interestingness-desc, date-taken-desc
	// "tags": "baby", // instagramapp, iphoneography, wedding, party, baby
	//"text": "" // chicago, homeless, sleeping, pet, food 
	// Other parameters that could be useful here:
	// 	sort: relevance, interestingness-desc, date-taken-desc
	// 	tags: instagramapp, iphoneography, wedding, party, baby
	// 	text: chicago, sleeping, pet, food, homeless, etc.
	
	// Selfie, iphoneography, etc.
};


var streetViewEndpoint = "https://maps.googleapis.com/maps/api/streetview";
var streetViewParameters = {
	"key": "AIzaSyDCoPI8rQxOf1ucXndSHScDyCg2wHS0ncM",
	"size": "640x640",
	"location": "55.626713,-3.526999"
};

// _____________________________________________________________________________
// Getting elements from the DOM

var form = document.getElementById("search-form");
var resultsDiv = document.getElementById("results");
var trackedImageTemplate = document.querySelector(".tracked-image");

resultsDiv.removeChild(trackedImageTemplate);


// _____________________________________________________________________________
// Setting up the events so that the APIs are called when a query is entered 
// into the form

form.onsubmit = function (event) {
	event.preventDefault();

	var textSearch = form.elements["search-text"].value;

	flickrParameters.tags = textSearch;
	var flickrCall = buildApiRequest(flickrEndpoint, flickrParameters);
	console.log(flickrCall)
	callApi(flickrCall, processFlickr);
}

// Make the weather report clear when the text inside the form is changed
form.elements["search-text"].oninput = clearSearchResults;
// Make the search bar get focus as soon as the page loads (e.g. as if the user
// had clicked within the text input)
form.elements["search-text"].focus();


function clearSearchResults() {
	resultsDiv.innerHTML = "";
}

function processFlickr() {
	if (this.readyState === 4 && this.status === 200) {
		var jsonResponse = JSON.parse(this.responseText);
		var searchResults = jsonResponse["photos"]["photo"];


		for (var i = 0; i < searchResults.length; i += 1) {

			// Get the image url
			var id = searchResults[i]["id"];
			var secret = searchResults[i]["secret"]; 
			var server = searchResults[i]["server"]; 
			var farm = searchResults[i]["farm"];  
			var photoURL = "https://farm" + farm + ".staticflickr.com/";
			photoURL += server + "/" + id + "_" + secret + "_z.jpg";

			// Get the geo position for the image
			var lat = searchResults[i]["latitude"]; 
			var lon = searchResults[i]["longitude"];
			streetViewParameters.location = lat + "," + lon;
			var streetViewURL = buildApiRequest(streetViewEndpoint, streetViewParameters);

			// Pull photo info
			var user = searchResults[i].ownername;
			var title = searchResults[i].title; 

			// Clone the template and customize it
			var clone = trackedImageTemplate.cloneNode(true);
			clone.querySelector(".flickr-image").setAttribute("src", photoURL);
			clone.querySelector(".streetview-image").setAttribute("src", streetViewURL);	
			clone.querySelector(".flickr-username").textContent = user;
			clone.querySelector(".flickr-title").textContent = title;

			// Set up animation so each result appears one after the other
			clone.className += " animated fadeIn";
			clone.style.animationDelay = i/4 + "s";
			// Make the street view image load after the flickr info
			var streetviewImage = clone.querySelector(".streetview-image");					
			streetviewImage.className += " animated fadeIn";			
			streetviewImage.style.animationDelay = i/4 + 0.4 + "s";

			// Done with the clone - throw it on the page
			resultsDiv.appendChild(clone);

		}

	}	
}

