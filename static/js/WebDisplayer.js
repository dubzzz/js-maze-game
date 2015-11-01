(function(exports) {

var WebDisplayer = function(screen_canvas) {
	var self = this;
	var screen_canvas_ = screen_canvas;

	var COLORS = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff"];
	var SIZE = 96;

	this.displayCell = function(ctx, x, y, cell, group_id) {
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
		};
		img.onload = function() {
			ctx.drawImage(img, start_x, start_y);
		};
	}

	this.display = function(map, mapping_button_to_id, mapping_door_to_id) {
		screen_canvas_.width = SIZE * map[0].length;
		screen_canvas_.height = SIZE * map.length;

		var ctx = screen_canvas_.getContext("2d");

		for (var y = 0 ; y < map.length ; ++y) {
			for (var x = 0 ; x < map[y].length ; ++x) {
				this.displayCell(ctx, x, y, map[y][x],
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
