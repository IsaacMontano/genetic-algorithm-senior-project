var sqrt = Math.sqrt;

function normalizeQuat(quat) {
	var magnitude = Math.sqrt((quat[0] * quat[0]) + (quat[1] * quat[1]) + (quat[2] * quat[2]) + (quat[3] * quat[3]));

	quat[0] /= magnitude;
	quat[1] /= magnitude;
	quat[2] /= magnitude;
	quat[3] /= magnitude;
	return(quat);
}

//Assumes xyz as first entries
function normalizeQuatFull(quat) {
	var magnitude = Math.sqrt((quat[W_pos] * quat[W_pos]) + (quat[I_pos] * quat[I_pos]) + (quat[J_pos] * quat[J_pos]) + (quat[K_pos] * quat[K_pos]));

	quat[W_pos] /= magnitude;
	quat[I_pos] /= magnitude;
	quat[J_pos] /= magnitude;
	quat[K_pos] /= magnitude;
	return(quat);
}

function quatDot(quat){
	return(Math.sqrt((quat[0] * quat[0]) + (quat[1] * quat[1]) + (quat[2] * quat[2]) + (quat[3] * quat[3])));
}


function quatMult(o, c) {
	var temp = [0,0,0,0];
	temp[X_pos] = (o[X_pos] * c[X_pos]) - (o[Y_pos] * c[Y_pos]) - (o[Z_pos] * c[Z_pos]) - (o[W_pos] * c[W_pos]);
	temp[Y_pos] = (o[X_pos] * c[Y_pos]) + (o[Y_pos] * c[X_pos]) + (o[Z_pos] * c[W_pos]) - (o[W_pos] * c[Z_pos]);
	temp[Z_pos] = (o[X_pos] * c[Z_pos]) - (o[Y_pos] * c[W_pos]) + (o[Z_pos] * c[X_pos]) + (o[W_pos] * c[Y_pos]);
	temp[W_pos] = (o[X_pos] * c[W_pos]) + (o[Y_pos] * c[Z_pos]) - (o[Z_pos] * c[Y_pos]) + (o[W_pos] * c[X_pos]);

	c[X_pos] = temp[X_pos];
	c[Y_pos] = temp[Y_pos];
	c[Z_pos] = temp[Z_pos];
	c[W_pos] = temp[W_pos];

	return(c);
}

//Assumes the first three entries in the array are an xyz pos
function quatMultFull(o, c) {
	var temp = [0,0,0, 0,0,0,0];
	temp[W_pos] = (o[W_pos] * c[W_pos]) - (o[I_pos] * c[I_pos]) - (o[J_pos] * c[J_pos]) - (o[K_pos] * c[K_pos]);
	temp[I_pos] = (o[W_pos] * c[I_pos]) + (o[I_pos] * c[W_pos]) + (o[J_pos] * c[K_pos]) - (o[K_pos] * c[J_pos]);
	temp[J_pos] = (o[W_pos] * c[J_pos]) - (o[I_pos] * c[K_pos]) + (o[J_pos] * c[W_pos]) + (o[K_pos] * c[I_pos]);
	temp[K_pos] = (o[W_pos] * c[K_pos]) + (o[I_pos] * c[J_pos]) - (o[J_pos] * c[I_pos]) + (o[K_pos] * c[W_pos]);

	c[W_pos] = temp[W_pos];
	c[I_pos] = temp[I_pos];
	c[J_pos] = temp[J_pos];
	c[K_pos] = temp[K_pos];

	return(c);
}


function quatConjFull(quat){
	quat[I_pos] = -quat[I_pos];
	quat[J_pos] = -quat[J_pos];
	quat[K_pos] = -quat[K_pos];
	return(quat);
}