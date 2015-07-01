starApp.factory('genericService', function($http, userActionService, _) {
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
				return userActionService.insert(collectionName, data.Title, data.CreatedBy);
			}).then(function() {
				resolve(id);
			});
		});
		return promise;
	}

	function getByDate(collectionName, userName, date) {
		return $http.get(`/${collectionName}/getByDate/${userName}/${date}`);
	}

	function find(collectionName, filter) {
		return $http({
			method: 'POST',
			url: `/${collectionName}/find`,
			data: filter
		});
	}

	function getList(collectionName, author) {
		var promise = new Promise(function(resolve) {
			return find(collectionName, {
				CreatedBy: author,
				sort: {
					Date: -1
				},
				projection: {
					Title: 1,
					Date: 1
				}
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

	function search(collectionName, author, text) {
		var promise = new Promise(function(resolve) {
			return $http({
				url: `${collectionName}/search/${text}`,
				method: 'POST',
				data: {
					'filters': ['Title', 'Text'],
					'projection': {
						Date: 1,
						Title: 1,
						Text: 1
					}
				}
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

	function findOne(collectionName, id) {
		var promise = new Promise(function(resolve) {
			var result = {};
			var dateTime;
			$http.get(`/${collectionName}/findOne/${id}`).then(function(dataAgenda) {
				result.agenda = dataAgenda.data;
				dateTime = new Date(result.agenda.Date).getTime();
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
							Type: key
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
				return userActionService.remove(collectionName, data.title, data.author);
			}).then(function() {
				resolve(data.id);
			});
		});
		return promise;
	}

	return {
		getByDate: getByDate,
		insert: insert,
		insertWithUserActions: insertWithUserActions,
		find: find,
		search: search,
		findOne: findOne,
		getList: getList,
		remove: remove,
		removeWithUserActions: removeWithUserActions
	};
});