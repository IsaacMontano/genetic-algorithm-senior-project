const fromCM = 1/10;

//rgb being 0,1,2 for r, g, b. Swaps the colouring of the model to whatever is specified
function changeColour(Float32list, rgb){
	for(let c = 0; c < Float32list.length/6; c++){
		Float32list[(c * 6)+ 3 + rgb] = Float32list[(c * 6)+ 3] + Float32list[(c * 6)+ 4]+ Float32list[(c * 6)+ 5];
		if(rgb == 0){
			Float32list[(c * 6)+ 4] = 0;
			Float32list[(c * 6)+ 5] = 0;
		}else if(rgb == 1){
			Float32list[(c * 6)+ 3] = 0;
			Float32list[(c * 6)+ 5] = 0;
		}else if(rgb == 2){
			Float32list[(c * 6)+ 3] = 0;
			Float32list[(c * 6)+ 4] = 0;
		}
	}
}

class Plane {
	constructor(vertices, indices){
		let standardObject = createStandardObject(structuredClone(vertices), structuredClone(indices));
		//this.controller = createStandardObject(structuredClone(controllerVertices), structuredClone(controllerIndices));
		this.vertices = standardObject.vertices;
		this.indices = standardObject.indices;
		this.ID = standardObject.ID;
		this.VBO = standardObject.VBO;
		this.EBO = standardObject.EBO;
		this.position = standardObject.position;
		this.sliderSet = [];
		this.attributes = [];
		this.planestats = null;
		return(0);
	}

	checkClick(){
		//Flag to determine if any sliders were clicked and thus probably changed, meaning that we should refresh ourselves to new stats.
		let shouldUpdateSelf = false;
		for(let cS = 0; cS < this.sliderSet.length; cS += 1){
			if(MouseData.click == true){
				if(shouldUpdateSelf){
					this.sliderSet[cS].checkClick(MouseData.x, MouseData.y);
				}else{
					shouldUpdateSelf = this.sliderSet[cS].checkClick(MouseData.x, MouseData.y);
				}
			}
		}

		if(shouldUpdateSelf){
			this.refreshSelf();
		}
	}

	refreshStats(){
		permCLog("Unextended plane trying to refresh its visual stats.");
	}

	refreshSelf(){
		for(let cS = 0; cS < this.sliderSet.length; cS += 1){
			this.sliderSet[cS].updateSelf();
			this.attributes[cS] = this.sliderSet[cS].current;
		}
		this.refreshShape();
		if(this.planestats != undefined || this.planestats != null){
			this.refreshStats();
		}
		
		updateStandardObject(this);
	}

	draw(){
		for(let cS = 0; cS < this.sliderSet.length; cS += 1){
			this.sliderSet[cS].draw();
		}
		drawStandardObject(this);
		//this.controller.position[X_pos] = this.position[X_pos];
		//this.controller.position[Y_pos] = this.position[Y_pos];
		//this.controller.position[Z_pos] = this.position[Z_pos];
		//this.controller.position[W_pos] = this.position[W_pos];
		//this.controller.position[I_pos] = this.position[I_pos];
		//this.controller.position[J_pos] = this.position[J_pos];
		//this.controller.position[K_pos] = this.position[K_pos];
		//drawStandardObject(this.controller);
		
	}

	refreshShape(){
		permCLog("Un-extended plane class trying to refresh it's shape.");
	}
}


var controllerVertices = new Float32Array([
	//front upper slab
	-0.075, 0.075, 0.5,		0.2, 0.2, 0.2,			//0
	0.075, 0.075, 0.5,		0.2, 0.2, 0.2,			//1
	-0.075, 0.15, 0.4,		0.2, 0.2, 0.2,			//2
	0.075, 0.15, 0.4,			0.2, 0.2, 0.2,			//3

	//front lower slab (Below the surface of the plane)
	-0.075, -0.03, 0.35,		0.05, 0.05, 0.05,		//4
	0.075, -0.03, 0.35,		0.05, 0.05, 0.05,		//5

	//back lower black bits, the '74' is lazy fix for layer fighting...
	-0.074, 0.075, 0.10,	0.15, 0.15, 0.15,		//6
	0.074, 0.075, 0.10,		0.15, 0.15, 0.15,		//7
	-0.074, -0.03, 0.10,	0.05, 0.05, 0.05,		//8
	0.074, -0.03, 0.10,		0.05, 0.05, 0.05,		//9

	//top '''transparent''' thing
	-0.075, 0.15, 0.4,		0.65, 0.65, 0.65,		//10
	0.075, 0.15, 0.4,			0.65, 0.65, 0.65,		//11
	-0.074, 0.0, 0.4,		0.5, 0.5, 0.5,			//12
	0.074, 0.0, 0.4,		0.5, 0.5, 0.5,			//13

	-0.074, 0.125, 0.101,	0.6, 0.6, 0.6,			//14
	0.074, 0.125, 0.101,	0.6, 0.6, 0.6,			//15
	-0.074, 0.0, 0.101,		0.5, 0.5, 0.5,			//16
	0.074, 0.0, 0.101,		0.5, 0.5, 0.5,			//17
]);

