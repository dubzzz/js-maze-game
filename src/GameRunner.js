(function(exports) {

var MapReader = typeof require === 'undefined' ? MazeGame.MapReader : require('./MapReader.js').MapReader;
var linearToXY = typeof require === 'undefined' ? MazeGame.linearToXY : require('./MapReader.js').linearToXY;
var xyToLinear = typeof require === 'undefined' ? MazeGame.xyToLinear : require('./MapReader.js').xyToLinear;

var GameRunner = function(displayer, raw_data) {
	var reader_ = new MapReader(raw_data);
};

exports.GameRunner = GameRunner;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));
