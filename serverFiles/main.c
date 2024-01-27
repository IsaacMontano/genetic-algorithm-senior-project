#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define _CRT_SECURE_NO_WARNINGS
#include<stdio.h>
#include<winsock2.h>
#include "GlorvNet2.h"
#include "GlorwynUtilities.h"
#include "aiGens.h"
//uses ws2_32.lib

#define DEFAULT_BUFLEN 512
#define DEFAULT_PORT "27015"


uint planeCustomizerPageResponder(ConnData* data) {
	//data->client->data[DSIZE - 2] = 0;
	//debug print
	//printf("Recieved: %s\n", data->client->data);

	data->internalData = data->client->data;
	int flag = requestType(data->client, data->client->data, data->client->dSize);
	if (flag == REQ_GET_FILE) {
		basicHandleGET(data->client, data->internalData, DSIZE);
		nullFree(&data->client->data);
	} else if (flag == REQ_POST) {
		printf("Post Request\n");
		static const char header[] = HTTPBEGIN("200 OK");
		static const int headerLen = sizeof(header) - 1;

		//Handle the stat update request
		if (strstr(data->client->data, "Hammerhead\r\n") != NULL) {
			char message[256] = { 0 };
			genHammerhead(message, data->client->data);
			sendHTTPResponse(data->client, header, headerLen, message, strnlen(message, 200));
			printf("Sent.\n");
		} else if (strstr(data->client->data, "Invader\r\n") != NULL) {
			char message[256] = { 0 };
			genInvader(message, data->client->data);
			sendHTTPResponse(data->client, header, headerLen, message, strnlen(message, 200));
			printf("Sent.\n");
		} else if (strstr(data->client->data, "Delta\r\n") != NULL) {
			char message[256] = { 0 };
			genDelta(message, data->client->data);
			sendHTTPResponse(data->client, header, headerLen, message, strnlen(message, 200));
			printf("Sent.\n");
		} else {
			sendHTTPCode("404 Not Found", data->client);
		}
		
		nullFree(&data->client->data);
	} else {
		printf("Invalid request for handler.\n");
		sendHTTPCode("406 Not Acceptable", data->client);
		nullFree(&data->client->data);
	}


	return(CONN_SHOULD_CLOSE);
}




int main(int argc, char* argv[]) {
	WSADATA wsaData;
	startupGSock();
	char string[50] = { 0 };



	GServer* Server = createGServer(80, blankOnConn, planeCustomizerPageResponder);
//	
//	
//
//	char testDoc[] = "<!DOCTYPE html>\n<html>\n<body\n	<p>My first paragraph.</p></body></html>";
//
	//good for talking thingy
	/*while (1) {
		memset(masterTyping, 0, 500);
		gets(masterTyping);
		strcat(masterTyping, "\n");
		curState++;
		if (masterTyping[0] == '0') {
			Server->state = 1;
			break;
		}
		//not a safe way to do this but whatever bleh
		Sleep(50);
	}*/
	

	WaitForSingleObject(Server->mainThreadID, INFINITE);



	printf("Ended %d\n", WSACleanup());
	
	gets(string);
	return 0;
}
