(function(){

	var server_url = 'http://horny-pineapple.cloudapp.net/'

	function ServerPorxy($q, $http){

		function registerUser(name, phone){
			return $q.when($http.post(server_url + 'user', { name: name, phone: phone }))
		}

		function getOptimalUsers(curLocation, destLocation){
			
		}

		return {
			registerUser: registerUser,
			getOptimalUsers: getOptimalUsers
		}

	}

	ServerPorxy.$inject = ['$q', '$http'];

	angular.module('uberfind').factory('ubServerProxy', ServerPorxy);

})();