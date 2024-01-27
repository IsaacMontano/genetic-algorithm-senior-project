#pragma once
#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define _CRT_SECURE_NO_WARNINGS
#pragma comment(lib, "ws2_32.lib") //Winsock Library
#include <WinSock2.h>
#include <Windows.h>
#include <process.h>
#include <ws2tcpip.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>

#define NO_SIZE_SET_CATCH
#define DEFAULT_PAGE_FILE "default.html"

#define HTTPBEGIN(message) "HTTP/1.1 " ##message "\r\n\r\n"
#define sendHTTPCode(message, sock) (sock)->data = HTTPBEGIN(message);\
(sock)->dSize = sizeof(HTTPBEGIN(message)) - 1;\
gsend((sock));\
(sock)->data = NULL;\
(sock)->dSize = 0;




/*int _406NotAcceptable(GSock* sock) {
	sock->data = HTTPBEGIN("406 Not Acceptable");
	sock->dSize = sizeof(HTTPBEGIN("406 Not Acceptable")) - 1;
	int flag = gsend(sock);
	sock->data = NULL;
	sock->dSize = 0;
	return(flag);
}*/

#define REQ_INVALID -1
#define REQ_GET_FILE 1
#define REQ_GET_SOCKET 2
#define REQ_POST 3

#define GSERVER_RUNNING 0
#define GSERVER_REQUEST_SHUTDOWN 1
#define GSERVER_HALTED_ERROR -1
//time in ms for the server to wait if max conn was reached
#define GSERVER_WAIT_FOR_OPENING 50
//the time between attempting to open another connection even when it goes well, here because idk
#define GSERVER_BETWEEN_CONN_SLEEP 75

#define CONN_DEFAULT_TIMES_TO_WAIT 200

#define CONN_SHOULD_CLOSE -1
#define CONN_KEEP_ALIVE 0

//size to send/recieve per fetch
#define DSIZE 512

//If defined, gsock will attempt to free sockets when recieving 
#define GSOCK_ATTEMPT_FREE
typedef uint64_t uint;


struct gsock {
	SOCKET sock;
	SOCKADDR_IN Addr;
	char* data;//Associated data for sending/recieving
	int dSize;
};
typedef struct gsock GSock;

//small version for dealing with send/recieve yourself. Works with all gsock functions except those lol
struct gsocks {
	SOCKET sock;
	SOCKADDR_IN Addr;
};
typedef struct gsock GSockS;

struct connData {
	GSock* client;
	uint* serverState;
	uint(*onReceive)(GSock*);
	char* internalData;
	uint internalDataSize;
	uint maxTimes;//Max times to do a non-blocking no-recieve
};
typedef struct connData ConnData;


struct gserver {
	uint maxConn;
	uint curConn;
	uint(*onConnect)(ConnData*);//Socket & then server status pointer
	uint(*onReceive)(ConnData*);
	uint masterPort;
	uint state;
	uintptr_t mainThreadID;
};
typedef struct gserver GServer;




//run at the very start, starts up winsock
void startupGSock();

//Creates a socket with the given port/address
void createSock(GSock* sock, int port, char* address);
//takes port as a string
volatile GServer* createGServer(uint port, uint(*onConnect)(ConnData*), uint(*onReceive)(ConnData*));

void gbind(GSock* sock);
//connects the socket
int gconnect(GSock* sock);

//sets up the socket to listen with backlog of five
void glisten(GSock* sock);
void glistenS(GSock* sock, int queueSize);

//accepts a connection
void gaccept(GSock* listeningSock, GSock* passedSock);

//sends data
int gsend(GSock* sock);

//recieves data
int grecv(GSock* sock);
//Non blocking is assumed on version
int grecvNB(GSock* sock);

//Returns just the directory of what is being requested with a GET
char* readGET(char* wholeMessage, int maxLen);

//Handles file GETs only with the absolute most basic of responses.
//Note- is 'unsafe' as it will return *any* file requested, if it has it.
int basicHandleGET(GSock* sock, char* wholeMessage, int maxLen);

//Returns what type of request is being received.
//Currently supported: Basic GET (File request), WebSocket upgrade (Not supported by any GlorvNet code lol, base64 + SHA is not fun.), POST
int requestType(GSock* sock, char* wholeMessage, int maxLen);

//sends a basic HTTP response with the given setup.
int sendHTTPResponse(GSock* sock, char* httpHeader, size_t httpHeaderLen, char* body, size_t bodyLen);



//Example functions
uint blankOnConn(ConnData* data);
uint genericWebsiteHostResponder(ConnData* data);