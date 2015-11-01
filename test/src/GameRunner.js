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
		runner.getStart().should.be.equal(0);
		done();
	});
	
	/** Map limits **/

	it('One cell map', function(done) {
		var raw = [[98]];
		var runner = new GameRunner(displayer, raw);
		runner.move('up').should.be.not.ok();
		runner.move('down').should.be.not.ok();
		runner.move('left').should.be.not.ok();
		runner.move('right').should.be.not.ok();
		done();
	});
	it('Multi-cell map', function(done) {
		var raw = [
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0,98, 0, 0],
			[ 0, 0, 0, 0, 0, 0]];
		
		var runner = new GameRunner(displayer, raw);
		runner.move('up').should.be.ok();
		runner.move('up').should.be.ok();
		runner.move('up').should.be.not.ok();

		runner.restart();
		runner.move('down').should.be.ok();
		runner.move('down').should.be.not.ok();
		
		runner.restart();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.not.ok();
		
		runner.restart();
		runner.move('right').should.be.ok();
		runner.move('right').should.be.ok();
		runner.move('right').should.be.not.ok();
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
		runner.move('right').should.be.ok();
		runner.move('right').should.be.not.ok();
		done();
	});
	it('Hit a door', function(done) {
		var raw = [
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0],
			[ 0, 0, 1,98, 0,97],
			[ 0, 0, 0, 0, 0, 0]];
		
		var runner = new GameRunner(displayer, raw);
		runner.move('right').should.be.ok();
		runner.move('right').should.be.not.ok();
		done();
	});

	/** Manage doors **/

	it('Open one door', function(done) {
		var raw = [[98,-1, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		done();
	});
	it('Max door time', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		done();
	});
	it('Max door time +1 (block cannot be closed)', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		done();
	});
	it('Too slow to reach the door', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.ok();
		runner.move('left').should.be.not.ok();
		done();
	});
	it('Doors leading to buttons', function(done) {
		var raw = [
			[-1,97,-2,97,-3,97,97],
			[ 0,97, 1,97, 2,97,97],
			[98, 0, 0, 0, 0, 3,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('up').should.be.ok();
		runner.move('up').should.be.ok();
		runner.move('down').should.be.ok();
		runner.move('down').should.be.ok();
		runner.move('right').should.be.ok();
		runner.move('right').should.be.ok();
		runner.move('up').should.be.ok();
		runner.move('up').should.be.ok();
		runner.move('down').should.be.ok();
		runner.move('down').should.be.ok();
		runner.move('right').should.be.ok();
		runner.move('right').should.be.ok();
		runner.move('up').should.be.ok();
		runner.move('up').should.be.ok();
		runner.move('down').should.be.ok();
		runner.move('down').should.be.ok();
		runner.move('right').should.be.ok();
		runner.move('right').should.be.ok();
		done();
	});
});

