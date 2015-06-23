starApp.factory('agendaService', function($http) {
	function getByDate(userName, date) {
		return $http.get(`/agendas/getByDate/${userName}/${date}`);
	}

	return {
		getByDate: getByDate
	};
});