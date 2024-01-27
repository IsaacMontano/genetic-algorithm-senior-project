const F_Source = `#version 300 es
in highp vec3 fColour;
out highp vec4 outColour;
void main() {
    outColour = vec4(fColour, 1.0);
}
`;
