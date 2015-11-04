'use strict';

var DOOR_TIME = require('../../src/MazeSolver.js').DOOR_TIME;
var MazeSolver = require('../../src/MazeSolver.js').MazeSolver;

describe('Solve mazes', function() {
	it('Check DOOR_TIME constant', function(done) {
		DOOR_TIME.should.be.equal(10);
		done();
	});
	
	/** No wall **/

	it('Too close (mini map)', function(done) {
		var raw = [[98,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(1);
		done();
	});
	it('Too close (large map)', function(done) {
		var raw = [
			[ 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0],
			[ 0, 0,99, 0, 0],
			[ 0, 0,98, 0, 0],
			[ 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(1);
		done();
	});
	it('Line without walls', function(done) {
		var raw = [[ 0,98, 0, 0, 0, 0,99, 0]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(5);
		done();
	});
	
	/** With walls **/
	
	it('By-pass a wall', function(done) {
		var raw = [
			[ 0,98, 0,97, 0, 0,99, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(7);
		done();
	});
	it('Line blocked by a wall', function(done) {
		var raw = [[ 0,98, 0,97, 0, 0,99, 0]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});

	/** With doors.. **/

	it('By-pass a door', function(done) {
		var raw = [
			[ 0,98, 0, 1, 0, 0,99, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(7);
		done();
	});
	it('Open a door', function(done) {
		var raw = [[-1,98, 0, 1, 0, 0,99, 0]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(7);
		done();
	});
	it('Line blocked by a door', function(done) {
		var raw = [[ 0,98, 0, 1, 0, 0,99, 0]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});
	it('Max door time', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(11);
		done();
	});
	it('Max door time +1 (block cannot be closed)', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(12);
		done();
	});
	it('Too slow to reach the door', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});
	it('Multiple doors', function(done) {
		var raw = [[98,-1,-2, 1, 2,-3, 3,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(7);
		done();
	});
	it('Doors leading to buttons', function(done) {
		var raw = [
			[-1,97,-2,97,-3,97,97],
			[ 0,97, 1,97, 2,97,97],
			[98, 0, 0, 0, 0, 3,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(18);
		done();
	});
	it('Same button for multiple doors', function(done) {
		var raw = [
			[-1,97,-2,97,97,97],
			[ 0,97, 1,97,97,97],
			[98, 0, 0, 1, 2,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(13);
		done();
	});
	it('Same button for multiple doors, but too slow', function(done) {
		var raw = [
			[-1,97,-2,97,97,97,97,97],
			[ 0,97, 1,97,97,97,97,97],
			[98, 0, 0, 0, 0, 1, 2,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});
	it('Unreachable button', function(done) {
		var raw = [
			[-1,97,-2,97, 0, 0, 0, 1,-3],
			[ 0,97, 1,97, 0,97,97,97,97],
			[98, 0, 0, 0, 0, 0, 0, 3,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});
	
	/** With reversed doors.. **/

	it('Walk on unactivated reversed', function(done) {
		var raw = [[ 0,98, 0,11, 0, 0,99, 0]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(5);
		done();
	});
	it('By-pass activated reversed', function(done) {
		var raw = [
			[98,-1,11, 0, 0, 0, 0,99],
			[97, 0, 0, 0,11, 0,11,11]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(9);
		done();
	});
	it('Button activate reversed immediately', function(done) {
		var raw = [[98,-1,11, 0, 0, 0, 0,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});
	it('Button activate reversed immediately (going up)', function(done) {
		var raw = [[99],[12],[-2],[98]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});
	it('Cannot move without activating the reversed', function(done) {
		var raw = [[98,-1, 0,11, 0, 0, 0, 0,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});
	it('Move back and forth to pass the reversed', function(done) {
		var raw = [[98,-1, 0, 0,11, 0, 0, 0, 0,99]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(17);
		done();
	});
	it('Same button for doors and reversed', function(done) {
		var raw = [
			[99, 0, 2, 0, 0],
			[11,97,12,97, 0],
			[ 0,97,-2,97,-2],
			[-1,97, 1,97, 0],
			[98, 0, 0, 2, 1]];
		var solver = new MazeSolver(raw);
		solver.minimumMoves().should.be.equal(18);
		done();
	});

	/** With custom door times **/

	it('Do not use default door time (less than default)', function(done) {
		var raw = [[98,-5, 0, 0, 5,99]];
		var door_times = {5: 1};
		var solver = new MazeSolver(raw, door_times);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});
	it('Do not use default door time (more than default)', function(done) {
		var raw = [[98,-5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,99]];
		var door_times = {5: 100};
		var solver = new MazeSolver(raw, door_times);
		solver.minimumMoves().should.be.equal(17);
		done();
	});
	it('Multiple door times', function(done) {
		var raw = [[98,-5,-6, 6, 5,99]];
		var door_times = {5: 3, 6: 1};
		var solver = new MazeSolver(raw, door_times);
		solver.minimumMoves().should.be.equal(5);
		done();
	});
	it('Multiple door times but too short', function(done) {
		var raw = [[98,-5,-6, 6, 5,99]];
		var door_times = {5: 1, 6: 1};
		var solver = new MazeSolver(raw, door_times);
		solver.minimumMoves().should.be.equal(-1);
		done();
	});
	it('Door time not set is default', function(done) {
		var raw = [[98,-5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,99]];
		var door_times = {};
		var solver = new MazeSolver(raw, door_times);
		solver.minimumMoves().should.be.equal(12);
		done();
	});
});

