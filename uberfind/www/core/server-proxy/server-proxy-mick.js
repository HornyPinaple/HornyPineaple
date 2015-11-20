(function(){

	function ServerPorxy($q, $http){

		function registerUser(name, phone){
			var dfd = $q.defer();

			dfd.resolve({ data: "iajsdio189i01u09" });

			return dfd.promise;
		}

		return {
			registerUser: registerUser
		}

	}

	ServerPorxy.$inject = ['$q', '$http'];

	angular.module('uberfind').factory('ubServerProxyMock', ServerPorxy);

})();