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

var MAX_DOORS = 10;

function xyToLinear(x, y, size_x) {
	return y * size_x + x;
}

function linearToXY(linear, size_x) {
	var x = linear % size_x;
	var y = Math.floor(linear/size_x);
	return [x, y];
}

var compression_patterns = [
	{'from': "00", 'to': "A"},
	{'from': "33", 'to': "B"},
	
	{'from': "03", 'to': "C"},
	{'from': "30", 'to': "D"},
	
	{'from': "0A", 'to': "E"},
	{'from': "A0", 'to': "F"},
	{'from': "3A", 'to': "G"},
	{'from': "A3", 'to': "H"},
	{'from': "AA", 'to': "I"},

	{'from': "0B", 'to': "J"},
	{'from': "B0", 'to': "K"},
	{'from': "3B", 'to': "L"},
	{'from': "B3", 'to': "M"},
	{'from': "BB", 'to': "N"},
];

function compress(value) {
	var out = value;
	for (var i = 0 ; i < compression_patterns.length ; ++i) {
		var pattern = compression_patterns[i];
		out = out.replace(new RegExp(pattern['from'], "g"), pattern['to']);
	}
	return out;
}

function uncompress(value) {
	var out = value;
	for (var i = compression_patterns.length -1 ; i >= 0  ; --i) {
		var pattern = compression_patterns[i];
		out = out.replace(new RegExp(pattern['to'], "g"), pattern['from']);
	}
	return out;
}

function toCharValue(value) {
	if (value < 10)
		return value.toString();
	else
		return String.fromCharCode(value-10 + "a".charCodeAt(0));
}

function stringsToRawData(strings) {
	var width = strings[0];
	var raw_data = new Array();

	mapping_string_to_cell = {"0": 0, "1": 98, "2": 99, "3": 97};
	for (var i = 0 ; i < MAX_DOORS ; ++i) {
		var shift = 4 + 3*i;
		mapping_string_to_cell[toCharValue(shift)] = i+1;
		mapping_string_to_cell[toCharValue(shift+1)] = -i-1;
		mapping_string_to_cell[toCharValue(shift+2)] = MAX_DOORS+i+1;
	}
	
	var string_map = uncompress(strings[1]);
	var current_line = new Array();
	for (var i = 0 ; i < string_map.length ; ++i) {
		current_line.push(mapping_string_to_cell[string_map[i]]);
		if (current_line.length == width) {
			raw_data.push(current_line);
			current_line = new Array();
		}
	}
	return raw_data;
}

function rawDataToStrings(raw_data) {
	var strings = new Array();
	strings.push(raw_data[0].length.toString());

	mapping_cell_to_string = {0: "0", 98: "1", 99: "2", 97: "3"};
	for (var i = 0 ; i < MAX_DOORS ; ++i) {
		var shift = 4 + 3*i;
		mapping_cell_to_string[i+1] = toCharValue(shift);
		mapping_cell_to_string[-i-1] = toCharValue(shift+1);
		mapping_cell_to_string[MAX_DOORS+i+1] = toCharValue(shift+2);
	}
	
	var string_map = "";
	for (var y = 0 ; y < raw_data.length ; ++y) {
		for (var x = 0 ; x < raw_data[0].length ; ++x) {
			string_map += mapping_cell_to_string[ raw_data[y][x] ];
		}
	}
	strings.push(compress(string_map));
	return strings;
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
	var mapping_reversed_to_id_ = {}; // xyToLinear -> n
	var mapping_id_to_reversed_ = {}; // n -> list of xyToLinear (reversed)
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
	
	this.getMappingReversedId = function() {
		return mapping_reversed_to_id_;
	};
	
	this.getMappingIdReversed = function() {
		return mapping_id_to_reversed_;
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
					if (cell <= MAX_DOORS) {
						if (! mapping_id_to_doors_.hasOwnProperty(cell)) {
							mapping_id_to_doors_[cell] = new Array();
						}
						mapping_id_to_doors_[cell].push(xyToLinear(x, y, size_x_));
						mapping_door_to_id_[xyToLinear(x, y, size_x_)] = cell;
						return 'd';
					} else {
						cell -= MAX_DOORS;
						if (! mapping_id_to_reversed_.hasOwnProperty(cell)) {
							mapping_id_to_reversed_[cell] = new Array();
						}
						mapping_id_to_reversed_[cell].push(xyToLinear(x, y, size_x_));
						mapping_reversed_to_id_[xyToLinear(x, y, size_x_)] = cell;
						return 'r';
					}
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

exports.MAX_DOORS = MAX_DOORS;
exports.xyToLinear = xyToLinear;
exports.linearToXY = linearToXY;
exports.MapReader = MapReader;
exports.stringsToRawData = stringsToRawData;
exports.rawDataToStrings = rawDataToStrings;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));

