'use strict';

var MapReader = require('../../src/MapReader.js').MapReader;

describe('Read maps', function() {
	it('Measure of X and Y', function(done) {
		var raw = [
			[98, 0, 0],
			[ 0, 0,99]];
		var reader = new MapReader(raw);
		reader.getSizeX().should.be.equal(3);
		reader.getSizeY().should.be.equal(2);
		done();
	});
	it('Retrieve start and end', function(done) {
		var raw = [
			[ 0,98, 0],
			[99, 0, 0]];
		var reader = new MapReader(raw);
		reader.getStart().should.be.equal(1);
		reader.getEnd().should.be.equal(3);
		done();
	});
	it('Read map', function(done) {
		var raw = [
			[ 0,98, 0,-1],
			[99,97,97, 1]];
		var reader = new MapReader(raw);
		reader.getMap().should.be.eql([
			" s b",
			"e##d"]);
		done();
	});
	it('Retrive doors mapping', function(done) {
		var raw = [
			[ 0,98,-4,-1],
			[99,97,97, 1],
			[ 2,-2, 4, 4]];
		var reader = new MapReader(raw);
		var doors = reader.getMappingIdDoors();
		
		Object.keys(doors).length.should.be.equal(3);
		doors.should.have.keys(1,2,4);
		
		doors[1].should.have.length(1);
		doors[2].should.have.length(1);
		doors[4].should.have.length(2);
		
		doors[1].should.containDeep([7]);
		doors[2].should.containDeep([8]);
		doors[4].should.containDeep([10,11]); // order depends on the implementation
		
		done();
	});
	it('Retrive buttons mapping', function(done) {
		var raw = [
			[ 0,98,-4,-1],
			[99,97,97, 1],
			[ 2,-2, 4, 4]];
		var reader = new MapReader(raw);
		var buttons = reader.getMappingButtonId();
		
		Object.keys(buttons).length.should.be.equal(3);
		buttons.should.have.keys(2,3,9);
		
		buttons[2].should.be.equal(4);
		buttons[3].should.be.equal(1);
		buttons[9].should.be.equal(2);
		
		done();
	});
});

