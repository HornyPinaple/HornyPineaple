(function(){

	function ApiProxy($q, $http, API_KEY){

		function autoComplePlace(val){
			var dfd = $q.defer();

			if(!val){
				dfd.resolve();
				return dfd.promise;
			}

			$http({
				url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?callback=JSON_CALLBACK',
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

		return {
			autoComplePlace: autoComplePlace
		}

	}

	ApiProxy.$inject = ['$q', '$http', 'API_KEY'];

	angular.module('uberfind').factory('ubGoogleApi', ApiProxy);

})();