var controllerIndices = new Int16Array([
	//front piece
	0,1,2, 1,2,3,
	0,1,4, 1,4,5,
	0,2,4, 1,3,5,

	//bottom back connecting to front
	6,8,0, 8,0,4,
	7,9,1, 9,1,5,
	8,9,5, 5,4,8,

	//back seal on the bottom
	6,7,8, 7,8,9,

	//top grey thing
	10,11,14, 11,14,15,
	14,15,16, 15,16,17,
	10,12,14, 12,14,16,
	11,13,15, 13,15,17,
]);


var invaderVertices = new Float32Array([
	//back left tail piece
	-0.5,0,-1,						0.5, 0.0, 0.0,			//0
	-0.4,0,-1,						0.6, 0.0, 0.0,			//1
	-0.4,0,-0.6,					0.6, 0.0, 0.0,			//2
	-0.5,0,-0.6,					0.5, 0.0, 0.0,			//3
	//upper fin part
	-0.5,0.2,-1,					0.4, 0.0, 0.0,			//4
	-0.5,0.2,-0.8,					0.4, 0.0, 0.0,			//5
	//front point within the fin
	-0.4,0,-0.4,					0.6, 0.0, 0.0,			//6				used as a corner for a bigger plane
	//flap part
	-0.4,0.1,-1,					0.7, 0.0, 0.0,			//7
	-0.25,0.1,-1,					0.7, 0.0, 0.0,			//8
	-0.25,0,-0.8,				0.6, 0.0, 0.0,				//9				
	-0.4,0,-0.8,					0.6, 0.0, 0.0,			//10       used as a corner for a bigger plane

	//back right tail piece
	0.5,0,-1,						0.5, 0.0, 0.0,			//11
	0.4,0,-1,					0.6, 0.0, 0.0,			//12
	0.4,0,-0.6,					0.6, 0.0, 0.0,			//13
	0.5,0,-0.6,						0.5, 0.0, 0.0,		//14
	//upper fin part
	0.5,0.2,-1,					0.4, 0.0, 0.0,			//15
	0.5,0.2,-0.8,				0.4, 0.0, 0.0,			//16
	//front point within the fin
	0.4,0,-0.4,					0.6, 0.0, 0.0,			//17			used as a corner for a bigger plane
	//flap part
	0.4,0.1,-1,					0.7, 0.0, 0.0,				//18
	0.25,0.1,-1,				0.7, 0.0, 0.0,				//19
	0.25,0,-0.8,				0.6, 0.0, 0.0,			//20
	0.4,0,-0.8,					0.6, 0.0, 0.0,				//21       used as a corner for a bigger plane

	//big back plane addition
	-0.25,0,-1,				0.6, 0.0, 0.0,				//22
	0.25,0,-1,				0.6, 0.0, 0.0,				//23

	//front point
	0,0,0.4,				0.5, 0.0, 0.0,				//24


	//underside stuff
	//forward point
	0,-0.1,0.45,				0.4, 0.0, 0.0,				//25
	//back bottom
	0,-0.225,-1,				0.35, 0.0, 0.0,				//26
	//back top
	0,0.01,-1,							0.4, 0.0, 0.0,				//27
]);


var invaderIndices = new Int16Array([
	//back left tail piece
	0,1,2, 0,2,3, 0,4,5, 0,3,5, 2,3,6,  7,8,9, 7,9,10,
	//back right tial piece
	11,12,13, 11,13,14, 11,15,16, 11,14,16, 13,14,17,  18,19,20, 18,20,21,
	//the bigger flat plane
	6,10,17, 10,21,17,
	//back flat plane
	22,23,20, 22,20,9,
	//front point
	17,24,6,
	//underbelly
	24,25,26, 24,26,27
]);

