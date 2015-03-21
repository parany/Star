﻿starApp.controller('tableReadController', function ($scope, $rootScope, $http, $cookieStore, ngTableParams) {
    $scope.dataRead = [];

    var lastRead = $cookieStore.get('lastRead');
    var firstLoad = true;

    $http.get('/versions/getAll').success(function (data) {
        $scope.read.versions = data;
        $scope.read.version = $scope.read.versions[0];
        if (firstLoad && lastRead != undefined)
            $scope.read.version = $scope.read.versions[lastRead.VersionIndex];
    });

    $http.get('/testaments/getAll').success(function (data) {
        $scope.read.testaments = data;
        $scope.read.testament = $scope.read.testaments[0];
        if (firstLoad && lastRead != undefined)
            $scope.read.testament = $scope.read.testaments[lastRead.TestamentIndex];
    });

    $scope.$watch("read.testament", function () {
        if (!$scope.read.testament) return;
        $http.get('/books/getByTestament/' + $scope.read.testament._id).success(function (data) {
            $scope.read.books = data;
            $scope.read.book = $scope.read.books[0];
            $scope.read.chapter = 1;
            if (firstLoad && lastRead != undefined)
                $scope.read.book = $scope.read.books[lastRead.BookIndex];

            $scope.read.maxDisplayOrder = $scope.read.books[$scope.read.books.length - 1].DisplayOrder;
        });
    });

    $scope.$watch("read.book", function () {
        if (!$scope.read.book) return;
        $http.get('/verse/getChapters/' + $scope.read.book._id).success(function (data) {
            $scope.read.chapters = data;
            $scope.read.chapter = $scope.read.chapters[0];
            if (firstLoad && lastRead != undefined)
                $scope.read.chapter = lastRead.Chapter;

            $scope.read.maxChapter = $scope.read.chapters[$scope.read.chapters.length - 1];
        });
        angular.element('.glyphicon-fast-backward').css('opacity', $scope.read.book.DisplayOrder == 1 ? '0.4' : '1.0');
        angular.element('.glyphicon-fast-forward').css('opacity', $scope.read.book.DisplayOrder == $scope.read.maxDisplayOrder ? '0.4' : '1.0');
    });

    $scope.$watch("read.chapter + read.book._id", function () {
        if (!$scope.read.chapter) return;
        $http.get('/verse/getParagraphs/' + $scope.read.book._id + '/' + $scope.read.chapter).success(function (data) {
            $scope.read.paragraphs = data;
            $scope.read.paragraphMin = $scope.read.paragraphs[0];
            $scope.read.paragraphMax = $scope.read.paragraphs[$scope.read.paragraphs.length - 1];
            if (firstLoad && lastRead != undefined) {
                $scope.read.paragraphMin = lastRead.ParagraphMin;
                $scope.read.paragraphMax = lastRead.ParagraphMax;
            }
        });
        angular.element('.glyphicon-chevron-left').css('opacity', $scope.read.chapter == 1 ? '0.4' : '1.0');
        angular.element('.glyphicon-chevron-right').css('opacity', $scope.read.chapter == $scope.read.maxChapter ? '0.4' : '1.0');
    });

    $scope.$watch("read.paragraphMin + read.paragraphMax + read.version.Code", function () {
        $scope.search.textToSearch = '';
        if (!$scope.read.paragraphMin) return;
        $cookieStore.put('lastRead', {
            TestamentIndex: $scope.read.testaments.map(function (t) { return t._id; }).indexOf($scope.read.testament._id),
            BookIndex: $scope.read.book.DisplayOrder - 1,
            Chapter: $scope.read.chapter,
            ParagraphMin: $scope.read.paragraphMin,
            ParagraphMax: $scope.read.paragraphMax,
            VersionIndex: $scope.read.versions.map(function (v) { return v.Code; }).indexOf($scope.read.version.Code)
        });
        $http({
            method: 'POST',
            url: '/verse/getList',
            data: {
                BookId: $scope.read.book._id,
                Chapter: $scope.read.chapter,
                ParagraphMin: $scope.read.paragraphMin,
                ParagraphMax: $scope.read.paragraphMax,
                Version: $scope.read.version.Code
            }
        }).success(function (data) {
            $scope.dataRead = data;
            $scope.tableRead.reload();
            firstLoad = false;
        });
    });

    $scope.prevChapter = function () {
        if ($scope.read.chapter == 1) return;
        $scope.read.chapter--;
    }

    $scope.nextChapter = function () {
        if ($scope.read.chapter == $scope.read.maxChapter) return;
        $scope.read.chapter++;
    }

    $scope.prevBook = function () {
        if ($scope.read.book.DisplayOrder == 1) return;
        $scope.read.book = $scope.read.books[$scope.read.book.DisplayOrder - 2];
    }

    $scope.nextBook = function () {
        if ($scope.read.book.DisplayOrder == $scope.read.maxDisplayOrder) return;
        $scope.read.book = $scope.read.books[$scope.read.book.DisplayOrder];
    }

    $scope.changeVerseSelected = function (model) {
        angular.forEach($scope.dataRead, function (d) {
            d.$selected = false;
        });
        model.$selected = true;
        $scope.read.selected = model;
        $rootScope.$emit('read.changeSelect', $scope.read.selected._id);
    }

    $scope.tableRead = new ngTableParams({
        page: 1,
        total: 1,
        count: 250
    }, {
        counts: [], // hide page counts control
        getData: function ($defer, params) {
            $defer.resolve($scope.dataRead.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    $scope.tableRead.settings().$scope = $scope;
});