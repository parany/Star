angular.module('starApp.services').factory('activityService', ['$http', function($http) {
	function getSummary() {
		var promise = new Promise(function(resolve) {
			$http.get('/summary').success(function(data) {
				var obj = {};
				obj.labels = _.pluck(data, 'article');
				obj.data = _.pluck(data, 'total');
				resolve(obj);
			});
		});
		return promise;
	}

	function getAllActivities() {
		var promise = new Promise(function(resolve) {
			$http.get(`/activities`).success(function(data) {
				var obj = {};
				obj.labels = _.pluck(data, 'operation');
				obj.data = _.pluck(data, 'total');
				resolve(obj);
			});
		});
		return promise;
	}

	function getActivities(article) {
		var promise = new Promise(function(resolve) {
			$http.get(`/activities/${article}/250`).success(function(data) {
				data.operations.forEach(function(value) {
					value.date = new Date(value.date);
					if (value.title && value.title.length > 40) {
						value.title = value.title.slice(0, 40) + '...';
					}
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
}]);