var thickInvaderVertices = new Float32Array([
	//back left outer wing segment
	-0.50,0.05,-1.00,		0.6, 0.0, 0.0,			//0
	-0.40,0.05,-1.00,		0.6, 0.0, 0.0,			//1
	-0.50,0.05,-0.60,		0.6, 0.0, 0.0,			//2
	-0.40,0.05,-0.80,		0.6, 0.0, 0.0,			//3

	-0.40,0.00,-1.00,		0.4, 0.0, 0.0,			//4
	-0.40,0.00,-0.82,		0.4, 0.0, 0.0,			//5

	-0.5,0.00,-1.00,		0.4, 0.0, 0.0,			//6
	-0.5,0.00,-0.60,		0.4, 0.0, 0.0,			//7
	-0.55,0.05,-1.00,		0.5, 0.0, 0.0,			//8
	-0.55,0.05,-0.60,		0.5, 0.0, 0.0,			//9

	//left winglet top, is 'thin'
	-0.525,0.25,-1.00,		0.4, 0.0, 0.0,			//10
	-0.525,0.25,-0.60,		0.4, 0.0, 0.0,			//11
	//front of winglet
	-0.5,0.05,-0.40,		0.7, 0.0, 0.0,			//12

	//back left control flap
	-0.25,0.05,-0.80,		0.6, 0.0, 0.0,			//13
	-0.25,0.00,-0.82,		0.4, 0.0, 0.0,			//14

	-0.395,0.13,-1.00,		0.6, 0.0, 0.0,			//15
	-0.255,0.13,-1.00,		0.6, 0.0, 0.0,			//16

	//back inner left wing segment
	-0.25,0.05,-1.00,		0.6, 0.0, 0.0,			//17
	-0.05,0.05,-1.00,		0.6, 0.0, 0.0,			//18
	-0.25,0.00,-1.00,		0.4, 0.0, 0.0,			//19
	-0.10,0.00,-1.00,		0.4, 0.0, 0.0,			//20

	//front left point of the plane
	-0.05,0.05,0.40,		0.7, 0.0, 0.0,			//21
	-0.10,0.00,0.45,		0.5, 0.0, 0.0,			//22


	
	//back right outer wing segment
	0.50,0.05,-1.00,		0.6, 0.0, 0.0,			//23
	0.40,0.05,-1.00,		0.6, 0.0, 0.0,			//24
	0.50,0.05,-0.60,		0.6, 0.0, 0.0,			//25
	0.40,0.05,-0.80,		0.6, 0.0, 0.0,			//26

	0.40,0.00,-1.00,		0.4, 0.0, 0.0,			//27
	0.40,0.00,-0.82,		0.4, 0.0, 0.0,			//28

	0.5,0.00,-1.00,			0.4, 0.0, 0.0,			//29
	0.5,0.00,-0.60,			0.4, 0.0, 0.0,			//30
	0.55,0.05,-1.00,		0.5, 0.0, 0.0,			//31
	0.55,0.05,-0.60,		0.5, 0.0, 0.0,			//32

	//right winglet top, is 'thin'
	0.525,0.25,-1.00,		0.4, 0.0, 0.0,			//33
	0.525,0.25,-0.60,		0.4, 0.0, 0.0,			//34
	//front of winglet
	0.5,0.05,-0.40,			0.7, 0.0, 0.0,			//35

	//back right control flap
	0.25,0.05,-0.80,		0.6, 0.0, 0.0,			//36
	0.25,0.00,-0.82,		0.4, 0.0, 0.0,			//37

	0.395,0.13,-1.00,		0.6, 0.0, 0.0,			//38
	0.255,0.13,-1.00,		0.6, 0.0, 0.0,			//39

	//back inner right wing segment
	0.25,0.05,-1.00,		0.6, 0.0, 0.0,			//40
	0.05,0.05,-1.00,		0.6, 0.0, 0.0,			//41
	0.25,0.00,-1.00,		0.4, 0.0, 0.0,			//42
	0.10,0.00,-1.00,		0.4, 0.0, 0.0,			//43

	//front right point of the plane
	0.05,0.05,0.40,			0.7, 0.0, 0.0,			//44
	0.10,0.00,0.45,			0.5, 0.0, 0.0,			//45


	//Keel Stuffs
	//back
	0.00,-0.35,-1.00,		0.3, 0.0, 0.0,			//46
	0.00,-0.25,-1.00,		0.4, 0.0, 0.0,			//47
	//front
	0.00,-0.20,0.65,		0.4, 0.0, 0.0,			//48
	0.00,-0.10,0.55,		0.5, 0.0, 0.0,			//49
]);

