'use strict';

var DOOR_TIME = require('../../src/MazeSolver.js').DOOR_TIME;
var GameRunner = require('../../src/GameRunner.js').GameRunner;

var displayer = {
	displayCell: function(ctx, x, y, cell, group_id) {},
	display: function(map, mapping_button_to_id, mapping_door_to_id) {}
};

describe('Solve mazes', function() {
	it('Check DOOR_TIME constant', function(done) {
		DOOR_TIME.should.be.equal(10);
		done();
	});
	
	/** Start and end point */
	
	it('Start point', function(done) {
		var raw = [[98,99]];
		var runner = new GameRunner(displayer, raw);
		runner.getStart().should.be.equal(0);
		done();
	});
	it('End point', function(done) {
		var raw = [[98,99]];
		var runner = new GameRunner(displayer, raw);
		runner.getEnd().should.be.equal(1);
		done();
	});
	
	/** Map limits **/

	it('One cell map', function(done) {
		var raw = [[98]];
		var runner = new GameRunner(displayer, raw);
		runner.move('up').should.be.false;
		runner.move('down').should.be.false;
		runner.move('left').should.be.false;
		runner.move('right').should.be.false;
		done();
	});
	it('Multi-cell map', function(done) {
		var raw = [
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0,98, 0, 0],
			[ 0, 0, 0, 0, 0, 0]];
		
		var runner = new GameRunner(displayer, raw);
		runner.move('up').should.be.true;
		runner.move('up').should.be.true;
		runner.move('up').should.be.false;

		runner.restart();
		runner.move('down').should.be.true;
		runner.move('down').should.be.false;
		
		runner.restart();
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.false;
		
		runner.restart();
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.false;
		done();
	});

	/** Hit again walls **/
	
	it('Hit a wall', function(done) {
		var raw = [
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 1,98, 0,97],
			[ 0, 0, 0, 0, 0, 0]];
		
		var runner = new GameRunner(displayer, raw);
		runner.move('right').should.be.true;
		runner.move('right').should.be.false;
		done();
	});
	it('Hit a door', function(done) {
		var raw = [
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 1,98, 0,97],
			[ 0, 0, 0, 0, 0, 0]];
		
		var runner = new GameRunner(displayer, raw);
		runner.move('right').should.be.true;
		runner.move('right').should.be.false;
		done();
	});

	/** Manage doors **/

	it('Open one door', function(done) {
		var raw = [[98,-1, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		done();
	});
	it('Max door time', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		done();
	});
	it('Max door time +1 (block cannot be closed)', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		done();
	});
	it('Too slow to reach the door', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.true;
		runner.move('left').should.be.false;
		done();
	});
	it('Doors leading to buttons', function(done) {
		var raw = [
			[-1,97,-2,97,-3,97,97],
			[ 0,97, 1,97, 2,97,97],
			[98, 0, 0, 0, 0, 3,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('up').should.be.true;
		runner.move('up').should.be.true;
		runner.move('down').should.be.true;
		runner.move('down').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('up').should.be.true;
		runner.move('up').should.be.true;
		runner.move('down').should.be.true;
		runner.move('down').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('up').should.be.true;
		runner.move('up').should.be.true;
		runner.move('down').should.be.true;
		runner.move('down').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		done();
	});
});

