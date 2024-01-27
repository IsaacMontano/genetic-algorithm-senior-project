#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <string.h>
#include "GlorvNet2.h"
#include "GlorwynUtilities.h"

#pragma once

#define MAX_QUEUE 5

void startupGSock() {
	WSADATA wsaData;
	int flag = WSAStartup(MAKEWORD(2, 2), &wsaData);
	if (flag != 0) {
		printf("Failed to initalize winsock.\n");
		exit(-1);
	}
}

//If zero, binds with INADDR_ANY
void createSock(GSock* sock, int port, char* address) {
	sock->sock = 0;
	sock->sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (sock->sock == INVALID_SOCKET) {
		printf("Failure to create socket, error code: %d\n.", WSAGetLastError());
		exit(-1);
	}
	sock->Addr.sin_family = AF_INET;
	sock->Addr.sin_port = htons(port);
	if (address != 0) {
		sock->Addr.sin_addr.s_addr = inet_addr(address);
	}
	else {
		sock->Addr.sin_addr.s_addr = INADDR_ANY;//htonl(INADDR_ANY);
	}
	sock->dSize = 0;
}

void runConn(ConnData* conn) {
	int settingFlag = 0;
	//make sure our socket is blocking
	//ioctlsocket(conn->client->sock, FIONBIO, &settingFlag);
	
	volatile int times = 0;
	start:;
	
	int received = grecvNB(conn->client);
	if (received == -1) {
		if (WSAGetLastError() == 10035 /*Would block*/) {
			if (times > conn->maxTimes) {
				printf("closing on no request.\n");
				goto GracefulClose;
			}
			goto start;
		}
		printf("Failed receive, code %d\n", WSAGetLastError());
		closesocket(conn->client->sock);
		if (conn->internalData != NULL) {
			nullFree(&conn->internalData);
		}
		nullFree(&conn->client);
		nullFree(&conn);
		ExitThread(-1);
		return;
	} else if(received > 0){
		if (conn->onReceive(conn) != CONN_KEEP_ALIVE) {
			//printf("Closing ourselves on receive function response\n");
			closesocket(conn->client->sock);
			nullFree(&conn->client);
			nullFree(&conn);
			ExitThread(1);
			return;
		}
	} else if (received == 0) {//graceful close
		GracefulClose:;
		closesocket(conn->client->sock);
		if (conn->internalData != NULL) {
			nullFree(&conn->internalData);
		}		
		nullFree(&conn->client);
		nullFree(&conn);
		ExitThread(-1);
		return;
	}

	if (*conn->serverState != GSERVER_RUNNING) {
		closesocket(conn->client->sock);
		nullFree(&conn->client);
		nullFree(&conn);
		ExitThread(1);
		return;
	}else {
		goto start;
	}
	
}

void openServerConn(volatile GServer* Server, GSock* clientSock) {
	ConnData* dataPack = calloc(1, sizeof(ConnData));
	dataPack->client = clientSock;
	dataPack->serverState = &Server->state;
	dataPack->onReceive = Server->onReceive;
	dataPack->maxTimes = CONN_DEFAULT_TIMES_TO_WAIT;
	if (Server->onConnect(dataPack) == CONN_KEEP_ALIVE) {
		_beginthread(runConn, 0, dataPack);
	} else {
		printf("On connect requested a close\n");
		closesocket(clientSock);
		nullFree(&dataPack);
	}
	clientSock = NULL;//reset this in case anyone comes asking lol
}

void runServer(volatile GServer* Server) {
	GSock* serverSock = calloc(1, sizeof(GSock));
	GSock* clientSock = NULL;
	createSock(serverSock, Server->masterPort, 0);
	Server->state = GSERVER_RUNNING;

	//WSAAccept(serverSock->sock, serverSock->Addr, NULL, )
	//setsockopt(serverSock, SOL_SOCKET, SO_CONDITIONAL_ACCEPT, temp, )

	// If = 0, blocking is enabled; 
	// If != 0, non-blocking mode is enabled.
	const int temp = 1;
	ioctlsocket(serverSock->sock, FIONBIO, &temp);
	printf("Server socket set up with port %lld\n", Server->masterPort);

	Start:;
	if (Server->state == GSERVER_RUNNING) {
		glistenS(serverSock, 5);
		clientSock = calloc(1, sizeof(GSock));
		gaccept(serverSock, clientSock);
		if (clientSock->sock == INVALID_SOCKET) {
			if (WSAGetLastError() == WSAEWOULDBLOCK) {
				goto End;
			}
		}
		//printf("\n\nConnection accepted at %s\n\n", inet_ntoa(clientSock->Addr.sin_addr));

		openServerConn(Server, clientSock);
	} else if(Server->state == GSERVER_REQUEST_SHUTDOWN) {
		printf("Server shutting down.\n");
		closesocket(serverSock->sock);
		nullFree(&serverSock);
		ExitThread(1);
	} else {
		printf("Invalid state, %lld, closing.\n", Server->state);
	}


	End:;

	if (GSERVER_BETWEEN_CONN_SLEEP > 0) {
		Sleep(GSERVER_BETWEEN_CONN_SLEEP);
	}
	
	goto Start;
}

