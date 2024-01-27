//Loads an individual shader. 
//Type is a gl. type specifying what kind, vertex/fragment
//Source is a string form of the shader file.
function loadShader(type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);//copy pasted this section so idk what the hecc a $ does here lol
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

//Performs a complete set up of the shaders putting all relevant information into 'ProgramData' global
function initShaderProgram(vSource, fSource) {
	const vertexShader = loadShader(gl.VERTEX_SHADER, vSource);
  	const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fSource);
	
  	// Create the shader program
  	const shaderProgram = gl.createProgram();
  	gl.attachShader(shaderProgram, vertexShader);
  	gl.attachShader(shaderProgram, fragmentShader);
  	gl.linkProgram(shaderProgram);
	
  	// If creating the shader program failed, alert
  	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    	alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    	return null;
  	}

	//Set to use the program
	gl.useProgram(shaderProgram);
	ProgramData.Verts = gl.getAttribLocation(shaderProgram, "corePos");
	ProgramData.Colours = gl.getAttribLocation(shaderProgram, "vColour");
	//dclog("WebGL shaders setup complete.");
	
  	ProgramData.shaderID = shaderProgram;

	//Uniforms setup
	ProgramData.perspectiveLoc = gl.getUniformLocation(ProgramData.shaderID, "perspective");
	ProgramData.cordinatesLoc = gl.getUniformLocation(ProgramData.shaderID, "cordinates");
	ProgramData.orientationLoc = gl.getUniformLocation(ProgramData.shaderID, "orientation");
	ProgramData.cameraPositionLoc = gl.getUniformLocation(ProgramData.shaderID, "cameraPosition");
	ProgramData.cameraOrientationLoc = gl.getUniformLocation(ProgramData.shaderID, "cameraOrientation");

	//Camera initialization
	gl.viewport(0, 0, ProgramData.windX, ProgramData.windY);
	gl.enable(gl.DEPTH_TEST);

	setPerspective();
	//perspective = [
	//	1.792591, 0.000000, 0.000000, 0.000000,
	//	0.000000, 1.792591, 0.000000, 0.000000,
	//	0.000000, 0.000000, -1.000100, -1.000000,
	//	0.000000, 0.000000, -0.100010, 0.000000
	//];

	//perspective = [
	//	1.792591, 0.000000, 0.000000, 0.000000,
	//	0.000000, 1.792591, 0.000000, 0.000000,
	//	0.000000, 0.000000, -1.000100, -0.100010,
	//	0.000000, 0.000000, -1.000000, 0.000000,
	//];
	

}


function setPerspective(){
	var aspect = ProgramData.windX / ProgramData.windY;
	//float fov = 45;
	var perspective = new Float32Array(16);
	
	var f = 1000;
	var n = 0.1;

	var tanHalfFovy = Math.tan(45 / 2);

	perspective[(0*4)+0] = 1 / (aspect * tanHalfFovy);
	perspective[(1*4)+1] = 1 / (tanHalfFovy);
	perspective[(2*4)+2] = f / (n - f);
	perspective[(2*4)+3] = -1.0;
	perspective[(3*4)+2] = -((f * n) / (f - n));
	gl.uniformMatrix4fv(ProgramData.perspectiveLoc, false, perspective);
}