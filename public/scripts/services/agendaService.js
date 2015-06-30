starApp.factory('agendaService', function($http, genericService) {
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

	function findOne(id) {
		return genericService.findOne('agendas', id);
	}

	return {
		find: find,
		search: search,
		findOne: findOne
	};
});