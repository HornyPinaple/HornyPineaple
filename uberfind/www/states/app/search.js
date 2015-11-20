(function(){

	function SearchController($scope, $state, ubGoogleApi){

		$scope.sr = {};

		function search(){
			$state.go('results', { query: $scope.sr.search})
		}

		var autoComplePromises = {}

		function autocomplePlace(input){
			if(!(input in autoComplePromises)){
				autoComplePromises[input] = ubGoogleApi.autoComplePlace(input);
			} 
			return autoComplePromises[input];
		}

		$scope.search = search;
		$scope.autocomplePlace = autocomplePlace;

	}

	SearchController.$inject = ['$scope', '$state', 'ubGoogleApi'];


	angular.module('uberfind').controller('SearchController', SearchController)

})();