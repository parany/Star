starApp.factory('tweetService', function($http, userActionService, genericService) {
	function getList(collectionName, author) {
		var projection = {
			Title: 1,
			Date: 1,
			Type: 1
		};
		var promise = new Promise(function(resolve) {
			return genericService.find(collectionName, {
				CreatedBy: author,
				sort: {
					Date: -1
				},
				projection
			}).then(function(list) {
				list.data.forEach(function(d) {
					d.CreatedBy = author;
					d.Date = new Date(d.Date);
					d.DateGroup = d.Date.toCompareString();
				});
				resolve(list.data);
			});
		});
		return promise;
	}

	function getDetail(collectionName, id) {
		var promise = new Promise(function(resolve) {
			var result = {};
			var dateTime;
			$http.get(`/${collectionName}/findOne/${id}`).then(function(data) {
				result.item = data.data;
				dateTime = new Date(result.item.Date).getTime();
				return $http.get(`/${collectionName}/getArticlesInTheSameDate/${dateTime}`);
			}).then(function(data) {
				result.sameDate = data.data[collectionName].filter(function(d) {
					return d._id !== id;
				});
				delete data.data[collectionName];
				var articles = [];
				_.forIn(data.data, function(value, key) {
					_.each(value, function(article) {
						articles.push({
							_id: article._id,
							Title: article.Title,
							Type: key,
							Date: new Date(article.Date)
						});
					});
				});
				result.articles = articles;
				return $http.get(`/${collectionName}/getPrevNearArticles/${dateTime}`);
			}).then(function(data) {
				result.prevs = data.data;
				result.prevs.forEach(function(d) {
					d.Date = new Date(d.Date);
				});
				return $http.get(`/${collectionName}/getNextNearArticles/${dateTime}`);
			}).then(function(data) {
				result.nexts = data.data;
				result.nexts.forEach(function(d) {
					d.Date = new Date(d.Date);
				});
				resolve(result);
			});
		});
		return promise;
	}

	return {
		getDetail: getDetail,
		getList: getList
	};
});