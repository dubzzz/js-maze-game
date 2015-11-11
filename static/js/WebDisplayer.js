(function(exports) {

var imgs = new Array();
{
	var img = new Image();
	img.src = "/static/img/start.png";
	imgs.push(img);
}
{
	var img = new Image();
	img.src = "/static/img/end.png";
	imgs.push(img);
}
{
	var img = new Image();
	img.src = "/static/img/path.png";
	imgs.push(img);
}
{
	var img = new Image();
	img.src = "/static/img/wall.png";
	imgs.push(img);
}
{
	var img = new Image();
	img.src = "/static/img/button.png";
	imgs.push(img);
}
{
	var img = new Image();
	img.src = "/static/img/door.png";
	imgs.push(img);
}
{
	var img = new Image();
	img.src = "/static/img/reversed.png";
	imgs.push(img);
}
{
	var img = new Image();
	img.src = "/static/img/hero.png";
	imgs.push(img);
}

var WebDisplayer = function(screen_canvas, info_canvas) {
	var self = this;
	var screen_canvas_ = screen_canvas;
	var info_canvas_ = info_canvas;
	var info_canvas_sub_ = undefined;

	var COLORS = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff"];
	var SIZE = 96;
	var INFO_SIZE = 96;
	var LIFE_SIZE = 2 * INFO_SIZE;
	
	var drawDoorStatus = function(canvas, color, status) {
		canvas.setAttribute('data-door-current', status);
		var duration = parseInt(canvas.getAttribute('data-door-duration'));

		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, INFO_SIZE, INFO_SIZE);
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 5;
		ctx.arc(INFO_SIZE/2, INFO_SIZE/2, INFO_SIZE/2 -5, -0.5*Math.PI, 2*Math.PI*status/duration -0.5*Math.PI);
		ctx.stroke();
		ctx.font = '20pt Calibri';
      	ctx.textAlign = 'center';
      	ctx.fillStyle = color;
      	ctx.fillText(status == 0 ? ("[ " + duration + " ]") : status, INFO_SIZE/2, INFO_SIZE/2 +10);
	};

	this.initDoorsStatus = function(doors_duration) {
		var statuses_canvas = info_canvas_.getElementsByClassName("gamerunner-statuses")[0];
		while (statuses_canvas.childNodes.length > 0) {
			statuses_canvas.removeChildren(statuses_canvas.childNodes[0]);
		}
		info_canvas_sub_ = {};
		var keys = Object.keys(doors_duration);
		for (var i = 0 ; i < keys.length ; ++i) {
			var key = keys[i];
			var canvas = document.createElement("canvas");
			canvas.setAttribute('data-door-id', key);
			canvas.setAttribute('data-door-duration', doors_duration[key]);
			canvas.width = INFO_SIZE;
			canvas.height = INFO_SIZE;
			drawDoorStatus(canvas, COLORS[key -1], 0);
			statuses_canvas.appendChild(canvas);
			info_canvas_sub_[key] = canvas;
		}
	};

	this.refreshDoorStatus = function(group_id, status) {
		drawDoorStatus(info_canvas_sub_[group_id], COLORS[group_id -1], status);
	};

	this.refreshLife = function(remaining_lifes, total_lifes) {
		if (total_lifes < 0) {
			return;
		}
		var canvas = info_canvas_.getElementsByClassName("gamerunner-life")[0];
		canvas.width = LIFE_SIZE;
		canvas.height = LIFE_SIZE;
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, LIFE_SIZE, LIFE_SIZE);
		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 5;
		ctx.arc(LIFE_SIZE/2, LIFE_SIZE/2, LIFE_SIZE/2 -5, -0.5*Math.PI, 2*Math.PI*remaining_lifes/total_lifes -0.5*Math.PI);
		ctx.stroke();
		ctx.font = '40pt Calibri';
      	ctx.textAlign = 'center';
      	ctx.fillStyle = "#000000";
      	ctx.fillText(remaining_lifes, LIFE_SIZE/2, LIFE_SIZE/2 +20);
	};
	
	this.displayCharacter = function(x, y) {
		var ctx = screen_canvas_.getContext("2d");
		var start_x = SIZE * x;
		var start_y = SIZE * y;
		
		var img = new Image();
		img.src = "/static/img/hero.png";
		ctx.drawImage(img, start_x, start_y);
	};

	this.displayCell = function(x, y, cell, group_id) {
		var ctx = screen_canvas_.getContext("2d");
		var start_x = SIZE * x;
		var start_y = SIZE * y;
		var img = new Image();

		switch (cell) {
			case 's':
				img.src = "/static/img/start.png";
				break;
			case 'e':
				img.src = "/static/img/end.png";
				break;
			case ' ':
				img.src = "/static/img/path.png";
				break;
			case '#':
				img.src = "/static/img/wall.png";
				break;
			case 'b':
				ctx.fillStyle = COLORS[group_id -1];
				ctx.fillRect(start_x, start_y, SIZE, SIZE);
				img.src = "/static/img/button.png";
				break;
			case 'd':
				ctx.fillStyle = COLORS[group_id -1];
				ctx.fillRect(start_x, start_y, SIZE, SIZE);
				img.src = "/static/img/door.png";
				break;
			case 'r':
				ctx.fillStyle = COLORS[group_id -1];
				ctx.fillRect(start_x, start_y, SIZE, SIZE);
				img.src = "/static/img/reversed.png";
				break;
		};
		ctx.drawImage(img, start_x, start_y);
	}

	this.display = function(map, mapping_button_to_id, mapping_door_to_id, mapping_reversed_to_id) {
		screen_canvas_.width = SIZE * map[0].length;
		screen_canvas_.height = SIZE * map.length;

		for (var y = 0 ; y < map.length ; ++y) {
			for (var x = 0 ; x < map[y].length ; ++x) {
				this.displayCell(x, y, map[y][x],
						(mapping_button_to_id[y] !== undefined && mapping_button_to_id[y][x] !== undefined)
						? mapping_button_to_id[y][x]
						: (
							(mapping_door_to_id[y] !== undefined && mapping_door_to_id[y][x] !== undefined)
							? mapping_door_to_id[y][x]
							: (
								(mapping_reversed_to_id[y] !== undefined && mapping_reversed_to_id[y][x] !== undefined)
								? mapping_reversed_to_id[y][x]
								: undefined)));
			}
		}
	};
};

exports.WebDisplayer = WebDisplayer;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));