var thickInvaderIndices = new Int16Array([
	//back left flat wing segment
	//top
	0,1,3, 0,2,3,
	//inner side by the flap cutout
	1,4,5, 1,3,5,
	//bottom flat piece
	4,5,7, 7,6,4,
	//outer base piece to add thickness to winglet
	6,7,8, 8,9,7,
	//winglet top connection
	10,11,0, 0,2,11, 10,11,8, 8,9,11,
	//sealing the back of this part
	10,8,0, 8,6,0, 0,1,4, 4,6,0,
	//connecting the front of the winglet
	12,11,9, 12,11,2, 12,9,7,
	//little misc piece of top by winglet
	3,12,2,
	//back left control flap
	3,15,16, 16,13,3, 15,16,5, 15,5,3, 16,14,5, 16,14,13,
	//sealing the back and flap side of the inner left wing segment
	17,18,19, 18,19,20, 17,19,13, 19,13,14,
	//the rest of the top
	17,18,21, 21,13,17, 12,3,13, 12,13,21, 21,22,12, 22,7,12,
	//sealing the left bottom
	14,22,7, 14,5,7, 20,19,14, 20,14,22,

	//right side of that all, copy pasted from index changer.
	23, 24, 26, 23, 25, 26, 24, 27, 28, 24, 26, 28, 27, 28, 30, 30, 29, 27, 29, 30, 31, 31, 32, 30, 33, 34, 23, 23, 25, 34, 33, 34, 31, 31, 32, 34, 33, 31, 23, 31, 29, 23, 23, 24, 27, 27, 29, 23, 35, 34, 32, 35, 34, 25, 35, 32, 30, 26, 35, 25, 26, 38, 39, 39, 36, 26, 38, 39, 28, 38, 28, 26, 39, 37, 28, 39, 37, 36, 40, 41, 42, 41, 42, 43, 40, 42, 36, 42, 36, 37, 40, 41, 44, 44, 36, 40, 35, 26, 36, 35,36,44, 44, 45, 35, 45, 30, 35, 37, 45, 30, 37, 28, 30, 43, 42, 37, 43, 37, 45,

	//keel connections
	//back seal with right
	46,41,43, 46,47,41, 
	//back seal with left
	46,20,18, 46,47,18,

	//front connections
	48,49,45, 45,49,44, 48,49,22, 22,49,21,
	
	//left side seals
	48,46,20, 20,22,48, 49,47,18, 18,49,21,

	//right side seals
	48,46,43, 43,45,48, 49,47,41, 41,49,44,
]);
class Invader extends Plane{

	constructor(planestats){
		
		super(thickInvaderVertices, thickInvaderIndices);
		this.name = "Invader";
		this.position[Z_pos] = -2.2;
		this.position[Y_pos] = -0.85;
		this.position[X_pos] = -0.1;
		this.planestats = planestats;

		this.attributes.push(15);
		this.sliderSet.push(new slider(15/30,20/30,10,20,1,15,"Wingspan", "cm"));

		this.attributes.push(15);
		this.sliderSet.push(new slider(15/30,25/30,13,17,1,15,"Length", "cm"));

		this.attributes.push(25);
		this.sliderSet.push(new slider(20/30,20/30,15,30,1,25,"Keel", "mm"));

		this.attributes.push(90);
		this.sliderSet.push(new slider(20/30,25/30,85,95,1,90,"Front Angle", "*"));
	}
	

	refreshShape(){
		dclog("Refresh shape not setup for invader.");
	}

