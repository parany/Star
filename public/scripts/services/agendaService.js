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

	function find(filter) {
		var promise = new Promise(function(resolve) {
			genericService.find('agendas', filter).success(function(data) {
				data.forEach(function(d) {
					d.CreatedBy = filter.CreatedBy;
					d.Date = new Date(d.Date);
					d.DateGroup = d.Date.toCompareString();
				});
				resolve(data);
			});
		});
		return promise;
	}

	function search(text) {
		return genericService.search('agendas', text);
	}

	return {
		getByDate: getByDate,
		insert: insert,
		find: find,
		search: search
	};
});