#ifndef __MAIN_H__
#define __MAIN_H__



#include <esp_system.h>
#include <nvs_flash.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"

#include "esp_camera.h"
#include "esp_http_server.h"
#include "esp_timer.h"
#include "camera_pins.h"
#include "connect_wifi.h"
#include "esp_http_client.h"

#include "i2c_intf.h"
#include "LCD_16x2.h"

static const char *TAG = "esp32-cam Webserver";


#define PART_BOUNDARY "123456789000000000000987654321"
static const char* _STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char* _STREAM_BOUNDARY = "\r\n--" PART_BOUNDARY "\r\n";
static const char* _STREAM_PART = "Content-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n";

#define CONFIG_XCLK_FREQ 20000000 

#define SER_POST_URL "http://192.168.137.162:7000/upload"

typedef enum{
    SEND,
    NOTSEND
}take_photo_req_t;

// QueueHandle_t interupt_queue = NULL;
static take_photo_req_t take_photo_req = NOTSEND;
esp_err_t jpg_stream_httpd_handler(httpd_req_t *req);

httpd_uri_t uri_get = {
    .uri = "/",
    .method = HTTP_GET,
    .handler = jpg_stream_httpd_handler,
    .user_ctx = NULL
};





#endif