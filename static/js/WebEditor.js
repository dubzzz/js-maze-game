(function(exports) {

var MapReader = typeof require === 'undefined' ? MazeGame.MapReader : require('./MapReader.js').MapReader;
var linearToXY = typeof require === 'undefined' ? MazeGame.linearToXY : require('./MapReader.js').linearToXY;
var xyToLinear = typeof require === 'undefined' ? MazeGame.xyToLinear : require('./MapReader.js').xyToLinear;

var WebEditor = function(displayer, width, height) {
	var self = this;
	var displayer_ = displayer;
	var raw_data = new Array();

	var revampMapping = function(reader, raw_mapping) {
		var mapping = {};
		var keys = Object.keys(raw_mapping);
		for (var i = 0 ; i < keys.length ; ++i) {
			var key = keys[i];
			var xy = linearToXY(key, reader.getSizeX());
			var x = xy[0];
			var y = xy[1];
			if (mapping[y] === undefined) {
				mapping[y] = {};
			}
			mapping[y][x] = raw_mapping[key];
		}
		return mapping;
	};

	var display = function() {
		var reader = new MapReader(raw_data);
		displayer_.display(reader.getMap()
				, revampMapping(reader, reader.getMappingButtonId())
				, revampMapping(reader, reader.getMappingDoorId())
				, revampMapping(reader, reader.getMappingReversedId()));
	};

	this.resize = function(width, height) {
		raw_data = raw_data.splice(0, height);
		while (raw_data.length < height) {
			raw_data.push(new Array());
		}

		for (var i = 0 ; i < height ; ++i) {
			var raw_line = raw_data[i].splice(0, width);
			while (raw_line.length < width) {
				raw_line.push(0);
			}
			raw_data[i] = raw_line;
		}

		display();
	};

	{
		self.resize(width, height);
	}
};

exports.WebEditor = WebEditor;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));

