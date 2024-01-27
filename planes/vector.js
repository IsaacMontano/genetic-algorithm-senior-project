const V_Source = `#version 300 es
in vec3 corePos;
in vec3 vColour;
out highp vec3 fColour;

uniform mat4 perspective;

uniform vec3 cordinates; //Of the object
uniform vec4 orientation; //of the object
uniform vec3 cameraPosition;
uniform vec4 cameraOrientation;

vec4 quatMult(vec4 o, vec4 c){
	vec4 temp;
	temp.x = (o.x * c.x) - (o.y * c.y) - (o.z * c.z) - (o.w * c.w);
	temp.y = (o.x * c.y) + (o.y * c.x) + (o.z * c.w) - (o.w * c.z);
	temp.z = (o.x * c.z) - (o.y * c.w) + (o.z * c.x) + (o.w * c.y);
	temp.w = (o.x * c.w) + (o.y * c.z) - (o.z * c.y) + (o.w * c.x);
	return(temp);
}

vec4 quatConj(vec4 q){
	q.y = -q.y;
	q.z = -q.z;
	q.w = -q.w;
	return(q);
}

vec4 normalizeQuat(vec4 quat) {
	float magnitude = sqrt((quat[0] * quat[0]) + (quat[1] * quat[1]) + (quat[2] * quat[2]) + (quat[3] * quat[3]));

	quat.x /= magnitude;
	quat.y /= magnitude;
	quat.z /= magnitude;
	quat.w /= magnitude;
	return(quat);
}


void main() {
	
	vec4 cordFour;
	cordFour.x = 0.0;
	cordFour.y = corePos.x;
	cordFour.z = corePos.y;
	cordFour.w = corePos.z;

	vec4 orientated = quatMult(quatMult(orientation, cordFour), quatConj(orientation));

	
	vec3 worldPos = orientated.yzw + cordinates - cameraPosition;
	vec4 reposToCam = vec4(0, worldPos);
	reposToCam =  quatMult(quatMult(cameraOrientation, reposToCam), quatConj(cameraOrientation));

	gl_Position = perspective * vec4(reposToCam.yzw, 1);	
	
	
	//gl_Position = perspective * vec4(reposToCam.yzw, 1);
	
	fColour = vColour;
	gl_PointSize = 4.0;
}
`;
