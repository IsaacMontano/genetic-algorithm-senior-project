`use strict`

var MouseData = {};
var Canvas = null;

var GlobalCanvas = null;
var GlobalCtx = null;

var clog = console.log;
var dclog = console.log;//debug version, make it point to blank function if you want to remove all the prints.
var permCLog = console.log;//permanent one

//For persisant stuff like the page switching arrows and such
var persistantUI = [];

//The list of planes and their associated data, WebGL render of the model & sliders/title.
var PlaneList = [];
var curPlane = 0;

function tRad(angle) {
	return angle * (Math.PI / 180);
}

function init(){
	//Mouse listener for interaction
	document.addEventListener("mousemove", (event) => {
		MouseData.x = event.offsetX;//event.clientX;
		MouseData.y = event.offsetY;//event.clientY;     
	});

	//Flag variable to see if handling the click should be done.
	document.addEventListener("click", (event) => {
		MouseData.click = true;
	});

	//Click & drag on the model to spin it
	MouseData.velocityX = 0;
	MouseData.velocityY = 0;
	document.addEventListener("mousedown", (event) => {
		if(MouseData.x > window.innerWidth/2){
			if(MouseData.y < window.innerHeight/2){
				MouseData.dragging = true;
				MouseData.velocityX = 0;
				MouseData.velocityY = 0;
				MouseData.draggingPrevX = MouseData.x;
				MouseData.draggingPrevY = MouseData.y;
			}
		}
		
	});

	document.addEventListener("mouseup", (event) => {
		MouseData.dragging = false;		
	});

	
	//Debug camera mover atm.
	document.addEventListener("keydown", keyHandler);

	//Setting up the canvases
	GlobalCanvas = document.querySelector(".globalCanvas");
	GlobalCtx = GlobalCanvas.getContext("2d");
	GlobalCanvas.style.position = 'absolute';
	GlobalCanvas.style.top = "0px";
	GlobalCanvas.style.left = "0px";

	Canvas = document.querySelector('.glcanvas');
	Canvas.style.position = 'absolute';
	Canvas.style.top = "0px";
	//call to refresh to make sure everything is set.
	refreshWindowData();


  	//Initialize WebGL and set it up
  	gl = Canvas.getContext("webgl2");
  	if (gl === null) {
    	alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    	return;
  	}
  	initShaderProgram(V_Source, F_Source);
  	
  	// Set clear color to black, fully opaque
  	gl.clearColor(0.45, 0.65, 0.95, 1);
  	// Clear the color buffer with specified clear color
  	gl.clear(gl.COLOR_BUFFER_BIT);
  	

	//Persistant UI setup, first has to be the title
	persistantUI.push(new planeTitle(7.5/30, 2/30, "Invader"));
	persistantUI.push(new pageswitchArrow(13/30, 2/30, 1));
	persistantUI.push(new pageswitchArrow((2/30) - (1/pageswitchArrow.arrowSize), 2/30, 0));
	persistantUI.push(new planeStats());
	var planestatsPos = persistantUI.length - 1;
	persistantUI.push(new aiGeneratorSettings());
	
	changeColour(hammerheadVertices, 2);
	changeColour(deltaVertices, 1);

	PlaneList.push({plane:new Invader(persistantUI[planestatsPos]), title:"Invader"});
	PlaneList.push({plane:new Hammerhead(persistantUI[planestatsPos]), title:"Hammerhead"});
	PlaneList.push({plane:new Delta(persistantUI[planestatsPos]), title:"Delta"});
	curPlane = 1;

	updateLoop();
}

function refreshWindowData(){
	GlobalCanvas.width = window.innerWidth;
	GlobalCanvas.height = window.innerHeight;

	Canvas.style.left = "" + (window.innerWidth/2)+"px";
	Canvas.width = window.innerWidth/2;
	Canvas.height = window.innerHeight/2;

	ProgramData.windX = window.innerWidth/2;
	ProgramData.windY = window.innerHeight/2;
	if(gl !== null){
		gl.viewport(0, 0, ProgramData.windX, ProgramData.windY);
		setPerspective();
	}
}


var lastCheck = {width:0, height:0};
function shouldUpdateUI(){
	if(window.innerWidth !== lastCheck.width){
		lastCheck.width = window.innerWidth;
		lastCheck.height = window.innerHeight;
		return(true);
	}else if(window.innerHeight !== lastCheck.height){
		lastCheck.width = window.innerWidth;
		lastCheck.height = window.innerHeight;
		return(true);
	}else{
		return(false);
	}
}

