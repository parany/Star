starApp.factory('noteService', function($http) {
	function getNote(noteId) {
		return $http.get('/notes/getNoteById/' + noteId);
	}

	function getNotes(verseId) {
		return $http.get('/notes/getNotesByVerseId/' + verseId);
	}

	function search(user, text) {
		var url = '/notes/search';
        if (text) {
            url += '/' + text;
        }
        return $http.get(url);
	}

	return {
		getNote: getNote,
		getNotes: getNotes,
		search: search
	};
});