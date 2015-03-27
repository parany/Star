starApp.controller('verseController', function ($scope, $rootScope, $http, $cookieStore, ngTableParams) {
    $http.get('/versions/getAll').success(function (data) {
        $scope.read.versions = data;
        $scope.read.version = $scope.read.versions[0];
    });
    
    $http.get('/testaments/getAll').success(function (data) {
        $scope.read.testaments = data;
        $scope.read.testament = $scope.read.testaments[0];
    });
    
    $scope.$watch("read.testament", function () {
        if (!$scope.read.testament) return;
        $http.post('/books/findv2', {
            TestamentId: $scope.read.testament._id, 
            sort: { DisplayOrder: 1 }
        }).success(function (data) {
            $scope.read.books = data;
            $scope.read.book = $scope.read.books[0];
            $scope.read.maxDisplayOrder = $scope.read.books[$scope.read.books.length - 1].DisplayOrder;
        });
    });
    
    $scope.$watch("read.book", function () {
        if (!$scope.read.book) return;
        $http.post('/verses/findv2', {
            BookId: $scope.read.book._id, 
            sort: { Chapter: -1 }, 
            limit: 1
        }).success(function (data) {
            var chapters = _.range(1, data[0].Chapter + 1);
            $scope.read.chapters = chapters;
            $scope.read.chapter = $scope.read.chapters[0];
            $scope.read.maxChapter = $scope.read.chapters[$scope.read.chapters.length - 1];
        });
    });
    
    $scope.$watch("read.chapter + read.book.Id", function () {
        if (!$scope.read.chapter) return;
        $http.post('/verses/findv2', {
            BookId: $scope.read.book._id,
            Chapter: parseInt($scope.read.chapter), 
            sort: { Paragraph: -1 }, 
            limit: 1
        }).success(function (data) {
            var paragraphs = _.range(1, data[0].Paragraph + 1);
            $scope.read.paragraphs = paragraphs;
            $scope.read.paragraphMin = $scope.read.paragraphs[0];
            $scope.read.paragraphMax = $scope.read.paragraphs[$scope.read.paragraphs.length - 1];
        });
    });
    
    $scope.read.addVerse = function () {
        var verseRead = {
            Book: $scope.read.book.Description,
            Chapter: $scope.read.chapter,
            ParagraphMin: $scope.read.paragraphMin,
            ParagraphMax: $scope.read.paragraphMax
        }
        $scope.read.verses.push(verseRead);
        $scope.tableVerses.reload();
    }
    
    $scope.read.removeVerseRead = function (model) {
        $scope.read.verses = $scope.read.verses.filter(function (v) {
            return model.Book != v.Book 
                || model.Chapter != v.Chapter 
                || model.ParagraphMin != v.ParagraphMin 
                || model.ParagraphMax != v.ParagraphMax;
        });
        $scope.tableVerses.reload();
    }
});