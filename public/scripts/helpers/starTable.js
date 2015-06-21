starApp.factory('starTable', function(ngTableParams) {
	function create(data, ppty) {
		var ppties = ppty.split('.');
		return new ngTableParams({
			page: 1,
			count: 10
		}, {
			counts: [],
			getData: function($defer, params) {
				$defer.resolve(data[ppties[0]][ppties[1]].slice((params.page() - 1) * params.count(), params.page() * params.count()));
			},
			$scope: {
				$data: {}
			}
		});
	}

	return {
		create: create
	};
});