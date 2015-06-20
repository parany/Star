starApp.factory('accountService', function($http) {
	function authenticate(userName, password) {
		return $http({
			method: 'POST',
			url: '/users/find',
			data: {
				UserName: userName,
				Password: password
			}
		});
	}

	return {
		authenticate: authenticate
	};
});