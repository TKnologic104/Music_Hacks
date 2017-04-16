var source, fft;

function setup() {
  source = new p5.AudioIn();
  source.start();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(source);
}

function level2() {
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
	
	// var door = Bodies.rectangle(20+20*40, 240, 24, 60);
	// door.isSensor = true;
	// door.isStatic = true;

	var collider = Bodies.rectangle(650, 400, 75, 75, {
        isSensor: true,
        isStatic: true,
        render: {
            strokeStyle: "ff0000",
            fillStyle: 'transparent',
            lineWidth: 9
        }
    });
	
	Composites.chain(waves, 0.5, 0, -0.5, 0, { stiffness: 0.9 });
	
	var ball = Bodies.circle(400, 20, 20, {
		render: {
			strokeStyle: "#00ff00",
			fillStyle: "transparent",
			lineWidth: 9
		}
	});
	
	//bottom block
	var block = Bodies.rectangle(440, 550, 650, 300, {
		isStatic: true
	});

	//top block
	var block = Bodies.rectangle(440, 300, 650, 300, {
		isStatic: true
	});
	
	ball.friction = 0;
	Matter.Body.setMass(ball, 0.1);

	// add all of the bodies to the world
	World.add(engine.world, [waves, ball, block]);

	//adds the collider "door" object
	World.add(engine.world, [
        collider,
        Bodies.rectangle(650, 400, 75, 75, { 
            isStatic: true,
            render: {
                fillStyle: 'transparent',
                lineWidth: 1
            }
        })
    ]);

	// run the engine
	Engine.run(engine);

	// run the renderer
	Render.run(render);
	/*
	Events.on(engine, "collisionStart", function(event) {
		alert("woo");
	});
	*/

	 Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;
        
        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];

            if (pair.bodyA === collider) {
                //pair.bodyB.render.strokeStyle = "ff0000";
                alert("WUBBA LUBBA DUB DUB");
            } else if (pair.bodyB === collider) {
                pair.bodyA.render.strokeStyle = "ff0000";
            }
        }
    });
	
	waves.bodies[0].isStatic = true;
	waves.bodies[40].isStatic = true;
	var deriv = [];
	
	setInterval(function(){
		var spectrum = fft.analyze();
		
		for (var a = 1; a < waves.bodies.length-1; a++) {
			let val = spectrum[2+a]/2;
			Matter.Body.setVelocity(waves.bodies[a], Matter.Vector.create(0,deriv[a] - val));
			deriv[a] = val;
		}
	}, 10);


	document.addEventListener('keydown', function(event) {
	    if(event.keyCode == 32) {
	        console.log("space was hit");
	        World.clear(engine.world);
	        //World.add(engine.world, [ball]);
	        location.reload();

		}
		if(event.keyCode == 39) {
	        console.log("right was hit");
	        window.location.href = "localhost:3000/index2.html";

		}
	});
}
