(function(exports) {

var MapReader = typeof require === 'undefined' ? MazeGame.MapReader : require('./MapReader.js').MapReader;
var linearToXY = typeof require === 'undefined' ? MazeGame.linearToXY : require('./MapReader.js').linearToXY;
var xyToLinear = typeof require === 'undefined' ? MazeGame.xyToLinear : require('./MapReader.js').xyToLinear;

var DOOR_TIME = 10;

var GameRunner = function(displayer, raw_data) {
	var self = this;
	var reader_ = new MapReader(raw_data);
	var displayer_ = displayer;
	
	var map_ = reader_.getMap();
	var mapping_button_to_id_ = undefined;
	var mapping_door_to_id_ = undefined;
	var mapping_id_to_doors_ = undefined;
	var doors_status_ = {};
	
	var num_moves_ = 0;
	var pos_x_, pos_y_;
	var end_x_, end_y_;

	this.getStart = function() {
		return reader_.getStart();
	};

	this.getEnd = function() {
		return reader_.getEnd();
	};

	var refreshDoors = function(group_id) {
		var value = doors_status_[group_id] > 0 ? ' ' : 'd';
		var doors = mapping_id_to_doors_[group_id];
		for (var i = 0 ; i < doors.length ; ++i) {
			var xy = linearToXY(doors[i], reader_.getSizeX());
			var x = xy[0];
			var y = xy[1];
			displayer_.displayCell(x, y, value, group_id);
		}
	}

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
		
		switch (map_[next_y][next_x]) {
			case '#':
				return false;
			case 'b':
				var group_id = mapping_button_to_id_[next_y][next_x];
				if (doors_status_[group_id] !== undefined) {
					doors_status_[group_id] = DOOR_TIME +1; // +1 because decreased just after
					refreshDoors(group_id);
				}
				break;
			case 'd':
				var group_id = mapping_door_to_id_[next_y][next_x];
				if (doors_status_[group_id] == 0) {
					return false;
				}
				break;
		}
		
		// Override previous drawing of the character
		
		switch (map_[pos_y_][pos_x_]) {
			case 'b':
				displayer.displayCell(pos_x_, pos_y_, 'b', mapping_button_to_id_[pos_y_][pos_x_]);
				break;
			case 'd':
				var group_id = mapping_door_to_id_[pos_y_][pos_x_];
				displayer.displayCell(pos_x_, pos_y_, doors_status_[group_id] == 0 ? 'd' : ' ', group_id);
				break;
			default:
				displayer.displayCell(pos_x_, pos_y_, map_[pos_y_][pos_x_]);
				break;
		}
		
		// Update doors

		var keys = Object.keys(doors_status_);
		for (var i = 0 ; i < keys.length ; ++i) {
			var key = keys[i];
			if (doors_status_[key] > 0) {
				doors_status_[key] -= 1;
				if (doors_status_[key] == 0) {
					refreshDoors(key);
				}
			}
		}

		// Draw characters
		
		displayer.displayCharacter(next_x, next_y);

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
		
		var keys = Object.keys(doors_status_);
		for (var i = 0 ; i < keys.length ; ++i) {
			doors_status_[keys[i]] = 0;
		}
		
		displayer_.display(map_, mapping_button_to_id_, mapping_door_to_id_);
		displayer_.displayCharacter(pos_x_, pos_y_);
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
		map_ = reader_.getMap();
		mapping_button_to_id_ = revampMapping(reader_.getMappingButtonId());
		mapping_door_to_id_ = revampMapping(reader_.getMappingDoorId());
		mapping_id_to_doors_ = reader_.getMappingIdDoors();

		var keys = Object.keys(mapping_id_to_doors_);
		for (var i = 0 ; i < keys.length ; ++i) {
			doors_status_[keys[i]] = 0;
		}

		this.restart();
	}
};

exports.GameRunner = GameRunner;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));
