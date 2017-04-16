var source, fft;

function setup() {
  source = new p5.AudioIn();
  source.start();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(source);
}

function start() {
	// module aliases
	var Engine = Matter.Engine,
		Render = Matter.Render,
		World = Matter.World,
		Bodies = Matter.Bodies;
		Body = Matter.Body;
		Composites = Matter.Composites;
		Events = Matter.Events;
		Runner = Matter.Runner;

	// create an engine
	var engine = Engine.create();

	// create a renderer
	var render = Render.create({
		element: document.body,
		engine: engine,
		options: {
			width: 1280,
			height: 900,
			wireframes: false
		}
	});

	var group = Body.nextGroup(true);
	
	var waves = Composites.stack(20, 300, 41, 1, 2, 2, function(x, y) {
		return Bodies.rectangle(x, y, 20, 10, {collisionFilter: {group: group}});
	});
	
	var door = Bodies.rectangle(20+20*40, 240, 24, 60);
	door.isSensor = true;
	door.isStatic = true;
	
	Composites.chain(waves, 0.5, 0, -0.5, 0, { stiffness: 0.9 });
	
	var ball = Bodies.circle(400, 20, 20, {
		render: {
			strokeStyle: "#ff0000",
			fillStyle: "#bb0000",
			lineWidth: 11
		}
	});
	
	var block = Bodies.rectangle(440, 455, 1000, 300, {
		isStatic: true
	});
	
	ball.friction = 0;
	Matter.Body.setMass(ball, 0.5);

	// add all of the bodies to the world
	World.add(engine.world, [waves, ball, block]);

	// run the engine
	Engine.run(engine);

	// run the renderer
	Render.run(render);
	/*
	Events.on(engine, "collisionStart", function(event) {
		alert("woo");
	});
	*/
	
	waves.bodies[0].isStatic = true;
	waves.bodies[40].isStatic = true;
	var deriv = [];
	
	setInterval(function(){
		var spectrum = fft.analyze();
		
		for (var a = 1; a < waves.bodies.length-1; a++) {
			let val = spectrum[4+a]/4;
			Matter.Body.setVelocity(waves.bodies[a], Matter.Vector.create(0,deriv[a] - val));
			deriv[a] = val;
		}
	}, 10);
}