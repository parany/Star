starApp.factory('tweetService', function($http, userActionService, genericService) {
	function getList(collectionName) {
		var projection = {
			Title: 1,
			Date: 1,
			Type: 1
		};
		var promise = new Promise(function(resolve) {
			return genericService.find(collectionName, {
				sort: {
					Date: -1
				},
				projection
			}).then(function(list) {
				list.data.forEach(function(d) {
					d.Date = new Date(d.Date);
					d.DateGroup = d.Date.toCompareString();
				});
				resolve(list.data);
			});
		});
		return promise;
	}

	return {
		getList: getList
	};
});