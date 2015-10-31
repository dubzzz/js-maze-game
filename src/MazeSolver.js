(function() {

/**
 * MazeSolver solves the Maze described by a bi-dimensional array of int
 *
 * Why is there such internal array structure?
 * The internal structure applies the principle of dynamic programming.
 * It will be used to store relevant values of past runs.
 *
 * How did we decide its size?
 * We have a maze of size_x x size_y cells at each times we have:
 *  (DOOR_TIME +1) ^ NUM_DOORS
 * possibilities for the configuration of doors.
 * helper_[door combination][y][x]
 *
 * This figure might be reduce as (latter):
 * A user can only press one button at a time so she/he can only open a set of
 * doors at a time.
 * If door #1 still have N rounds opened and door #2 still have M, N != M
 */

var Heap = require('./Heap.js').Heap;
var MapReader = require('./MapReader.js').MapReader;
var linearToXY = require('./MapReader.js').linearToXY;
var xyToLinear = require('./MapReader.js').xyToLinear;

var DOOR_TIME = 10;

var MazeSolver = function(raw_data) {
	var self = this;
	var miniMoves = -1;

	this.minimumMoves = function() {
		return miniMoves;
	};

	var computeLevel = function(keys, doors_status) {
		var level = 0;
		for (var i = 0 ; i < keys.length ; ++i) {
			level *= DOOR_TIME +1;
			level += doors_status[keys[i]];
		}
		return level;
	};

	var computeDoors = function(keys, level) {
		var doors = {};
		var level_copy = level;
		for (var i = keys.length -1 ; i >= 0 ; --i) {
			doors[keys[i]] = level_copy % (DOOR_TIME +1);
			level_copy = Math.floor(level_copy /  (DOOR_TIME +1));
		}
		return doors;
	};
	
	var allClosedDoors = function(keys) {
		var doors = {};
		for (var i = 0 ; i < keys.length ; ++i) {
			doors[keys[i]] = 0;
		}
		return doors;
	};
	
	var clonedDoors = function(keys, doors_status) {
		var doors = {};
		for (var i = 0 ; i < keys.length ; ++i) {
			doors[keys[i]] = doors_status[keys[i]];
		}
		return doors;
	};
	var descreasedDoors = function(keys, doors_status) {
		var doors = {};
		for (var i = 0 ; i < keys.length ; ++i) {
			var status_ = doors_status[keys[i]];
			doors[keys[i]] = status_ > 0 ? status_ -1  : 0;
		}
		return doors;
	};
	
	var allowed = function(cell_x, cell_y, size_x, size_y, current_doors, map, helper, door_to_id) {
		if (cell_x < 0 || cell_x >= size_x || cell_y < 0 || cell_y >= size_y) {
			return false; // out of map
		}
		switch (map[cell_y][cell_x]) {
			case '#':
				return false;
			case 'd':
				return current_doors[door_to_id[xyToLinear(cell_x,cell_y,size_x)]] > 0;
		}
		return true;
	};

	{
		var reader = new MapReader(raw_data);
		var doors_from_id = reader.getMappingIdDoors();
		var door_to_id = reader.getMappingDoorId();
		var button_to_id = reader.getMappingButtonId();
		var doors_keys = Object.keys(doors_from_id);
		var num_doors = Object.keys(doors_from_id).length;
		var num_combinations = Math.pow(DOOR_TIME +1, num_doors);
		
		var size_x = reader.getSizeX();
		var size_y = reader.getSizeY();

		var start_pos = linearToXY(reader.getStart(), size_x);
		var map = reader.getMap();

		var helper_ = new Array(num_combinations);
		for (var i = 0 ; i < num_combinations ; ++i) {
			var intermediate_level = new Array(size_y);
			for (var y = 0 ; y < size_y ; ++y) {
				var intermediate_y = new Array(size_x);
				for (var x = 0 ; x < size_x ; ++x) {
					intermediate_y[x] = -2; //means we have not analyzed this cell
				}
				intermediate_level[y] = intermediate_y;
			}
			helper_[i] = intermediate_level;
		}

		var elts = new Heap();
		elts.push({dist: 0, x: start_pos[0], y: start_pos[1], doors: allClosedDoors(doors_keys)});

		var popped = undefined;
		while (popped = elts.pop()) {
			var popped_x = popped['x'];
			var popped_y = popped['y'];
			var popped_doors = popped['doors'];
			
			var cell_dist = popped['dist'] +1;
			
			{ // To the right
				var cell_x = popped_x +1;
				var cell_y = popped_y;
				var cell_doors = descreasedDoors(doors_keys, popped_doors);

				if (allowed(cell_x, cell_y, size_x, size_y, popped_doors, map, helper_, door_to_id)) {
					if (map[cell_y][cell_x] == 'e') {
						miniMoves = cell_dist;
						return;
					} else if (map[cell_y][cell_x] == 'b') {
						cell_doors[button_to_id[xyToLinear(cell_x,cell_y,size_x)]] = DOOR_TIME;
					}
					var cell_level = computeLevel(doors_keys, cell_doors);
					if (helper_[cell_level][cell_y][cell_x] == -2) { // others have already been treated
						helper_[cell_level][cell_y][cell_x] = cell_dist;
						elts.push({dist: cell_dist, x: cell_x, y: cell_y, doors: cell_doors});
					}
				}
			}
			{ // To the left
				var cell_x = popped_x -1;
				var cell_y = popped_y;
				var cell_doors = descreasedDoors(doors_keys, popped_doors);

				if (allowed(cell_x, cell_y, size_x, size_y, popped_doors, map, helper_, door_to_id)) {
					if (map[cell_y][cell_x] == 'e') {
						miniMoves = cell_dist;
						return;
					} else if (map[cell_y][cell_x] == 'b') {
						cell_doors[button_to_id[xyToLinear(cell_x,cell_y,size_x)]] = DOOR_TIME;
					}
					var cell_level = computeLevel(doors_keys, cell_doors);
					if (helper_[cell_level][cell_y][cell_x] == -2) { // others have already been treated
						helper_[cell_level][cell_y][cell_x] = cell_dist;
						elts.push({dist: cell_dist, x: cell_x, y: cell_y, doors: cell_doors});
					}
				}
			}
			{ // To the bottom
				var cell_x = popped_x;
				var cell_y = popped_y +1;
				var cell_doors = descreasedDoors(doors_keys, popped_doors);

				if (allowed(cell_x, cell_y, size_x, size_y, popped_doors, map, helper_, door_to_id)) {
					if (map[cell_y][cell_x] == 'e') {
						miniMoves = cell_dist;
						return;
					} else if (map[cell_y][cell_x] == 'b') {
						cell_doors[button_to_id[xyToLinear(cell_x,cell_y,size_x)]] = DOOR_TIME;
					}
					var cell_level = computeLevel(doors_keys, cell_doors);
					if (helper_[cell_level][cell_y][cell_x] == -2) { // others have already been treated
						helper_[cell_level][cell_y][cell_x] = cell_dist;
						elts.push({dist: cell_dist, x: cell_x, y: cell_y, doors: cell_doors});
					}
				}
			}
			{ // To the top
				var cell_x = popped_x;
				var cell_y = popped_y -1;
				var cell_doors = descreasedDoors(doors_keys, popped_doors);

				if (allowed(cell_x, cell_y, size_x, size_y, popped_doors, map, helper_, door_to_id)) {
					if (map[cell_y][cell_x] == 'e') {
						miniMoves = cell_dist;
						return;
					} else if (map[cell_y][cell_x] == 'b') {
						cell_doors[button_to_id[xyToLinear(cell_x,cell_y,size_x)]] = DOOR_TIME;
					}
					var cell_level = computeLevel(doors_keys, cell_doors);
					if (helper_[cell_level][cell_y][cell_x] == -2) { // others have already been treated
						helper_[cell_level][cell_y][cell_x] = cell_dist;
						elts.push({dist: cell_dist, x: cell_x, y: cell_y, doors: cell_doors});
					}
				}
			}
		}
	}
};

module.exports.DOOR_TIME = DOOR_TIME;
module.exports.MazeSolver = MazeSolver;
}());
