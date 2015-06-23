starApp.factory('starTable', function(ngTableParams) {
	function create(data, ppty) {
		var ppties = ppty.split('.');
		var params = {
			page: 1,
			count: 10
		};
		return new ngTableParams(params, {
			counts: [],
			getData: function($defer, params) {
				if (ppties.length === 2) {
					$defer.resolve(data[ppties[0]][ppties[1]].slice((params.page() - 1) * params.count(), params.page() * params.count()));
				} else {
					$defer.resolve(data[ppties[0]].slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
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