//creates a GSock server with given function points to handle connection and receiving.
volatile GServer* createGServer(uint port, uint(*onConnect)(GSock*, uint*), uint(*onReceive)(GSock*, uint*)){
volatile GServer* serverData = calloc(1, sizeof(GServer));
	serverData->onConnect = onConnect;
	serverData->onReceive = onReceive;
	serverData->masterPort = port;

	serverData->mainThreadID = _beginthread(runServer, 0, serverData);
	printf("Thread created, returning this\n");
	return(serverData);
}



void gbind(GSock* sock) {
	bind(sock->sock, (SOCKADDR*)&sock->Addr, sizeof(sock->Addr));
}

int gconnect(GSock* sock) {
	return(connect(sock->sock, (SOCKADDR*)&sock->Addr, sizeof(sock->Addr)));
}

void glisten(GSock* sock) {
	bind(sock->sock, (SOCKADDR*)&sock->Addr, sizeof(sock->Addr));
	listen(sock->sock, MAX_QUEUE);
}

void glistenS(GSock* sock, int queueSize) {
	bind(sock->sock, (SOCKADDR*)&sock->Addr, sizeof(sock->Addr));
	listen(sock->sock, queueSize);
}

//does not internally handle non blocking socks with no queue
void gaccept(GSock* listeningSock, GSock* passedSock) {
	int addrsize = sizeof(listeningSock->Addr);
	passedSock->sock = accept(listeningSock->sock, (SOCKADDR*)&passedSock->Addr, &addrsize);
}

int gsend(GSock* socket) {
	#ifdef NO_SIZE_SET_CATCH
	if (socket->dSize == 0) {
		printf("No size specified, assuming string and setting here. Still needs to be fixed for better code tho\n");
		socket->dSize = strlen(socket->data);
	}
	#endif
	
	//printf("Sending: %s\n", socket->data);
	int sent = 0;
	
	while(sent < socket->dSize) {
		sent += send(socket->sock, socket->data, socket->dSize, 0);
	}
	return(sent);
}

int grecv(GSock* socket) {
	#ifdef GSOCK_ATTEMPT_FREE
	if (socket->data != NULL) {
		nullFree(&socket->data);
	}
	#endif

	socket->data = calloc(DSIZE, sizeof(i8));

	int current = 0;
	int recieved = 0;
	while (1) {
		recieved = recv(socket->sock, &socket->data[current * DSIZE], DSIZE, 0);
		
		if (recieved == SOCKET_ERROR) {
			gError("Faliure to recieve data.\n");
			printf("%d\n\n", WSAGetLastError());
			return(-1);
		} else if (recieved == DSIZE) {
			current++;
			char* safety = socket->data;
			socket->data = realloc(socket->data, (current + 1) * DSIZE);
			if (socket->data == NULL) {
				gError("Memory allocation error within grecv, failed to realloc.");
				exit(-1);
			}
		} else {
			break;
		}
	}
	socket->dSize = recieved + (current * DSIZE);
	
	return(socket->dSize);
}

//Non blocking is assumed on version
int grecvNB(GSock* socket) {
	#ifdef GSOCK_ATTEMPT_FREE
	if (socket->data != NULL) {
		nullFree(&socket->data);
	}
	#endif

	socket->data = calloc(DSIZE, sizeof(i8));

	int current = 0;
	int recieved = 0;
	while (1) {
		recieved = recv(socket->sock, &socket->data[current * DSIZE], DSIZE, 0);

		if (recieved == SOCKET_ERROR) {
			return(-1);
		} else if (recieved == DSIZE) {
			current++;
			char* safety = socket->data;
			socket->data = realloc(socket->data, (current + 1) * DSIZE);
			if (socket->data == NULL) {
				gError("Memory allocation error within grecv, failed to realloc.");
				exit(-1);
			}
		} else {
			break;
		}
	}
	socket->dSize = recieved + (current * DSIZE);

	return(socket->dSize);
}



char* readGET(char* wholeMessage, int maxLen) {
	char* requestedDir = calloc(maxLen, sizeof(char));

	int startChar = 0;
	for (; startChar < maxLen; startChar++) {
		//found the start of the directory
		if (wholeMessage[startChar] == '/') {
			startChar++;
			break;
		}
	}

	//If GET is just a singular /, return default page.
	if (wholeMessage[startChar] == ' ') {
		memcpy(requestedDir, DEFAULT_PAGE_FILE, sizeof(DEFAULT_PAGE_FILE));
		return(requestedDir);
	}

	int copyChar = 0;
	for (; copyChar < maxLen - startChar; copyChar++) {
		if (wholeMessage[startChar + copyChar] == ' ') {//End of the directory listing
			break;
		} else {
			requestedDir[copyChar] = wholeMessage[startChar + copyChar];
		}
	}
	return(requestedDir);
}

