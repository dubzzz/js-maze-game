(function() {

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
	
	this.getMappingIdDoors = function() {
		return mapping_id_to_doors_;
	};

	this.getMap = function() {
		return map_;
	};
};

module.exports.xyToLinear = xyToLinear;
module.exports.linearToXY = linearToXY;
module.exports.MapReader = MapReader;
}());