//Used after updating a plane's internal data (Including sliders) to update the listed plane stats.
function debugUpdater(){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "", false);
	xhr.overrideMimeType("text/plain");
	xhr.setRequestHeader("Content-Type", "Request_Hammerhead_Gen");
	let message = ""+PlaneList[curPlane].name;
	xhr.send(message);
	PlaneList[curPlane].plane.sliderSet[2].current = parseInt(xhr.responseText);
	PlaneList[curPlane].plane.refreshSelf();
}
//
var camera = [0,0,0, 0.984807753012208,0.17364817766693,0,0];

//Check if window has changed sizes (If so, tell everything to refresh itself), clear, do any mouse draggin for the window, then draw.
function updateLoop(){
	


	//If the window size changed, everything needs to rescale. This is that handler
	if(shouldUpdateUI()){
		refreshWindowData();
		for(let c = 0; c < persistantUI.length; c++){
			persistantUI[c].updateSelf();
		}
		PlaneList[curPlane].plane.refreshSelf();
	}
	PlaneList[curPlane].plane.checkClick(MouseData.x, MouseData.y);
	
	//The clearing before the drawing storm
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	GlobalCtx.clearRect(0, 0, GlobalCanvas.width, GlobalCanvas.height);

	//model update
	if(MouseData.dragging){
		MouseData.velocityX = (MouseData.velocityX + (MouseData.x - MouseData.draggingPrevX))/2;
	}else{
		MouseData.velocityX = MouseData.velocityX/1.05;
	}
	
	if(Math.abs(MouseData.velocityX) < 0.05){
		MouseData.velocityX = 0;
	}else{
		let theta = (Math.log2(Math.abs(MouseData.velocityX) + 2) - 1)/100;
		if(MouseData.velocityX < 0){
			theta *= -1;
		}
		let rot = [0,0,0, Math.cos(theta),0,Math.sin(theta),0];
		quatMultFull(rot, PlaneList[curPlane].plane.position);
	}
	/*
	if(MouseData.dragging){
		MouseData.velocityY = (MouseData.velocityY + (MouseData.y - MouseData.draggingPrevY))/2;
	}else{
		MouseData.velocityY = MouseData.velocityY/1.05;
	}
	
	if(Math.abs(MouseData.velocityY) < 0.01){
		MouseData.velocityY = 0;
	}else{
		let theta = (Math.log2(Math.abs(MouseData.velocityY) + 2) - 1)/100;
		if(MouseData.velocityY < 0){
			theta *= -1;
		}
		let rot = [0,0,0, Math.cos(theta),Math.sin(theta),0,0];
		quatMultFull(rot, PlaneList[curPlane].plane.position);
	}*/

	gl.uniform3f(ProgramData.cameraPositionLoc, camera[X_pos],camera[Y_pos],camera[Z_pos]);
	gl.uniform4f(ProgramData.cameraOrientationLoc, camera[W_pos],camera[I_pos],camera[J_pos],camera[K_pos]);
	





	//The title is also a special snowflake for now and gets a manual refresh.
	persistantUI[0].title = PlaneList[curPlane].title;
	persistantUI[0].updateSelf();

	//Drawing everything
	for(let c = 0; c < persistantUI.length; c++){
		if(MouseData.click){
			persistantUI[c].checkClick(MouseData.x, MouseData.y);
		}
		persistantUI[c].draw();
	}
	PlaneList[curPlane].plane.draw();


	


	MouseData.click = false;
	MouseData.draggingPrevX = MouseData.x;
	MouseData.draggingPrevY = MouseData.y;
	requestAnimationFrame(updateLoop);
}



function keyHandler(event){
	if (event.key == "a") {
		camera[X_pos] -= 0.1;
	}
	else if (event.key == "d") {
		camera[X_pos] += 0.1;
	}

	else if (event.key == "w") {
		camera[Y_pos] += 0.1;
	}
	else if (event.key == "s") {
		camera[Y_pos] -= 0.1;
	}

	else if (event.key == "q") {
		camera[Z_pos] += 0.1;
	}
	else if (event.key == "e") {
		camera[Z_pos] -= 0.1;
	}

}




///*let theta = ((MouseData.x )/ (window.innerWidth ) - 0.5) *2 * Math.PI;
	//clog( ((MouseData.x )/ (window.innerWidth ) - 0.5) *4 * Math.PI);
	//camera[W_pos] =  Math.cos(theta/2);
	//camera[J_pos] =  Math.sin(theta/2);

	//theta = ((MouseData.y )/ (window.innerHeight ) - 0.5) *2 * Math.PI;
	//camera[W_pos] =  Math.cos(theta/2);
	//camera[I_pos] =  Math.sin(theta/2);
	//camera[K_pos] = 0;*/