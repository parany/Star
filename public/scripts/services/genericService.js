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

	return {
		getByDate: getByDate,
		insert: insert,
		find: find,
		search: search
	};
});