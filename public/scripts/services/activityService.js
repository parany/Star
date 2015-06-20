starApp.factory('activityService', function($http, _) {
	function getSummary(userName) {
		var promise = new Promise(function(resolve) {
			$http.get('/summary/' + userName).success(function(data) {
				var obj = {};
				obj.labels = _.pluck(data, 'article');
				obj.data = _.pluck(data, 'total');
				resolve(obj);
			});
		});
		return promise;
	}

	function getAllActivities(userName) {
		var promise = new Promise(function(resolve) {
			$http.get(`/activities/${userName}`).success(function(data) {
				var obj = {};
				obj.labels = _.pluck(data, 'operation');
				obj.data = _.pluck(data, 'total');
				resolve(obj);
			});
		});
		return promise;
	}

	function getActivities(article, userName) {
		var promise = new Promise(function(resolve) {
			$http.get(`/activities/${article}/${userName}/250`).success(function(data) {
				data.operations.forEach(function(value) {
					value.date = new Date(value.date);
				});
				resolve(data);
			});
		});
		return promise;
	}

	return {
		getSummary: getSummary,
		getAllActivities: getAllActivities,
		getActivities: getActivities
	};
});