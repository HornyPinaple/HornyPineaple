(function(){

	var map;

function initMap(initOptions, createReloadFn) {
	var origin_place_id = null;
	var destination_place_id = null;
	var travel_mode = google.maps.TravelMode.WALKING;

	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControl: false,
		center: {lat: -33.8688, lng: 151.2195},
		zoom: 13
	});
	directionsDisplay.setMap(map);

	var origin_input = document.getElementById('origin-input');
	var destination_input = document.getElementById('destination-input');

	var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
	origin_autocomplete.bindTo('bounds', map);
	var destination_autocomplete =
		new google.maps.places.Autocomplete(destination_input);
	destination_autocomplete.bindTo('bounds', map);

	// Sets a listener on a radio button to change the filter type on Places
	// Autocomplete.

	function expandViewportToFitPlace(map, place) {
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
	}

	function place_changed(autocomplete){
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
		}
		expandViewportToFitPlace(map, place);

		// If the place has a geometry, store its place ID and route if we have
		// the other place ID
		origin_place_id = place.place_id;
		route(origin_place_id, destination_place_id, travel_mode,
			directionsService, directionsDisplay);
	}

	destination_autocomplete.addListener('place_changed', function(){
		place_changed(destination_autocomplete);
	});

	destination_autocomplete.addListener('place_changed', function(){
		place_changed(origin_autocomplete);
	});

	function reloadPlaces(){
		place_changed(origin_autocomplete);
		place_changed(destination_autocomplete);
	}

	if(createReloadFn){
		createReloadFn(reloadPlaces)
	}

	function route(origin_place_id, destination_place_id, travel_mode,
								 directionsService, directionsDisplay) {
		if (!origin_place_id || !destination_place_id) {
			return;
		}
		directionsService.route({
			origin: {'placeId': origin_place_id},
			destination: {'placeId': destination_place_id},
			travelMode: travel_mode
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}
	var infoWindow = new google.maps.InfoWindow({map: map});

// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('You are here');
			map.setCenter(pos);
			initOptions.setSourceFn(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function routeCommonDirection()
{
		var waypoints={};

	waypoints.origin="Tel Aviv-Yafo, ישראל";
	waypoints.destination="בת ים, ישראל";
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();

	directionsDisplay = new google.maps.DirectionsRenderer();
		//var chicago = new google.maps.LatLng(41.850033, -87.6500523);
		//var mapOptions = {
		//  zoom:7,
		//  center: chicago
		//};
		//map = new google.maps.Map(document.getElementById("map"), mapOptions);
		directionsDisplay.setMap(map);

	var origin_input = document.getElementById('origin-input');
	var destination_input = document.getElementById('destination-input');
	 var  request= {
		origin: origin_input.value,
		destination: destination_input.value,
		waypoints: [
			{
				//location:"Joplin, MO",
				location:waypoints.origin,
				stopover:true
			},{
				location:waypoints.destination,
				stopover:true
			}],
		provideRouteAlternatives: false,
		travelMode: google.maps.TravelMode.DRIVING

	};
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			}
		});

	directionsService.route()
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
}

	function ResultsController($scope, $state, ubGoogleApi){

		$scope.rs = {};

		$scope.rs.query = $state.params.query;

		$scope.initMap = initMap;

		$scope.initOptions = {
			setSourceFn: function(soruce){
				ubGoogleApi.getLocaiton(soruce.lat, soruce.lng)
					.then(function(res){
						$scope.rs.source = res[0].formatted_address;
					})
			},
			createReloadFn: function(fn){
				$scope.$watch('rs.source', fn);
				$scope.$watch('rs.query', fn);
			}
		}

		

	}

	ResultsController.$inject = ['$scope', '$state', 'ubGoogleApi'];


	angular.module('uberfind').controller('ResultsController', ResultsController)

})();