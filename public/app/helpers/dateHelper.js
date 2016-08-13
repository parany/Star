Date.prototype.toAnyString = function() {
	return this.getFullYear() + '-' + parseInt(this.getMonth() + 1).format() + '-' + this.getDate().format();
};

Date.prototype.toCompareString = function() {
	return this.getDate().format() + '/' + parseInt(this.getMonth() + 1).format() + '/' + this.getFullYear();
};

Date.prototype.getFirstMsOfDay = function() {
	return this.setHours(0, 0, 0, 0);
};

Date.prototype.getLastMsOfDay = function() {
	return this.setHours(23, 59, 59, 999);
};

Date.prototype.getFirstMsOfYear = function() {
	var date = this.setMonth(0, 1);
	return new Date(date).getFirstMsOfDay();
};

Date.prototype.getLastMsOfYear = function() {
	var date = this.setMonth(11, 31);
	return new Date(date).getLastMsOfDay();
};

Date.prototype.getFirstMsOfMonth = function() {
	var date = this.setDate(1);
	return new Date(date).getFirstMsOfDay();
};

Date.prototype.getLastMsOfMonth = function() {
	var date = this.setDate(31);
	return new Date(date).getLastMsOfDay();
};

Date.prototype.getFirstMsOfWeek = function() {
	var day = this.getDay();
	var date = 1000 * 60 * 60 * 24 * day;
	var firstMsOfDay = this.getFirstMsOfDay();
	return firstMsOfDay - date;
};

Date.prototype.getLastMsOfWeek = function() {
	var day = this.getDay();
	var date = 1000 * 60 * 60 * 24 * (6 - day + 1);
	var firstMsOfDay = this.getFirstMsOfDay();
	return firstMsOfDay + date;
};

Date.prototype.getElapsed = function() {
	var now = new Date(new Date() - this);
	var str = '';
	if (now.getMonth()) {
		str += `${now.getMonth() + 1}M `;
	}
	if (now.getDate() - 1) {
		str += `${now.getDate() - 1}d `;
	}
	if (now.getHours() - 3) {
		str += `${now.getHours() -3}h `;
	}
	if (now.getMinutes()) {
		str += `${now.getMinutes()}min `;
	}
	str += `${now.getSeconds()}sec `;
	return str;
};