#define _CRT_SECURE_NO_WARNINGS
#include "GlorwynUtilities.h"
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define G_BUFFER_STEP 512

char* readFile(char* FileName, int* size) {
	if (FileName == NULL) {
		gError("Error: File failed to open.");
		return(NULL);
	}

	FILE* file = fopen(FileName, "r");
	if (file == NULL) {
		gError("Error: File failed to open.");
		printf("File: %s\n", FileName);
		return(NULL);
	}

	char* fileData = calloc(G_BUFFER_STEP, sizeof(char));
	size_t dataSize = G_BUFFER_STEP;
	size_t curPosition = 0;
	size_t curRead;
	while (1) {
		curRead = fread_s(&fileData[curPosition], G_BUFFER_STEP, 1, G_BUFFER_STEP, file);
		if (curRead < G_BUFFER_STEP) {//Hit the end, not any more file to read.
			fileData[curPosition + curRead] = 0;
			*size = curPosition + curRead;
			return(fileData);
		}
		curPosition += G_BUFFER_STEP;
		char* saver = fileData;
		fileData = realloc(fileData, curPosition + G_BUFFER_STEP);
		if (fileData == NULL) {
			free(saver);
			*size = 0;
			return(NULL);
		}
	}
}

//very inefficient thing but it works lol
//inserts carriage return because APPARENTLY I CANT SAVE WITH THEM EVEN WHEN I SET IT TO.
char* readFileInsCR(char* FileName, int* size) {
	FILE* file = fopen(FileName, "r");
	if (file == NULL) {
		gError("Error: File failed to open.");
		printf("File: %s\n", FileName);
		return(NULL);
	}

	char* fileData = calloc(G_BUFFER_STEP, sizeof(char));
	int position = 0;
	int space = G_BUFFER_STEP - 1;
	while (1) {
		int passalong = fgetc(file);
		if (passalong == '\n') {
			fileData[position] = '\r';
			position++;
			space--;
		}
		if (passalong == EOF) {
			fileData[position] = 0;
			*size = position;
			return(fileData);
		}
		fileData[position] = (char)passalong;
		position++;
		space--;
		if (space <= 2) {
			fileData = realloc(fileData, position + G_BUFFER_STEP + 2);
			space = G_BUFFER_STEP + 1;
		}
	}

	return(fileData);
}

void nullFree(void** memory) {
	if (memory != NULL) {
		if (*memory != NULL) {
			free(*memory);
			*memory = NULL;
		}
	}
}

void gError(char* errorMessage) {
	printf("\n\x1B[38;5;88m%s\x1B[0m\n", errorMessage);
}

int randNum(int lower, int upper) {
	return((rand() % ((upper + 1) - lower)) + lower);
}

void normalizeQuat(float* quat) {
	float temp = 0;
	temp = quat[0];
	temp = quat[1];
	temp = quat[2];
	temp = quat[3];
	float magnitude = sqrt((quat[0] * quat[0]) + (quat[1] * quat[1]) + (quat[2] * quat[2]) + (quat[3] * quat[3]));

	quat[0] /= magnitude;
	quat[1] /= magnitude;
	quat[2] /= magnitude;
	quat[3] /= magnitude;
}

