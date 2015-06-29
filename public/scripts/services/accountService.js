starApp.factory('accountService', function($http, $cookieStore, genericService, ACCESS_LEVELS) {
	var _user = $cookieStore.get('user');

	return {
		authenticate: function(userName, password) {
			return genericService.find('users', {
				UserName: userName,
				Password: password
			});
		},
		isAuthorized: function(lvl) {
			return _user !== null && _user.Role === lvl;
		},
		setUser: function(user) {
			user.Role = ACCESS_LEVELS.pub;
			_user = user;
			$cookieStore.put('user', _user);
		},
		isLoggedIn: function() {
			return _user ? true : false;
		},
		getUser: function() {
			return _user;
		},
		getUserName: function() {
			return _user.UserName;
		},
		getUserFullName: function() {
			return _user ? _user.FullName : '';
		},
		getId: function() {
			return _user ? _user._id : null;
		},
		logout: function() {
			$cookieStore.remove('user');
			_user = null;
		}
	};
});