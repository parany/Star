starApp.factory('genericService', function($http, _) {
	function getByDate(collectionName, userName, date) {
		return $http.get(`/${collectionName}/getByDate/${userName}/${date}`);
	}

	function insert(collectionName, data) {
		return $http({
			method: 'POST',
			data: data,
			url: `/${collectionName}/insert`
		});
	}

	function find(collectionName, filter) {
		return $http({
			method: 'POST',
			url: `/${collectionName}/find`,
			data: filter
		});
	}

	function search(collectionName, text) {
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
		});
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

	return {
		getByDate: getByDate,
		insert: insert,
		find: find,
		search: search,
		findOne: findOne
	};
});