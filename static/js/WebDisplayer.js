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
      	ctx.fillText(status, INFO_SIZE/2, INFO_SIZE/2 +10);
	};

	this.initDoorsStatus = function(doors_duration) {
		while (info_canvas_.childNodes.length > 0) {
			info_canvas_.removeChildren(info_canvas_.childNodes[0]);
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
			info_canvas_.appendChild(canvas);
			info_canvas_sub_[key] = canvas;
		}
	};

	this.refreshDoorStatus = function(group_id, status) {
		drawDoorStatus(info_canvas_sub_[group_id], COLORS[group_id -1], status);
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

	this.display = function(map, mapping_button_to_id, mapping_door_to_id) {
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
							: undefined));
			}
		}
	};
};

exports.WebDisplayer = WebDisplayer;
}(typeof exports === 'undefined'
		? (this['MazeGame'] === undefined ? this['MazeGame']={} : this['MazeGame'])
		: exports));
