Number.prototype.format = function () {
    if ((this + '').length < 2) return '0' + this;
    return this;
};
