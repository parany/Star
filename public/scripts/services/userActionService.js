starApp.factory('userActionService', ['$http', function($http) {
	function send(collectionName, title, operation) {
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

	function remove(collectionName, title) {
		return send(collectionName, title, 'Delete');
	}

	function update(collectionName, title) {
		return send(collectionName, title, 'Edit');
	}

	return {
		insert: insert,
		remove: remove,
		update: update
	};
}]);