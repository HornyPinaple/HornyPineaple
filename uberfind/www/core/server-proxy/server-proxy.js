(function(){

	var server_url = 'http://horny-pineapple.cloudapp.net/'

	function ServerPorxy($q, $http){

		function registerUser(name, phone){
			return $q.when($http.post(server_url + 'user', { name: name, phone: phone }))
		}

		return {
			registerUser: registerUser
		}

	}

	ServerPorxy.$inject = ['$q', '$http'];

	angular.module('uberfind').factory('ubServerProxy', ServerPorxy);

})();