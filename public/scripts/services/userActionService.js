starApp.factory('userActionService', function($http, genericService) {
	function insert(title, createdBy) {
		var data = {
			operation: 'Add',
			date: new Date().getTime(),
			title: title,
			createdBy: createdBy
		};
		return genericService.insert('userActions', data);
	}

	return {
		insert: insert
	};
});