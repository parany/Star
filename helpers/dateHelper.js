Date.prototype.toAnyString = function () {
    return this.getFullYear() + '-' + parseInt(this.getMonth() + 1).format() + '-' + this.getDate().format();
}

Date.prototype.getFirstMs = function () {
    return this.setUTCHours(0, 0, 0, 0);
}

Date.prototype.getLastMs = function () {
    return this.setUTCHours(23, 59, 59, 999);
}