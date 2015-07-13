starApp.factory('verseService', function($http) {
	function getBooks(testamentId) {
		return $http.post('/books/find', {
			TestamentId: testamentId,
			sort: {
				DisplayOrder: 1
			}
		});
	}

	function getChapters(bookId) {
		var promise = new Promise(function(resolve) {
			$http.post('/verses/find', {
				BookId: bookId,
				sort: {
					Chapter: -1
				},
				limit: 1
			}).success(function(data) {
				var chapters = _.range(1, data[0].Chapter + 1);
				resolve(chapters);
			});
		});
		return promise;
	}

	function getParagraphs(bookId, chapter) {
		var promise = new Promise(function(resolve) {
			$http.post('/verses/find', {
				BookId: bookId,
				Chapter: chapter,
				sort: {
					Paragraph: -1
				},
				limit: 1
			}).success(function(data) {
				var paragraphs = _.range(1, data[0].Paragraph + 1);
				resolve(paragraphs);
			});
		});
		return promise;
	}

	return {
		getBooks: getBooks,
		getChapters: getChapters,
		getParagraphs: getParagraphs
	};
});