	refreshStats(){
		//equation of suffering, do not the question...
		//It is a linear regression result thingy idk, I did not set up the mafs.
		var speed = 4.903125 + 
		(0.09625		*	this.attributes[0])+
		(0.234375		*	this.attributes[1])+
		(0.00083333333	*	this.attributes[2])+
		(-0.07625		*	this.attributes[3]);
		this.planestats.speed = Math.round(speed * 100)/100;

		var glide = 7.609375 + 
		(0.09625		*	this.attributes[0])+
		(0.190625		*	this.attributes[1])+
		(-0.0708333333	*	this.attributes[2])+
		(-0.07625		*	this.attributes[3]);
		this.planestats.glide = Math.round(glide * 100)/100;

		var agility = 17.334375 + 
		(-0.09875		*	this.attributes[0])+
		(-0.196875		*	this.attributes[1])+
		(-0.0608333333	*	this.attributes[2])+
		(-0.08875		*	this.attributes[3]);
		this.planestats.agility = Math.round(agility * 100)/100;


		this.planestats.updateSelf()
	}
	


	
	setWingspan(newSpan){
		for(let c = 0; c < this.vertices.length/6; c++){
			//if statement to exclude the inner points from scaling
			//if((thickInvaderVertices[c * 6] * thickInvaderVertices[c * 6]) > 0.011){
				this.vertices[c * 6] = thickInvaderVertices[c * 6] * newSpan;
			//}
			
		}
		this.refreshSelf();
	}
	
}

//copies from the invader for the main segment
var hammerheadVertices = new Float32Array([
	//back left outer wing segment
	-0.50,0.05,-1.00,		0.6, 0.0, 0.0,			//0
	-0.40,0.05,-1.00,		0.6, 0.0, 0.0,			//1
	-0.50,0.05,-0.60,		0.6, 0.0, 0.0,			//2
	-0.40,0.05,-0.80,		0.6, 0.0, 0.0,			//3

	-0.40,0.00,-1.00,		0.4, 0.0, 0.0,			//4
	-0.40,0.00,-0.82,		0.4, 0.0, 0.0,			//5

	-0.5,0.00,-1.00,		0.4, 0.0, 0.0,			//6
	-0.5,0.00,-0.60,		0.4, 0.0, 0.0,			//7
	-0.55,0.05,-1.00,		0.5, 0.0, 0.0,			//8
	-0.55,0.05,-0.60,		0.5, 0.0, 0.0,			//9

	//left winglet top, is 'thin'
	-0.525,0.20,-1.00,		0.4, 0.0, 0.0,			//10
	-0.525,0.20,-0.60,		0.4, 0.0, 0.0,			//11
	//front of winglet
	-0.5,0.05,-0.50,		0.7, 0.0, 0.0,			//12

	//back left control flap
	-0.25,0.05,-0.80,		0.6, 0.0, 0.0,			//13
	-0.25,0.00,-0.82,		0.4, 0.0, 0.0,			//14

	-0.395,0.13,-1.00,		0.6, 0.0, 0.0,			//15
	-0.255,0.13,-1.00,		0.6, 0.0, 0.0,			//16

	//back inner left wing segment
	-0.25,0.05,-1.00,		0.6, 0.0, 0.0,			//17
	-0.05,0.05,-1.00,		0.6, 0.0, 0.0,			//18
	-0.25,0.00,-1.00,		0.4, 0.0, 0.0,			//19
	-0.10,0.00,-1.00,		0.4, 0.0, 0.0,			//20

	//front left point of the plane
	-0.05,0.05,0.00,		0.7, 0.0, 0.0,			//21
	-0.10,0.00,0.05,		0.5, 0.0, 0.0,			//22


	
	//back right outer wing segment
	0.50,0.05,-1.00,		0.6, 0.0, 0.0,			//23
	0.40,0.05,-1.00,		0.6, 0.0, 0.0,			//24
	0.50,0.05,-0.60,		0.6, 0.0, 0.0,			//25
	0.40,0.05,-0.80,		0.6, 0.0, 0.0,			//26

	0.40,0.00,-1.00,		0.4, 0.0, 0.0,			//27
	0.40,0.00,-0.82,		0.4, 0.0, 0.0,			//28

	0.5,0.00,-1.00,			0.4, 0.0, 0.0,			//29
	0.5,0.00,-0.60,			0.4, 0.0, 0.0,			//30
	0.55,0.05,-1.00,		0.5, 0.0, 0.0,			//31
	0.55,0.05,-0.60,		0.5, 0.0, 0.0,			//32

	//right winglet top, is 'thin'
	0.525,0.20,-1.00,		0.4, 0.0, 0.0,			//33
	0.525,0.20,-0.60,		0.4, 0.0, 0.0,			//34
	//front of winglet
	0.5,0.05,-0.50,			0.7, 0.0, 0.0,			//35

	//back right control flap
	0.25,0.05,-0.80,		0.6, 0.0, 0.0,			//36
	0.25,0.00,-0.82,		0.4, 0.0, 0.0,			//37

	0.395,0.13,-1.00,		0.6, 0.0, 0.0,			//38
	0.255,0.13,-1.00,		0.6, 0.0, 0.0,			//39

	//back inner right wing segment
	0.25,0.05,-1.00,		0.6, 0.0, 0.0,			//40
	0.05,0.05,-1.00,		0.6, 0.0, 0.0,			//41
	0.25,0.00,-1.00,		0.4, 0.0, 0.0,			//42
	0.10,0.00,-1.00,		0.4, 0.0, 0.0,			//43

	//front right point of the plane
	0.05,0.05,0.00,			0.7, 0.0, 0.0,			//44
	0.10,0.00,0.05,			0.5, 0.0, 0.0,			//45


	//Keel Stuffs
	//back
	0.00,-0.20,-1.00,		0.3, 0.0, 0.0,			//46
	0.00,-0.10,-1.00,		0.4, 0.0, 0.0,			//47
	//front
	0.00,-0.15,0.15,		0.4, 0.0, 0.0,			//48
	0.00,-0.05,0.10,		0.5, 0.0, 0.0,			//49


	
	///front piece///

	//left outer piece, has the two rear pieces close together for the upright fin
	-0.225,0.05,0.65,		0.6, 0.0, 0.0,			//50
	-0.40,0.05,0.50,		0.5, 0.0, 0.0,			//51
	-0.25,0.05,0.50,		0.6, 0.0, 0.0,			//52
	-0.20,0.05,0.50,		0.5, 0.0, 0.0,			//53

	-0.225,0.20,0.50,		0.4, 0.0, 0.0,			//54

	//right outer piece, has the two rear pieces close together for the upright fin
	0.225,0.05,0.65,		0.6, 0.0, 0.0,			//55
	0.40,0.05,0.50,			0.5, 0.0, 0.0,			//56
	0.25,0.05,0.50,			0.6, 0.0, 0.0,			//57
	0.20,0.05,0.50,			0.5, 0.0, 0.0,			//58

	0.225,0.20,0.50,		0.4, 0.0, 0.0,			//59

	//middle points to get that sweep
	0.00,0.05,0.725,			0.7, 0.0, 0.0,			//60
	0.00,0.05,0.575,			0.6, 0.0, 0.0,			//61
]);



