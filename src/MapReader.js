(function(exports) {

/**
 * MapReader is responsible to read a bi-dimension array of int describing the map
 *
 *  0: path
 *  n (where n>1 and n<CELL_WALL): door #n
 * -n (where n>1 and n<CELL_WALL): button all doors #n
 */

var CELL_WALL = 97;
var CELL_START = 98;
var CELL_END = 99;

function xyToLinear(x, y, size_x) {
	return y * size_x + x;
}

function linearToXY(linear, size_x) {
	var x = linear % size_x;
	var y = Math.floor(linear/size_x);
	return [x, y];
}

var MapReader = function(raw_data) {
	var self = this;
	var size_x_ = raw_data[0].length;
	var size_y_ = raw_data.length;

	var start_ = -1;
	var end_ = -1;
	var mapping_button_to_id_ = {}; // xyToLinear -> n
	var mapping_door_to_id_ = {}; // xyToLinear -> n
	var mapping_id_to_doors_ = {}; // n -> list of xyToLinear (doors)
	var map_ = new Array();
	
	this.getSizeX = function() {
		return size_x_;
	};

	this.getSizeY = function() {
		return size_y_;
	};

	this.getStart = function() {
		return start_;
	};

	this.getEnd = function() {
		return end_;
	};
	
	this.getMappingButtonId = function() {
		return mapping_button_to_id_;
	};
	
	this.getMappingDoorId = function() {
		return mapping_door_to_id_;
	};
	
	this.getMappingIdDoors = function() {
		return mapping_id_to_doors_;
	};

	this.getMap = function() {
		return map_;
	};

	var scanCell_ = function(x, y) {
		var cell = raw_data[y][x];
		switch (cell) {
			case 0:
				return ' ';
			case CELL_WALL:
				return '#';
			case CELL_START:
				start_ = xyToLinear(x, y, size_x_);
				return 's';
			case CELL_END:
				end_ = xyToLinear(x, y, size_x_);
				return 'e';
			default:
				if (cell > 0) {
					if (! mapping_id_to_doors_.hasOwnProperty(cell)) {
						mapping_id_to_doors_[cell] = new Array();
					}
					mapping_id_to_doors_[cell].push(xyToLinear(x, y, size_x_));
					mapping_door_to_id_[xyToLinear(x, y, size_x_)] = cell;
					return 'd';
				}
				else {
					mapping_button_to_id_[xyToLinear(x, y, size_x_)] = -cell;
					return 'b';
				}
		}
		
	};

	{
		for (var y = 0 ; y < size_y_ ; ++y) {
			var map_line = "";
			for (var x = 0 ; x < size_x_ ; ++x) {
				map_line += scanCell_(x, y);
			}
			map_.push(map_line);
		}
	}
};

exports.xyToLinear = xyToLinear;
exports.linearToXY = linearToXY;
exports.MapReader = MapReader;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));

