starApp.factory('accountService', function($http) {
	var _user = localStorage.getItem('user');

	return {
		authenticate: function(userName, password) {
			return $http.post('/user/login', {
				username: userName,
				password: password
			});
		},
		isAuthorized: function(lvl) {
			return _user !== null && _user.Role === lvl;
		},
		setData: function(data) {
			_user = data.user;
			localStorage.setItem('user', _user);
			localStorage.setItem('token', data.token);
		},
		isLoggedIn: function() {
			return _user ? true : false;
		},
		getUser: function() {
			return _user;
		},
		getUserName: function() {
			return _user ? _user.UserName : '';
		},
		getUserFullName: function() {
			return _user ? _user.FullName : '';
		},
		getId: function() {
			return _user ? _user._id : null;
		},
		logout: function() {
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			_user = null;
		},
		isLogged: false
	};
});