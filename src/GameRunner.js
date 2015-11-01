(function(exports) {

var MapReader = typeof require === 'undefined' ? MazeGame.MapReader : require('./MapReader.js').MapReader;
var linearToXY = typeof require === 'undefined' ? MazeGame.linearToXY : require('./MapReader.js').linearToXY;
var xyToLinear = typeof require === 'undefined' ? MazeGame.xyToLinear : require('./MapReader.js').xyToLinear;

var GameRunner = function(displayer, raw_data) {
	var self = this;
	var reader_ = new MapReader(raw_data);
	var displayer_ = displayer;

	var revampMapping = function(raw_mapping) {
		var mapping = {};
		var keys = Object.keys(raw_mapping);
		for (var i = 0 ; i < keys.length ; ++i) {
			var key = keys[i];
			var xy = linearToXY(key, reader_.getSizeX());
			var x = xy[0];
			var y = xy[1];
			if (mapping[y] === undefined) {
				mapping[y] = {};
			}
			mapping[y][x] = raw_mapping[key];
		}
		return mapping;
	};

	{
		var map = reader_.getMap();
		var mapping_button_to_id = revampMapping(reader_.getMappingButtonId());
		var mapping_door_to_id = revampMapping(reader_.getMappingDoorId());
		displayer_.display(map, mapping_button_to_id, mapping_door_to_id);
	}
};

exports.GameRunner = GameRunner;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));
