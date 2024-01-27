//Input: Vertex & index arrays
//Returns: An opengl object 
function createStandardObject(vertices, indices) {
	//unsigned int VBO;
	var returnObject = {};
	//returnObject.ID = ID;

	returnObject.indices = indices;
	returnObject.vertices = vertices;
	returnObject.ID = gl.createVertexArray();
	
	returnObject.VBO = gl.createBuffer();
	returnObject.EBO = gl.createBuffer();

	//Update buffer data
	updateStandardObject(returnObject);
	gl.bindVertexArray(returnObject.ID);

	//set up VAO config
	//vertexAttribPointer(index, count, type, normalized, stride, offset)
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    
	// position attribute, first three
	gl.vertexAttribPointer(ProgramData.Verts, 3, gl.FLOAT, false, 6 * S_FLOAT, 0);
	// color attribute, second three (Obviously offset by three)
	gl.vertexAttribPointer(ProgramData.Colours, 3, gl.FLOAT, false, 6 * S_FLOAT, 3 * S_FLOAT);

	
	
	returnObject.position = [];
	returnObject.position[X_pos] = 0.0;
	returnObject.position[Y_pos] = 0.0;
	returnObject.position[Z_pos] = 0.0;
	returnObject.position[W_pos] = 1.0;
	returnObject.position[I_pos] = 0.0;
	returnObject.position[J_pos] = 0.01;
	returnObject.position[K_pos] = 0.0;
	returnObject.position = normalizeQuatFull(returnObject.position);
	gl.bindVertexArray(null);
	return(returnObject);
}

function updateStandardObject(object){
	gl.bindVertexArray(object.ID);

	gl.bindBuffer(gl.ARRAY_BUFFER, object.VBO);
	gl.bufferData(gl.ARRAY_BUFFER, object.vertices, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.EBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, object.indices, gl.STATIC_DRAW);
	gl.bindVertexArray(null);
}

//draws object as is
function drawStandardObject(shape) {
	gl.bindVertexArray(shape.ID);


	gl.uniform3f(ProgramData.cordinatesLoc, shape.position[X_pos], shape.position[Y_pos], shape.position[Z_pos]);
	gl.uniform4f(ProgramData.orientationLoc, shape.position[W_pos], shape.position[I_pos], shape.position[J_pos], shape.position[K_pos]);
	//gl.drawElements(gl.POINTS, shape.indices.length, gl.UNSIGNED_SHORT, 0);
	gl.drawElements(gl.TRIANGLES, shape.indices.length, gl.UNSIGNED_SHORT, 0);
}
