'use strict';

var MAX_DOORS = require('../../src/MapReader.js').MAX_DOORS;
var MapReader = require('../../src/MapReader.js').MapReader;

describe('Read maps', function() {
	it('Check MAX_DOORS', function(done) {
		MAX_DOORS.should.be.equal(10);
		done();
	});
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
	it('Retrive doors mapping (reverse)', function(done) {
		var raw = [
			[ 0,98,-4,-1],
			[99,97,97, 1],
			[ 2,-2, 4, 4],
			[14,12, 0, 0]];
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
	it('Retrive doors mapping', function(done) {
		var raw = [
			[ 0,98,-4,-1],
			[99,97,97, 1],
			[ 2,-2, 4, 4],
			[14,12, 0, 0]];
		var reader = new MapReader(raw);
		var doors = reader.getMappingDoorId();
		
		Object.keys(doors).length.should.be.equal(4);
		doors.should.have.keys(7,8,10,11);
		
		doors[7].should.be.equal(1);
		doors[8].should.be.equal(2);
		doors[10].should.be.equal(4);
		doors[11].should.be.equal(4);
		
		done();
	});
	it('Retrive reversed doors mapping (reverse)', function(done) {
		var raw = [
			[ 0,98,-4,-1],
			[99,97,97, 1],
			[ 2,-2, 4, 4],
			[14,12,12, 0]];
		var reader = new MapReader(raw);
		var reversed = reader.getMappingIdReversed();
		
		Object.keys(reversed).length.should.be.equal(3);
		reversed.should.have.keys(2,4);
		
		reversed[2].should.have.length(2);
		reversed[4].should.have.length(1);
		
		reversed[2].should.containDeep([13,14]);
		reversed[4].should.containDeep([12]); // order depends on the implementation
		
		done();
	});
	it('Retrive reversed doors mapping', function(done) {
		var raw = [
			[ 0,98,-4,-1],
			[99,97,97, 1],
			[ 2,-2, 4, 4],
			[14,12, 0, 0]];
		var reader = new MapReader(raw);
		var reversed = reader.getMappingReversedId();
		
		Object.keys(reversed).length.should.be.equal(3);
		reversed.should.have.keys(12,13,14);
		
		reversed[12].should.be.equal(4);
		reversed[13].should.be.equal(2);
		reversed[14].should.be.equal(2);
		
		done();
	});
	it('Retrive buttons mapping', function(done) {
		var raw = [
			[ 0,98,-4,-1],
			[99,97,97, 1],
			[ 2,-2, 4, 4],
			[14,12, 0, 0]];
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

