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

	this.set = function(event, cell, group_id) {
		var cellXY = displayer_.getCorrespondingCell(event);
		var x = cellXY['x'];
		var y = cellXY['y'];
		if (y < 0 || y >= raw_data.length || x < 0 || x >= raw_data[0].length) {
			return;
		}

		switch (cell) {
          case 's':
            raw_data[y][x] = 98;
            break;
          case 'e':
            raw_data[y][x] = 99;
            break;
          case ' ':
            raw_data[y][x] = 0;
            break;
          case '#':
            raw_data[y][x] = 97;
            break;
          case '#':
            raw_data[y][x] = 97;
            break;
          case 'b':
            raw_data[y][x] = -group_id;
            break;
          case 'd':
            raw_data[y][x] = group_id;
            break;
          case 'r':
            raw_data[y][x] = 10 + group_id;
            break;
        }
        displayer_.displayCell(x, y, cell, group_id);
	};

	{
		self.resize(width, height);
	}
};

exports.WebEditor = WebEditor;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));

