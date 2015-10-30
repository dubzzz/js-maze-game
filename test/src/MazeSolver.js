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
});