var hammerheadIndices = new Int16Array([
//back left flat wing segment
	//top
	0,1,3, 0,2,3,
	//inner side by the flap cutout
	1,4,5, 1,3,5,
	//bottom flat piece
	4,5,7, 7,6,4,
	//outer base piece to add thickness to winglet
	6,7,8, 8,9,7,
	//winglet top connection
	10,11,0, 0,2,11, 10,11,8, 8,9,11,
	//sealing the back of this part
	10,8,0, 8,6,0, 0,1,4, 4,6,0,
	//connecting the front of the winglet
	12,11,9, 12,11,2, 12,9,7,
	//little misc piece of top by winglet
	3,12,2,
	//back left control flap
	3,15,16, 16,13,3, 15,16,5, 15,5,3, 16,14,5, 16,14,13,
	//sealing the back and flap side of the inner left wing segment
	17,18,19, 18,19,20, 17,19,13, 19,13,14,
	//the rest of the top
	17,18,21, 21,13,17, 12,3,13, 12,13,21, 21,22,12, 22,7,12,
	//sealing the left bottom
	14,22,7, 14,5,7, 20,19,14, 20,14,22,

	//right side of that all, copy pasted from index changer.
	23, 24, 26, 23, 25, 26, 24, 27, 28, 24, 26, 28, 27, 28, 30, 30, 29, 27, 29, 30, 31, 31, 32, 30, 33, 34, 23, 23, 25, 34, 33, 34, 31, 31, 32, 34, 33, 31, 23, 31, 29, 23, 23, 24, 27, 27, 29, 23, 35, 34, 32, 35, 34, 25, 35, 32, 30, 26, 35, 25, 26, 38, 39, 39, 36, 26, 38, 39, 28, 38, 28, 26, 39, 37, 28, 39, 37, 36, 40, 41, 42, 41, 42, 43, 40, 42, 36, 42, 36, 37, 40, 41, 44, 44, 36, 40, 35, 26, 36, 35,36,44, 44, 45, 35, 45, 30, 35, 37, 45, 30, 37, 28, 30, 43, 42, 37, 43, 37, 45,

	//keel connections
	//back seal with right
	46,41,43, 46,47,41, 
	//back seal with left
	46,20,18, 46,47,18,

	//front connections
	48,49,45, 45,49,44, 48,49,22, 22,49,21,
	
	//left side seals
	48,46,20, 20,22,48, 49,47,18, 18,49,21,

	//right side seals
	48,46,43, 43,45,48, 49,47,41, 41,49,44,

	//left front piece
	50,51,52, 52,53,54, 54,50,53, 54,50,52,
	//left front piece
	55,56,57, 57,58,59, 59,55,58, 59,55,57,

	//connecting them together
	58,55,60, 58,60,61, 
	53,50,60, 53,60,61,
	//53,58,55, 53,55,50,
]);



