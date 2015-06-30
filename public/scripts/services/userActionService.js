starApp.factory('userActionService', function($http) {
	function insert(collectionName, title, createdBy) {
		var data = {
			operation: 'Add',
			date: new Date().getTime(),
			title: title,
			createdBy: createdBy,
			collection: collectionName
		};
		return $http({
			method: 'POST',
			data: data,
			url: 'userActions/insert'
		});
	}

	return {
		insert: insert
	};
});