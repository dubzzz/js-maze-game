(function() {

/**
 * MazeSolver solves the Maze described by a bi-dimensional array of int
 */

var DOOR_TIME = 10;

var MazeSolver = function(raw_data) {
	var self = this;
	
	this.minimumMoves = function() {
		return -1;
	};
};

module.exports.DOOR_TIME = DOOR_TIME;
module.exports.MazeSolver = MazeSolver;
}());
