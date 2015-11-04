'use strict';

var DOOR_TIME = require('../../src/MazeSolver.js').DOOR_TIME;
var GameRunner = require('../../src/GameRunner.js').GameRunner;

var Displayer = function() {
	var self = this;
	this.map_ = undefined;
	this.doors_duration_ = undefined;
	this.doors_ = undefined;

	this.initDoorsStatus = function(doors_duration) {
		self.doors_ = {};
		self.doors_duration_ = {};
		var keys = Object.keys(doors_duration);
		for (var i = 0 ; i < keys.length ; ++i) {
			var key = keys[i];
			self.doors_[key] = 0;
			self.doors_duration_[key] = doors_duration[key];
		}
	};
	this.refreshDoorStatus = function(group_id, status) {
		self.doors_[group_id] = status;
	};
	this.displayCell = function(x, y, cell, group_id) {
		self.map_[y] = self.map_[y].substr(0, x) + cell + self.map_[y].substr(x+1);
	};
	this.displayCharacter = function(x, y) {
		self.map_[y] = self.map_[y].substr(0, x) + 'C' + self.map_[y].substr(x+1);
	};
	this.display = function(map, mapping_button_to_id, mapping_door_to_id) {
		self.map_ = map.slice();
	};
};
var displayer = new Displayer();

describe('Move on mazes', function() {
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
		runner.move('left').should.be.false;
		done();
	});

	/** Manage doors **/

	it('Open one door', function(done) {
		var raw = [[98,-1, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		done();
	});
	it('Max door time', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		done();
	});
	it('Max door time +1 (block cannot be closed)', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		done();
	});
	it('Too slow to reach the door', function(done) {
		var raw = [[98,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.false;
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
	
	/** Manage reversed doors **/

	it('Move on a reversed door', function(done) {
		var raw = [[98, 0,11,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		runner.move('right').should.be.true;
		done();
	});
	it('Activated reversed door is a wall', function(done) {
		var raw = [[98,-1,11,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right').should.be.true;
		runner.move('right').should.be.false;
		done();
	});
	
	/** Display **/

	it('Full refresh at start', function(done) {
		var raw = [[98, 0, 0,99]];
		var runner = new GameRunner(displayer, raw);
		displayer.map_.should.be.eql(["C  e"]);
		done();
	});
	it('Refresh previous cell on move', function(done) {
		var raw = [[98, 0, 0,99]];
		var runner = new GameRunner(displayer, raw);
		displayer.map_.should.be.eql(["C  e"]);
		runner.move('right');
		displayer.map_.should.be.eql(["sC e"]);
		runner.move('right');
		displayer.map_.should.be.eql(["s Ce"]);
		done();
	});
	it('Full refresh at restart', function(done) {
		var raw = [[98, 0, 0,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right');
		runner.move('right');
		runner.restart();
		displayer.map_.should.be.eql(["C  e"]);
		done();
	});
	it('Update doors when pushing button', function(done) {
		var raw = [[98, 0,-1, 1, 1,11,99]];
		var runner = new GameRunner(displayer, raw);
		displayer.map_.should.be.eql(["C bddre"]);
		runner.move('right');
		runner.move('right');
		displayer.map_.should.be.eql(["s Crrde"]);
		done();
	});
	it('Doors closed after restart', function(done) {
		var raw = [[98, 0,-1, 1, 1,11,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right');
		runner.move('right');
		runner.restart();
		displayer.map_.should.be.eql(["C bddre"]);
		done();
	});

	/** Doors status **/

	it('Full refresh at start', function(done) {
		var raw = [[98, 1, 5,99]];
		var runner = new GameRunner(displayer, raw);
		displayer.doors_.should.be.eql({1: 0, 5: 0});
		displayer.doors_duration_.should.be.eql({1: DOOR_TIME, 5: DOOR_TIME});
		done();
	});
	it('Button triggers a refresh of door\' status', function(done) {
		var raw = [[98,-5, 5,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right');
		displayer.doors_.should.be.eql({5: DOOR_TIME});
		done();
	});
	it('Door\' status decreases when moving away', function(done) {
		var raw = [[98,-5, 0, 0, 0, 0, 0, 0, 5,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right');
		displayer.doors_.should.be.eql({5: DOOR_TIME});
		runner.move('right');
		displayer.doors_.should.be.eql({5: DOOR_TIME -1});
		runner.move('right');
		displayer.doors_.should.be.eql({5: DOOR_TIME -2});
		done();
	});
	it('Door\' status decreases until 0', function(done) {
		var raw = [[98,-5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		runner.move('right');
		displayer.doors_.should.be.eql({5: 0});
		done();
	});
	it('Door\' status resetted when game is restarted', function(done) {
		var raw = [[98,-5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,99]];
		var runner = new GameRunner(displayer, raw);
		runner.move('right');
		runner.restart();
		displayer.doors_.should.be.eql({5: 0});
		done();
	});
});

