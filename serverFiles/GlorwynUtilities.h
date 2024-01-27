#pragma once
#include <stdint.h>

typedef uint8_t u8;
typedef int8_t i8;
typedef uint16_t u16;
typedef int16_t i16;
typedef uint32_t u32;
typedef int32_t i32;
typedef uint64_t u64;
typedef int64_t i64;

#define X_pos 0
#define Y_pos 1
#define Z_pos 2
#define W_pos 3
#define I_pos 4
#define J_pos 5
#define K_pos 6


char* readFile(char* FileName, int* size);
char* readFileInsCR(char* FileName, int* size);

void nullFree(void**memory);

//prints, in red, the error surrounded by newlines
void gError(char* errorMessage);

//inclusive
int randNum(int lower, int upper);

void normalizeQuat(float* quat);

float* quatMultCSave(float* o, float* c);

float* quatMultOSave(float* o, float* c);

//Have to free the memory recieved
float* quatMultNoSave(float* o, float* c);

double* quatMultDCSave(double* o, double* c);
double* quatMultDOSave(double* o, double* c);

float* quatConj(float q[4]);

float vecLen3(const float vec[3]);
float dotP3(const float first[3], const float sec[3]);
float* crossP3(const float first[3], const float sec[3]);
void norm3(float* vec);