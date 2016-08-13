angular.module('starApp.services').factory('genericService', ['$http', 'userActionService', function($http, userActionService) {
	var filters = {
		'agendas': 'agenda',
		'explications': 'explication',
		'treaties': 'treaty',
		'news': 'new'
	};

	function insert(collectionName, data) {
		return $http({
			method: 'POST',
			data: data,
			url: `/${collectionName}/insert`
		});
	}

	function insertWithUserActions(collectionName, data) {
		var promise = new Promise(function(resolve) {
			var id;
			insert(collectionName, data).then(function(ret) {
				id = ret.data[0]._id;
				return userActionService.insert(collectionName, data.Title);
			}).then(function() {
				resolve(id);
			});
		});
		return promise;
	}

	function getByDate(collectionName, date) {
		return $http.get(`/${collectionName}/getByDate/${date}`);
	}

	function find(collectionName, filter) {
		return $http({
			method: 'POST',
			url: `/${collectionName}/find`,
			data: filter
		});
	}

	function getList(collectionName) {
		var promise = new Promise(function(resolve) {
			return find(collectionName, {
				sort: {
					Date: -1
				},
				projection: {
					Title: 1,
					Date: 1,
					Text: 1,
					Content: 1
				}
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
				result.tweets = data.data.tweets.filter(function(tweet) {
					return tweet.Type === filters[collectionName];
				});
				delete data.data.tweets;
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

	function remove(collectionName, id) {
		return $http.get(`/${collectionName}/delete/${id}`);
	}

	function removeWithUserActions(collectionName, data) {
		var promise = new Promise(function(resolve) {
			remove(collectionName, data.id).then(function() {
				return userActionService.remove(collectionName, data.title);
			}).then(function() {
				resolve(data.id);
			});
		});
		return promise;
	}

	function findOne(collectionName, id) {
		return $http.get(`/${collectionName}/findOne/${id}`);
	}

	function update(collectionName, data) {
		return $http({
			method: 'POST',
			data: data,
			url: `/${collectionName}/update`
		});
	}

	function updateWithUserActions(collectionName, data) {
		var promise = new Promise(function(resolve) {
			update(collectionName, data).then(function() {
				return userActionService.update(collectionName, data.Title);
			}).then(function() {
				resolve(data._id);
			});
		});
		return promise;
	}

	function findAll(collectionName) {
		return $http.get(`/${collectionName}/findAll`);
	}

	return {
		getByDate: getByDate,
		insert: insert,
		insertWithUserActions: insertWithUserActions,
		find: find,
		getDetail: getDetail,
		getList: getList,
		remove: remove,
		removeWithUserActions: removeWithUserActions,
		findOne: findOne,
		update: update,
		updateWithUserActions: updateWithUserActions,
		findAll: findAll
	};
}]);