(function(){

	function SearchController($scope, $state){

		$scope.sr = {};

		function search(){
			$state.go('results', { query: $scope.sr.search})
		}

		$scope.search = search;

	}

	SearchController.$inject = ['$scope', '$state'];


	angular.module('uberfind').controller('SearchController', SearchController)

})();