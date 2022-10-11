function Duration(s=0) {
    this.seconds = s;
}

Duration.prototype.addTimeSince = function(date) {
    return new Duration(this.seconds + Math.floor((Date.now() - date) / 1000));
};

Duration.prototype.toString = function(includeSeconds) {
    const arr = [
	Math.floor(this.seconds / 3600),
	Math.floor(this.seconds % 3600 / 60)
    ];
    
    if (includeSeconds) {
	arr.push(this.seconds % 60);
    }
    
    return arr.map(n => String(n).padStart(2, "0")).join(":");
};

Duration.fromStr = function(str) {
    const arr = str.split(":").map(s => +s);
    return new Duration(arr[0]*3600 + arr[1]*60 + arr[2]);
};

module.exports = Duration;