class Hammerhead extends Plane{

	constructor(planestats){
		
		super(hammerheadVertices, hammerheadIndices);
		this.name = "Hammerhead";

		this.position[Z_pos] = -2.2;
		this.position[Y_pos] = -0.85;
		this.position[X_pos] = -0.1;
		this.planestats = planestats;

		this.attributes.push(9);
		this.sliderSet.push(new slider(10/30,20/30,8,10,1,8,"Front Span", "cm"));

		this.attributes.push(15);
		this.sliderSet.push(new slider(10/30,25/30,16,22,1,20,"Rear Span", "cm"));

		this.attributes.push(60);
		this.sliderSet.push(new slider(15/30,20/30,45,60,1,60,"Front Angle", "*"));

		this.attributes.push(4);
		this.sliderSet.push(new slider(17.5/30,22.5/30,3,5,1,4,"Middle Gap", "cm"));

		this.attributes.push(10);
		this.sliderSet.push(new slider(20/30,20/30,9,13,1,10,"Front Height", "mm"));

		this.attributes.push(13);
		this.sliderSet.push(new slider(20/30,25/30,11,15,1,12,"Rear Height", "mm"));

		this.attributes.push(10);
		this.sliderSet.push(new slider(25/30,20/30,2,3,1,3,"Front Width", "cm"));

		this.attributes.push(13);
		this.sliderSet.push(new slider(25/30,25/30,9,10,1,9,"Rear Width", "cm"));

		this.attributes.push(60);
		this.sliderSet.push(new slider(15/30,25/30,45,60,1,60,"Rear Angle", "*"));

		/*this.attributes.push(13);
		this.sliderSet.push(new slider(25/30,20/30,5,10,1,7,"Middle", "cm"));

/*
		front span	back span	front angle	back angle	front height	back height	front width	back width	middle
		8			16			45			45			9				11			2			9			3
		10			22			60			60			13				15			3			10			5
		cm			cm			deg			deg			mm				mm			cm			cm			cm*/

	}

	refreshStats(){
		//equation of suffering, do not the question...
		//It is a linear regression result thingy idk, I did not set up the mafs.
		var speed = 0.2804817708 + 
		(0.09369140625	*	this.attributes[0])+
		(0.04676432292	*	this.attributes[1])+
		(0.0039453125	*	this.attributes[2])+
		(0.00423828125	*	this.attributes[3])+
		(0.005380859375	*	this.attributes[4])+
		(0.004208984375	*	this.attributes[5])+
		(0.0143359375	*	this.attributes[6])+
		(-0.0090234375	*	this.attributes[7])+
		(0.0030651042	*	this.attributes[8]);
		this.planestats.speed = Math.round(speed * 100)/100;

		var glide = -1.356529948 + 
		(0.1491015625	*	this.attributes[0])+
		(0.03436197917	*	this.attributes[1])+
		(0.01131770833	*	this.attributes[2])+
		(0.0047265625	*	this.attributes[3])+
		(0.00505859375	*	this.attributes[4])+
		(0.0031640625	*	this.attributes[5])+
		(0.00484375		*	this.attributes[6])+
		(0.00875		*	this.attributes[7])+
		(0.002755208333	*	this.attributes[8]);
		this.planestats.glide = Math.round(glide * 100)/100;


		var agility = -0.8530013021 + 
		(0.1216796875	*	this.attributes[0])+
		(0.06048177083	*	this.attributes[1])+
		(0.006546875	*	this.attributes[2])+
		(0.0021484375	*	this.attributes[3])+
		(0.00943359375	*	this.attributes[4])+
		(0.004296875	*	this.attributes[5])+
		(0.016015625	*	this.attributes[6])+
		(0.0375			*	this.attributes[7])+
		(0.002838541667	*	this.attributes[8]);
		this.planestats.agility = Math.round(agility * 100)/100;


		this.planestats.updateSelf()
	}


