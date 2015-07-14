starApp.factory('noteService', function($http) {
	function getNote(noteId) {
		return $http.get('/notes/getNoteById/' + noteId);
	}

	function search(user, text) {
		var url = '/notes/search/' + user;
        if (text) {
            url += '/' + text;
        }
        return $http.get(url);
	}

	function getNotes(user, verseId) {
		return $http.get('/notes/getNotesByVerseId/' + user + '/' + verseId);
	}

	return {
		getNote: getNote,
		search: search,
		getNotes: getNotes
	};
});