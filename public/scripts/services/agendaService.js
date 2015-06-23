starApp.factory('agendaService', function($http, genericService, userActionService) {
	function getByDate(userName, date) {
		return genericService.getByDate('agendas', userName, date);
	}

	function insert(data) {
		var promise = new Promise(function(resolve) {
			var id;
			genericService.insert('agendas', data).then(function(ret) {
				id = ret.data[0]._id;
				userActionService.insert(data.Title, data.CreatedBy);
			}).then(function() {
				return resolve(id);
			});
		});
		return promise;
	}

	return {
		getByDate: getByDate,
		insert: insert
	};
});