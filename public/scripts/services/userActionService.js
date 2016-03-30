starApp.factory('userActionService', function($http) {
	function send(collectionName, title, author, operation) {
		var data = {
			operation: operation,
			date: new Date().getTime(),
			title: title,
			collection: collectionName
		};
		return $http.post('/userActions/insert', data);
	}

	function insert(collectionName, title) {
		return send(collectionName, title, 'Add');
	}

	function remove(collectionName, title, author) {
		return send(collectionName, title, author, 'Delete');
	}

	function update(collectionName, title, author) {
		return send(collectionName, title, author, 'Edit');
	}

	return {
		insert: insert,
		remove: remove,
		update: update
	};
});