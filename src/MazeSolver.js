(function(exports) {

/**
 * MazeSolver solves the Maze described by a bi-dimensional array of int
 *
 * Why is there such internal array structure?
 * The internal structure applies the principle of dynamic programming.
 * It will be used to store relevant values of past runs.
 *
 * How did we decide its size?
 * We have a maze of size_x x size_y cells at each times we have:
 *  (door_time_ +1) ^ NUM_DOORS
 * possibilities for the configuration of doors.
 * helper[door combination][y][x]
 *
 * This figure might be reduce as (latter):
 * A user can only press one button at a time so she/he can only open a set of
 * doors at a time.
 * If door #1 still have N rounds opened and door #2 still have M, N != M
 */

var Heap = typeof require === 'undefined' ? MazeGame.Heap : require('./Heap.js').Heap;
var MapReader = typeof require === 'undefined' ? MazeGame.MapReader : require('./MapReader.js').MapReader;
var linearToXY = typeof require === 'undefined' ? MazeGame.linearToXY : require('./MapReader.js').linearToXY;
var xyToLinear = typeof require === 'undefined' ? MazeGame.xyToLinear : require('./MapReader.js').xyToLinear;

var DOOR_TIME = 10;

var LEFT = 0;
var RIGHT = 1;
var TOP = 2;
var BOTTOM = 3;

var MazeSolver = function(raw_data, door_times) {
	var self = this;
	var miniPath = undefined;
	var miniMoves = -1;
	var numTotalChoices = 0;
	var numTotalTests = 0;
	var door_times_ = {};

	this.minimumMoves = function() {
		return miniMoves;
	};

	this.totalChoices = function() {
		return numTotalChoices;
	};

	this.totalTests = function() {
		return numTotalTests;
	};

	this.path = function() {
		return miniPath;
	};

	var computeLevel = function(keys, doors_status) {
		var level = 0;
		for (var i = 0 ; i < keys.length ; ++i) {
			var key = keys[i];
			level *= door_times_[key] +1;
			level += doors_status[key];
		}
		return level;
	};

	var allClosedDoors = function(keys) {
		var doors = {};
		for (var i = 0 ; i < keys.length ; ++i) {
			doors[keys[i]] = 0;
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
	
	var allowed = function(cell_x, cell_y, size_x, size_y, current_doors, map, helper, door_to_id, reversed_to_id) {
		if (cell_x < 0 || cell_x >= size_x || cell_y < 0 || cell_y >= size_y) {
			return false; // out of map
		}
		switch (map[cell_y][cell_x]) {
			case '#':
				return false;
			case 'd':
				return current_doors[door_to_id[xyToLinear(cell_x,cell_y,size_x)]] > 0;
			case 'r':
				return current_doors[reversed_to_id[xyToLinear(cell_x,cell_y,size_x)]] <= 0;
		}
		return true;
	};

	var savePath = function(helper, cell_x, cell_y, cell_level) {
		miniPath = new Array();

		var x = cell_x;
		var y = cell_y;
		var level = cell_level;
		
		while (helper[level][y][x]['level'] != -1) { // -1 is the value set for departure
			
			var move_level = helper[level][y][x]['level'];
			var move_direction = helper[level][y][x]['direction'];

			switch (move_direction) {
				case LEFT:
					miniPath.push("left");
					x += 1;
					break;
				case RIGHT:
					miniPath.push("right");
					x -= 1;
					break;
				case TOP:
					miniPath.push("up");
					y += 1;
					break;
				case BOTTOM:
					miniPath.push("down");
					y -= 1;
					break;
				default:
					return;
			}
			level = move_level;
		}
		miniPath.reverse();
	};

	var pushIf = function(direction, cell_x, cell_y, cell_dist, size_x, size_y, popped_level, popped_doors, doors_keys, map, helper, button_to_id, door_to_id, reversed_to_id, size) {
		if (allowed(cell_x, cell_y, size_x, size_y, popped_doors, map, helper, door_to_id, reversed_to_id)) {
			var cell_doors = descreasedDoors(doors_keys, popped_doors);
			if (map[cell_y][cell_x] == 'b') {
				var bid = button_to_id[xyToLinear(cell_x,cell_y,size_x)];
				cell_doors[bid] = door_times_[bid];
			}

			var cell_level = computeLevel(doors_keys, cell_doors);
			if (helper[cell_level][cell_y][cell_x] === undefined) { // others have already been treated
				helper[cell_level][cell_y][cell_x] = {direction: direction, level: popped_level};
				elts.push({dist: cell_dist, x: cell_x, y: cell_y, doors: cell_doors, level: cell_level});
			}
			if (map[cell_y][cell_x] == 'e') {
				miniMoves = cell_dist;
				savePath(helper, cell_x, cell_y, cell_level);
				return false;
			}
		}
		return true;
	};

	{
		var reader = new MapReader(raw_data);
		var doors_from_id = reader.getMappingIdDoors();
		var reversed_from_id = reader.getMappingIdReversed();
		var door_to_id = reader.getMappingDoorId();
		var button_to_id = reader.getMappingButtonId();
		var reversed_to_id = reader.getMappingReversedId();
		
		var doors_keys = Object.keys(doors_from_id);
		var reversed_keys = Object.keys(reversed_from_id);
		for (var i = 0 ; i < reversed_keys.length ; ++i) {
			var key = reversed_keys[i];
			if (doors_keys.indexOf(key) == -1) {
				doors_keys.push(key);
			}
		}

		var num_combinations = 1;
		var num_doors = doors_keys.length;
		for (var i = 0 ; i < num_doors ; ++i) {
			var key = doors_keys[i];
			var dtime = door_times !== undefined && door_times.hasOwnProperty(key) ? door_times[key] : DOOR_TIME;
			door_times_[key] = dtime;
			num_combinations *= dtime +1;
		}

		var size_x = reader.getSizeX();
		var size_y = reader.getSizeY();

		var start_pos = linearToXY(reader.getStart(), size_x);
		var map = reader.getMap();

		var helper = new Array(num_combinations);
		for (var i = 0 ; i < num_combinations ; ++i) {
			var intermediate_level = new Array(size_y);
			for (var y = 0 ; y < size_y ; ++y) {
				var intermediate_y = new Array(size_x);
				for (var x = 0 ; x < size_x ; ++x) {
					intermediate_y[x] = undefined; // the direction that brang us to that case (quickest path), undefined not initialized
				}
				intermediate_level[y] = intermediate_y;
			}
			helper[i] = intermediate_level;
		}
		helper[0][start_pos[1]][start_pos[0]] = {direction: -1, level: -1};

		var elts = new Heap();
		elts.push({dist: 0, x: start_pos[0], y: start_pos[1], doors: allClosedDoors(doors_keys), level: 0});
		numTotalChoices += 1;

		var popped = undefined;
		while (popped = elts.pop()) {
			var popped_x = popped['x'];
			var popped_y = popped['y'];
			var popped_doors = popped['doors'];
			var popped_level = popped['level'];
			
			var cell_dist = popped['dist'] +1;
			++numTotalTests;
			var before = elts.size();
			
			if (! pushIf(RIGHT, popped_x +1, popped_y, cell_dist, size_x, size_y, popped_level, popped_doors, doors_keys, map, helper, button_to_id, door_to_id, reversed_to_id)) {
				return cell_dist;
			}
			if (! pushIf(LEFT, popped_x -1, popped_y, cell_dist, size_x, size_y, popped_level, popped_doors, doors_keys, map, helper, button_to_id, door_to_id, reversed_to_id)) {
				return cell_dist;
			}
			if (! pushIf(BOTTOM, popped_x, popped_y +1, cell_dist, size_x, size_y, popped_level, popped_doors, doors_keys, map, helper, button_to_id, door_to_id, reversed_to_id)) {
				return cell_dist;
			}
			if (! pushIf(TOP, popped_x, popped_y -1, cell_dist, size_x, size_y, popped_level, popped_doors, doors_keys, map, helper, button_to_id, door_to_id, reversed_to_id)) {
				return cell_dist;
			}
			numTotalChoices += elts.size() - before;
		}
	}
};

exports.DOOR_TIME = DOOR_TIME;
exports.MazeSolver = MazeSolver;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));

