(function(){

	function SearchController($scope, $state, ubGoogleApi){

		var origin_input = document.getElementById('search-input');

		var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);

		function search(){
			$state.go('results', { query: origin_input.value})
		}

		$scope.search = search;


	}

	SearchController.$inject = ['$scope', '$state', 'ubGoogleApi'];


	angular.module('uberfind').controller('SearchController', SearchController)

})();