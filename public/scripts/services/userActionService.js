starApp.factory('userActionService', function($http) {
	function send(collectionName, title, author, operation) {
		var data = {
			operation: operation,
			date: new Date().getTime(),
			title: title,
			createdBy: author,
			collection: collectionName
		};
		return $http.post('/userActions/insert', data);
	}

	function insert(collectionName, title, author) {
		return send(collectionName, title, author, 'Add');
	}

	function remove(collectionName, title, author) {
		return send(collectionName, title, author, 'Delete');
	}

	return {
		insert: insert,
		remove: remove
	};
});