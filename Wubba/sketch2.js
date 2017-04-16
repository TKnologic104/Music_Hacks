var source, fft;

function setup() {
  source = new p5.AudioIn();
  source.start();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(source);
}

function init() {
	var canvas_thing = document.getElementById("canvo");
	var canvas = canvas_thing.getContext("2d");
	canvas.fillStyle = "#ff0000";
	var highest_point = 0;
	var highest_peak = 0;
	
	setInterval( function(){
		canvas.clearRect(0, 0, canvas_thing.width, canvas_thing.height);
		source = fft.analyze();
		
		//Human singing range is between values 4 and 45
		
		//draw really small rectangles along the canvas
		for (var a = 4; a < 45; a++) {
			canvas.fillRect(2*a, 600-source[a], 2, source[a]);
			if (source[a] > highest_peak) {
				highest_peak = source[a];
				highest_point = a;
			}
		}
		canvas.fillText("Highest point at [" + highest_point + "], " + highest_peak, 10, 10);
	}, 30);
}