int basicHandleGET(GSock* sock, char* wholeMessage, int maxLen) {
	static char fileNotFoundResponse[] = "HTTP/1.1 404 File Not Found\r\n\r\n";
	static char defaultOkayResponse[] = "HTTP/1.1 200 OK\r\n\r\n";

	static char endOfResponse[] = "\r\n\r\n";
	char* dir = readGET(wholeMessage, maxLen);
	//printf("Dir: %s\n", dir);
	int size = 0;
	char* data = readFileInsCR(dir, &size);
	
	/*	if (sock->data != NULL) {
		free(sock->data);
	}*/
	

	if (data == NULL) {
		gError("Client requested non-existent file.\n");
		sock->data = fileNotFoundResponse;
		sock->dSize = sizeof(fileNotFoundResponse) - 1;
		//printf("%s\n", sock->data);
		gsend(sock);
		sock->data = NULL;
		nullFree(&dir);
		return(-1);
	}
	
	//uses a couple extra bytes but whatever.
	sock->data = calloc(1, size + sizeof(defaultOkayResponse) + sizeof(endOfResponse) + 10);
	if (sock->data == NULL) {
		gError("Failed to allocate memory in basicHandleGET.");
		exit(-1);
	}
	memcpy(sock->data, defaultOkayResponse, sizeof(defaultOkayResponse));
	strncat(sock->data, data, size);
	strncat(sock->data, endOfResponse, 4);

	//printf("Sending\n");
	sock->dSize = strlen(sock->data);
	gsend(sock);
	//	printf("%d\n", gsend(sock));

	nullFree(&data);
	nullFree(&dir);
	nullFree(&sock->data);
		
	return(0);
}


int sendHTTPResponse(GSock* sock, char* httpHeader, size_t httpHeaderLen, char* body, size_t bodyLen) {
	if (sock->data != NULL) {
		nullFree(&sock->data);
	}
	sock->data = calloc(httpHeaderLen + bodyLen + (size_t)2, 1);
	if (sock->data == NULL) {
		gError("Failed to allocate memory in sendHTTPResponse");
	}
	memcpy(sock->data, httpHeader, httpHeaderLen);
	memcpy(&sock->data[httpHeaderLen], body, bodyLen);
	sock->dSize = httpHeaderLen + bodyLen;
	int flag = gsend(sock);
	nullFree(&sock->data);
	sock->dSize = 0;
	return(flag);
}


int requestType(GSock* sock, char* wholeMessage, int maxLen) {
	//Check to make sure the message isn't super truncated, perhaps in an attempt to get a buffer overread.
	if (maxLen < 5) {
		return(REQ_INVALID);
	}
	if (strstr("Upgrade: websocket", wholeMessage) != NULL) {
		return(REQ_GET_SOCKET);
	} else if(strncmp("GET", wholeMessage, 3) == 0){
		return(REQ_GET_FILE);
	} else if (strncmp("POST", wholeMessage, 4) == 0) {
		return(REQ_POST);
	}
}













uint blankOnConn(ConnData* data) {
	//printf("%s\n", inet_ntoa(data->client->Addr.sin_addr));
	//_beginthread(tooManyThreads, 0, data);
	return(CONN_KEEP_ALIVE);
}
uint genericWebsiteHostResponder(ConnData* data) {
	//data->client->data[DSIZE - 2] = 0;
	//debug print
	printf("Recieved: %s\n", data->client->data);

	data->internalData = data->client->data;
	int flag = requestType(data->client, data->client->data, data->client->dSize);
	if (flag == REQ_GET_FILE) {
		basicHandleGET(data->client, data->internalData, DSIZE);
		nullFree(&data->client->data);
	} else if (flag == REQ_POST) {
		printf("Post Request\n");
		static const char header[] = HTTPBEGIN("200 OK");
		static const int headerLen = sizeof(header) - 1;
		char message[20] = {0};
		srand(data);
		//TEMP PLACEHOLDER
		sprintf(message, "%.1f,%.1f,%.1f", (float)randNum(10,30)/10, (float)randNum(10, 30) / 10, (float)randNum(10, 30) / 10);
		sendHTTPResponse(data->client, header, headerLen, message, 11);
		nullFree(&data->client->data);
	} else {
		printf("Invalid request for handler.\n");
		sendHTTPCode("406 Not Acceptable", data->client);
		nullFree(&data->client->data);
	}


	return(CONN_SHOULD_CLOSE);
}