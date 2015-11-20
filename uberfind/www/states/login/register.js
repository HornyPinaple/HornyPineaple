(function(){	

	function RegisterController($scope, $state, ubServerProxy){
		if('userId' in localStorage){
			$state.go('search');
		}

		$scope.lo = {};

		$scope.register = function(){
			ubServerProxy.registerUser($scope.lo.name, $scope.lo.phone)
				.then(function(request){
					localStorage.setItem('userId', request.data);
					localStorage.setItem('name', $scope.lo.name);
					localStorage.setItem('phone', $scope.lo.phone);
					$state.go('search');
				}, function(err){
					$scope.err = err;
				})
		}
	}

	RegisterController.$inject = ['$scope', '$state', 'ubServerProxyMock'];

	angular.module('uberfind').controller('RegisterController', RegisterController);
})();