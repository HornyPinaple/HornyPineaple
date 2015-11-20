// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('uberfind', ['ionic','ion-google-place','ionic.service.core'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {



    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: 'app',
    abstract: true,
  })

  .state('search', {
    url: 'search',
    templateUrl: '/states/app/search.html',
  })

  .state('login', {
    url: '/',
    templateUrl: '/states/login/login.html',
  })

  .state('register', {
    url: 'register',
    templateUrl: '/states/login/register.html',
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
})
  .run(function($rootScope){
    $rootScope.initMap = initMap;
  });

var map;

function initMap() {
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
  var modes = document.getElementById('mode-selector');

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  var destination_autocomplete =
    new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, mode) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function() {
      travel_mode = mode;
    });
  }
  setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
  setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
  setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }

  origin_autocomplete.addListener('place_changed', function() {
    var place = origin_autocomplete.getPlace();
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
  });

  destination_autocomplete.addListener('place_changed', function() {
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    destination_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
      directionsService, directionsDisplay);
  });

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
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
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



//function initMap() {
//  var map = new google.maps.Map(document.getElementById('map'), {
//    center: {lat: -33.8688, lng: 151.2195},
//    zoom: 20
//  });
//  var input = /** @type {!HTMLInputElement} */(
//    document.getElementById('pac-input'));
//
//  var types = document.getElementById('type-selector');
//  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
//  map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);
//
//  var autocomplete = new google.maps.places.Autocomplete(input);
//  autocomplete.bindTo('bounds', map);
//
//  var infowindow = new google.maps.InfoWindow();
//  var marker = new google.maps.Marker({
//    map: map,
//    anchorPoint: new google.maps.Point(0, -29)
//  });
//
//  autocomplete.addListener('place_changed', function() {
//    infowindow.close();
//    marker.setVisible(false);
//    var place = autocomplete.getPlace();
//    if (!place.geometry) {
//      window.alert("Autocomplete's returned place contains no geometry");
//      return;
//    }
//
//    // If the place has a geometry, then present it on a map.
//    if (place.geometry.viewport) {
//      map.fitBounds(place.geometry.viewport);
//    } else {
//      map.setCenter(place.geometry.location);
//      map.setZoom(17);  // Why 17? Because it looks good.
//    }
//    marker.setIcon(/** @type {google.maps.Icon} */({
//      url: place.icon,
//      size: new google.maps.Size(71, 71),
//      origin: new google.maps.Point(0, 0),
//      anchor: new google.maps.Point(17, 34),
//      scaledSize: new google.maps.Size(35, 35)
//    }));
//    marker.setPosition(place.geometry.location);
//    marker.setVisible(true);
//
//    var address = '';
//    if (place.address_components) {
//      address = [
//        (place.address_components[0] && place.address_components[0].short_name || ''),
//        (place.address_components[1] && place.address_components[1].short_name || ''),
//        (place.address_components[2] && place.address_components[2].short_name || '')
//      ].join(' ');
//    }
//
//    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
//    infowindow.open(map, marker);
//  });
//
//  // Sets a listener on a radio button to change the filter type on Places
//  // Autocomplete.
//  function setupClickListener(id, types) {
//    var radioButton = document.getElementById(id);
//    radioButton.addEventListener('click', function() {
//      autocomplete.setTypes(types);
//    });
//  }
//
//  setupClickListener('changetype-all', []);
//  setupClickListener('changetype-address', ['address']);
//  setupClickListener('changetype-establishment', ['establishment']);
//  setupClickListener('changetype-geocode', ['geocode']);
//
//
//  var infoWindow = new google.maps.InfoWindow({map: map});
//
//  // Try HTML5 geolocation.
//  if (navigator.geolocation) {
//    navigator.geolocation.getCurrentPosition(function(position) {
//      var pos = {
//        lat: position.coords.latitude,
//        lng: position.coords.longitude
//      };
//
//      infoWindow.setPosition(pos);
//      infoWindow.setContent('Location found.');
//      map.setCenter(pos);
//    }, function() {
//      handleLocationError(true, infoWindow, map.getCenter());
//    });
//  } else {
//    // Browser doesn't support Geolocation
//    handleLocationError(false, infoWindow, map.getCenter());
//  }
//}
//
//
//
//function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//  infoWindow.setPosition(pos);
//  infoWindow.setContent(browserHasGeolocation ?
//    'Error: The Geolocation service failed.' :
//    'Error: Your browser doesn\'t support geolocation.');
//}
//
//











//  .directive('googleplace', function() {
//  return {
//    require: 'ngModel',
//    link: function(scope, element, attrs, model) {
//      var options = {
//        types: [],
//        componentRestrictions: {}
//      };
//      scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
//      var dd='dd';
//
//      document.getElementsByClassName('pac-item').click(alert(dd));
//
//      //{
//      //  google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
//      //    scope.$apply(function() {
//      //      model.$setViewValue(element.val());
//      //    });
//      //  });
//      //
//      //
//      //});
//      google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
//        scope.$apply(function() {
//          model.$setViewValue(element.val());
//        });
//      });
//    }
//  };
//});
//
//function MyCtrl($scope) {
//  $scope.gPlace;
//}
//
//
//
