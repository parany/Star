starApp.factory('starTable', function($filter, ngTableParams) {
	function create(data, ppty, orderBy, count) {
		var ppties = ppty.split('.');
		var params = {
			page: 1,
			count: count ? count : 10
		};
		var options = {
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
		};
		if (orderBy) {
			params.sorting = {
				'Date': 'desc'
			};
			options.groupBy = 'DateGroup';
			options.total = data.datas.length;
		}
		var table = new ngTableParams(params, options);
		if (orderBy) {
			table.settings.getData = function($defer, params) {
				var orderedData = params.sorting() ? $filter('orderBy')(data.datas, table.orderBy()) : data.datas.length;
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			};
		}
		return table;
	}

	return {
		create: create
	};
});