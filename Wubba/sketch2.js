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
	
	setInterval( function(){
		canvas.clearRect(0, 0, canvas_thing.width, canvas_thing.height);
		source = fft.analyze();
		
		//draw really small rectangles along the canvas
		for (var a = 0; a < source.length; a++) {
			canvas.fillRect(2*a, 600-source[a], 2, source[a]);
		}
	}, 30);
}