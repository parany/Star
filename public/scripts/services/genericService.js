starApp.factory('genericService', function($http) {
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

	return {
		getByDate: getByDate,
		insert: insert
	};
});