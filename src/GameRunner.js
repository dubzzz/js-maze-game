(function(exports) {

var MapReader = typeof require === 'undefined' ? MazeGame.MapReader : require('./MapReader.js').MapReader;
var linearToXY = typeof require === 'undefined' ? MazeGame.linearToXY : require('./MapReader.js').linearToXY;
var xyToLinear = typeof require === 'undefined' ? MazeGame.xyToLinear : require('./MapReader.js').xyToLinear;

var GameRunner = function(displayer, raw_data) {
	var self = this;
	var reader_ = new MapReader(raw_data);
	var displayer_ = displayer;
	
	var map = reader_.getMap();
	var mapping_button_to_id = undefined;
	var mapping_door_to_id = undefined;
	
	var num_moves_ = 0;
	var pos_x_, pos_y_;
	var end_x_, end_y_;

	this.getStart = function() {
		return reader_.getStart();
	};

	this.getEnd = function() {
		return reader_.getEnd();
	};

	this.move = function(direction) {
		var next_x = pos_x_;
		var next_y = pos_y_;

		switch (direction) {
			case 'left':
				next_x -= 1;
				break;
			case 'right':
				next_x += 1;
				break;
			case 'up':
				next_y -= 1;
				break;
			case 'down':
				next_y += 1;
				break;
		}

		if (next_x < 0 || next_x >= reader_.getSizeX() || next_y < 0 || next_y >= reader_.getSizeY()) {
			return false;
		}

		num_moves_ += 1;
		pos_x_ = next_x;
		pos_y_ = next_y;
		return true;
	};

	this.restart = function() {
		num_moves_ = 0;
		
		var xy = linearToXY(reader_.getStart(), reader_.getSizeX());
		pos_x_ = xy[0];
		pos_y_ = xy[1];
		
		xy = linearToXY(reader_.getEnd(), reader_.getSizeX());
		end_x_ = xy[0];
		end_y_ = xy[1];
		
		displayer_.display(map, mapping_button_to_id, mapping_door_to_id);
	};

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
		map = reader_.getMap();
		mapping_button_to_id = revampMapping(reader_.getMappingButtonId());
		mapping_door_to_id = revampMapping(reader_.getMappingDoorId());
		
		this.restart();
	}
};

exports.GameRunner = GameRunner;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));