	refreshShape(){
		permCLog("Refresh shape not fully implemented for this yet.");
	}
	
	
}




var deltaVertices = new Float32Array([
	//top left of the wing
	-0.04,0.05,-0.50,		0.6, 0.0, 0.0,			//0
	-0.50,0.05,-0.50,		0.6, 0.0, 0.0,			//1
	-0.60,0.05,-0.30,		0.55, 0.0, 0.0,			//2
	-0.04,0.05, 0.50,		0.6, 0.0, 0.0,			//3

	//lower inner part
	-0.1,0.00,-0.50,		0.5, 0.0, 0.0,			//4
	-0.1,0.00, 0.35,		0.4, 0.0, 0.0,			//5

	//top right of the wing
	0.04,0.05,-0.50,		0.6, 0.0, 0.0,			//6
	0.50,0.05,-0.50,		0.6, 0.0, 0.0,			//7
	0.60,0.05,-0.30,		0.55, 0.0, 0.0,			//8
	0.04,0.05, 0.50,		0.6, 0.0, 0.0,			//9

	//lower inner part
	0.1,0.00,-0.50,		0.5, 0.0, 0.0,			//10
	0.1,0.00, 0.35,		0.4, 0.0, 0.0,			//11

	//keel
	0.00,-0.10,-0.50,		0.3, 0.0, 0.0,			//12
	0.00,-0.20,-0.50,		0.25, 0.0, 0.0,			//13

	0.00,-0.05,0.25,		0.3, 0.0, 0.0,			//14
]);



var deltaIndices = new Int16Array([
	//top left wing
	0,1,2, 0,2,3, 
	//conecting to bottom inner
	1,2,4, 2,4,5, 2,3,5,
	//sealing the back
	0,1,4,

	//top right wing
	6,7,8, 6,8,9, 
	//conecting to bottom inner
	7,8,10, 8,10,11, 8,9,11,
	//sealing the back
	6,7,10,

	//connecting to the keel, back
	0,4,12, 4,12,13,  6,10,12, 10,12,13,

	//connecting to the keel, front
	3,5,14, 9,11,14,

	//top keel seal
	12,14,0, 3,14,0,  12,14,6, 9,14,6,

	//left keel seal
	13,14,4, 4,14,5,

	//right keel seal
	13,14,10, 10,14,11,
]);





class Delta extends Plane{

	constructor(planestats){
		
		super(deltaVertices, deltaIndices);
		this.name = "Delta";
		this.position[Z_pos] = -2.2;
		this.position[Y_pos] = -0.85;
		this.position[X_pos] = -0.1;
		this.planestats = planestats;

		this.attributes.push(8);
		this.sliderSet.push(new slider(15/30,20/30,7,9,1,8,"Wingspan", "cm"));

		this.attributes.push(15);
		this.sliderSet.push(new slider(15/30,25/30,14,18,1,15,"Length", "cm"));

		this.attributes.push(45);
		this.sliderSet.push(new slider(20/30,20/30,35,65,1,45,"Rear Wing Length", "mm"));

		this.attributes.push(60);
		this.sliderSet.push(new slider(20/30,25/30,55,65,1,60,"Keel", "mm"));
	}


	refreshStats(){
		//equation of suffering, do not the question...
		//It is a linear regression result thingy idk, I did not set up the mafs.
		var speed = -0.6541666667 + 
		(0.2125		*	this.attributes[0])+
		(0.03125		*	this.attributes[1])+
		(0.008333333333	*	this.attributes[2])+
		(-0.005		*	this.attributes[3]);
		this.planestats.speed = Math.round(speed * 100)/100;

		var glide = 0.5583333333 + 
		(0.0375		*	this.attributes[0])+
		(0.13125		*	this.attributes[1])+
		(0.008333333333	*	this.attributes[2])+
		(0.0025		*	this.attributes[3]);
		this.planestats.glide = Math.round(glide * 100)/100;

		var agility = 5.279166667 + 
		(-0.0625		*	this.attributes[0])+
		(-0.10625		*	this.attributes[1])+
		(-0.005833333333	*	this.attributes[2])+
		(-0.005		*	this.attributes[3]);
		this.planestats.agility = Math.round(agility * 100)/100;


		this.planestats.updateSelf()
	}
}