(function(){

	function ApiProxy($q, $http, API_KEY){

		function autoComplePlace(val){
			var dfd = $q.defer();

			if(!val){
				dfd.resolve();
				return dfd.promise;
			}

			$http({
				url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
				method: "GET",
				params: {
					input: val,
					types: 'geocode',
					key: API_KEY
				},
				transformResponse: []
			}).then(function(result){
				dfd.resolve(JSON.parse(result.data).predictions);
			}, function(err){
				dfd.reject(err);
			})

			return dfd.promise;
		}

		function getLocaiton(lat, lng){
			var dfd = $q.defer();

			if(!lat || !lng){
				dfd.resolve();
				return dfd.promise;
			}

			$http({
				url: 'http://maps.googleapis.com/maps/api/geocode/json',
				method: "GET",
				params: {
					latlng: lat + ',' + lng,
					sensor: 'true'
				},
				transformResponse: []
			}).then(function(result){
				dfd.resolve(JSON.parse(result.data).results);
			}, function(err){
				dfd.reject(err);
			})

			return dfd.promise;
		}

		return {
			autoComplePlace: autoComplePlace,
			getLocaiton: getLocaiton
		}

	}

	ApiProxy.$inject = ['$q', '$http', 'API_KEY'];

	angular.module('uberfind').factory('ubGoogleApi', ApiProxy);

})();