float* quatMultCSave(float* o, float* c) {
	float temp[4];
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

float* quatMultOSave(float* o, float* c) {
	float temp[4];
	temp[X_pos] = (o[X_pos] * c[X_pos]) - (o[Y_pos] * c[Y_pos]) - (o[Z_pos] * c[Z_pos]) - (o[W_pos] * c[W_pos]);
	temp[Y_pos] = (o[X_pos] * c[Y_pos]) + (o[Y_pos] * c[X_pos]) + (o[Z_pos] * c[W_pos]) - (o[W_pos] * c[Z_pos]);
	temp[Z_pos] = (o[X_pos] * c[Z_pos]) - (o[Y_pos] * c[W_pos]) + (o[Z_pos] * c[X_pos]) + (o[W_pos] * c[Y_pos]);
	temp[W_pos] = (o[X_pos] * c[W_pos]) + (o[Y_pos] * c[Z_pos]) - (o[Z_pos] * c[Y_pos]) + (o[W_pos] * c[X_pos]);

	o[X_pos] = temp[X_pos];
	o[Y_pos] = temp[Y_pos];
	o[Z_pos] = temp[Z_pos];
	o[W_pos] = temp[W_pos];

	return(o);
}

float* quatMultNoSave(float* o, float* c) {
	float* temp = calloc(4,sizeof(float));
	if (temp == NULL) {
		gError("Tried to do a quat multiply no save and failed to allocate memory.");
		return(NULL);
	}
	temp[X_pos] = (o[X_pos] * c[X_pos]) - (o[Y_pos] * c[Y_pos]) - (o[Z_pos] * c[Z_pos]) - (o[W_pos] * c[W_pos]);
	temp[Y_pos] = (o[X_pos] * c[Y_pos]) + (o[Y_pos] * c[X_pos]) + (o[Z_pos] * c[W_pos]) - (o[W_pos] * c[Z_pos]);
	temp[Z_pos] = (o[X_pos] * c[Z_pos]) - (o[Y_pos] * c[W_pos]) + (o[Z_pos] * c[X_pos]) + (o[W_pos] * c[Y_pos]);
	temp[W_pos] = (o[X_pos] * c[W_pos]) + (o[Y_pos] * c[Z_pos]) - (o[Z_pos] * c[Y_pos]) + (o[W_pos] * c[X_pos]);

	return(temp);
}

double* quatMultDCSave(double* o, double* c) {
	double temp[4];
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

double* quatMultDOSave(double* o, double* c) {
	double temp[4];
	temp[X_pos] = (o[X_pos] * c[X_pos]) - (o[Y_pos] * c[Y_pos]) - (o[Z_pos] * c[Z_pos]) - (o[W_pos] * c[W_pos]);
	temp[Y_pos] = (o[X_pos] * c[Y_pos]) + (o[Y_pos] * c[X_pos]) + (o[Z_pos] * c[W_pos]) - (o[W_pos] * c[Z_pos]);
	temp[Z_pos] = (o[X_pos] * c[Z_pos]) - (o[Y_pos] * c[W_pos]) + (o[Z_pos] * c[X_pos]) + (o[W_pos] * c[Y_pos]);
	temp[W_pos] = (o[X_pos] * c[W_pos]) + (o[Y_pos] * c[Z_pos]) - (o[Z_pos] * c[Y_pos]) + (o[W_pos] * c[X_pos]);

	o[X_pos] = temp[X_pos];
	o[Y_pos] = temp[Y_pos];
	o[Z_pos] = temp[Z_pos];
	o[W_pos] = temp[W_pos];

	return(o);
}



float* quatConj(float q[4]) {
	q[Y_pos] = -q[Y_pos];
	q[Z_pos] = -q[Z_pos];
	q[W_pos] = -q[W_pos];
	return(q);
}

float vecLen3(const float vec[3]) {
	return(sqrtf((vec[0] * vec[0]) + (vec[1] * vec[1]) + (vec[2] * vec[2])));
}

float dotP3(const float first[3], const float sec[3]) {
	return((first[0] * sec[0]) + (first[1] * sec[1]) + (first[2] * sec[2]));
}


float* crossP3(const float first[3], const float sec[3]) {
	float* returns = calloc(3, sizeof(float));

	returns[0] = (first[1] * sec[2]) - (first[2] * sec[1]);
	returns[1] = (first[2] * sec[0]) - (first[0] * sec[2]);
	returns[2] = (first[0] * sec[1]) - (first[1] * sec[0]);
	return(returns);
}

void norm3(float* vec) {
	float temp = 0;
	temp = vec[0];
	temp = vec[1];
	temp = vec[2];
	float magnitude = sqrt((vec[0] * vec[0]) + (vec[1] * vec[1]) + (vec[2] * vec[2]));

	vec[0] /= magnitude;
	vec[1] /= magnitude;
	vec[2] /= magnitude;
}