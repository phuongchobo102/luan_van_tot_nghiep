#include "main.h"


static esp_err_t init_camera(void);
esp_err_t jpg_stream_httpd_handler(httpd_req_t *req);
httpd_handle_t setup_server(void);

static QueueHandle_t mov_sensor_queue = NULL;
static void IRAM_ATTR gpio_irq(void* data)
{
  gpio_num_t gpio_num=(uint32_t)data;
  xQueueSendFromISR(mov_sensor_queue,&gpio_num,0);
}


void send_image();
static void init_flash_light(void);
static void set_flash(uint8_t cmd);
static void init_button(void);
static void ISR_gpio_task( void * pvParameters );

void app_main()
{
    mov_sensor_queue = xQueueCreate(10, sizeof(uint32_t));
    init_button();

    esp_err_t err;
    // // Initialize NVS
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
    {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    // esp_i2c_master_init();
    // start_lcd();
    connect_wifi();

    if (wifi_connect_status)
    {
        init_flash_light();
        set_flash(1);
        // init_io0_button();
        ESP_LOGI(TAG, "ESP32 CAM Web Server init_camera\n");
        err = init_camera();
        // err = ESP_OK;
        if (err != ESP_OK)
        {
            printf("err: %s\n", esp_err_to_name(err));
            return;
        }
        // esp_i2c_master_init();
        // start_lcd();
        // lcd_begin();
        // uint8_t idx = 0;
        // while(true){
            // lcd_put_cur(0, 10);
            // if((idx++ % 2 )== 0)
            //     lcd_send_string("1");
            // else{
            //     lcd_send_string("9");
            // }
            // vTaskDelay(5000/portTICK_PERIOD_MS);
            // send_image();
        // }
        xTaskCreate(ISR_gpio_task,"ISR_gpio_task",4096,NULL,10,NULL);//create task freertos   ///
    }
    else{
        ESP_LOGI(TAG, "Failed to connected with Wi-Fi, check your network Credentials\n");
    }

}

void send_image(){
    // 1. Chụp ảnh
    camera_fb_t *pic = esp_camera_fb_get(); // Chụp ảnh và lưu ảnh vào `pic`
    esp_camera_fb_return(pic); 
    pic = esp_camera_fb_get(); 
    // 2. Thiết lập yêu cầu HTTP
    esp_http_client_config_t config = {
        .url = SER_POST_URL,
        .method = HTTP_METHOD_POST,
        .cert_pem = NULL,
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);

    // 3. Cấu hình header
    // 2. Thiết lập phần header cho `multipart/form-data`
    esp_http_client_set_header(client, "Content-Type", "multipart/form-data; boundary=boundary-string");
    
    char boundary[] = "--boundary-string\r\n";
    char end_boundary[] = "\r\n--boundary-string--\r\n";
    char content_disposition[] = "Content-Disposition: form-data; name=\"image\"; filename=\"image.jpg\"\r\n";
    char content_type[] = "Content-Type: image/jpeg\r\n\r\n";

    // Tính toán tổng kích thước của yêu cầu POST
    int body_len = strlen(boundary) + strlen(content_disposition) + strlen(content_type) + pic->len + strlen(end_boundary);

    // Mở kết nối HTTP với kích thước nội dung
    esp_http_client_open(client, body_len);

    // Gửi các phần của `multipart/form-data` theo thứ tự
    esp_http_client_write(client, boundary, strlen(boundary));
    esp_http_client_write(client, content_disposition, strlen(content_disposition));
    esp_http_client_write(client, content_type, strlen(content_type));
    esp_http_client_write(client, (const char *)pic->buf, pic->len); // Gửi dữ liệu ảnh
    esp_http_client_write(client, end_boundary, strlen(end_boundary)); // Kết thúc

    // Đóng kết nối HTTP
    esp_http_client_close(client);
    esp_http_client_cleanup(client);
    esp_camera_fb_return(pic); // Giải phóng ảnh khỏi bộ nhớ
}


static void init_flash_light(void)
{
  gpio_config_t gpio_2config;
  gpio_2config.pin_bit_mask=1<<GPIO_NUM_4;
  gpio_2config.mode=GPIO_MODE_OUTPUT;
  gpio_2config.intr_type=GPIO_INTR_DISABLE;
  gpio_2config.pull_down_en=GPIO_PULLDOWN_DISABLE;
  gpio_2config.pull_up_en=GPIO_PULLDOWN_DISABLE;
  gpio_config(&gpio_2config);
  gpio_set_level(GPIO_NUM_4,0);
}

static void init_button(void)
{
    gpio_config_t gpio_cfg;
    gpio_cfg.pin_bit_mask=1<<GPIO_NUM_15;
    gpio_cfg.mode=GPIO_MODE_INPUT;
    gpio_cfg.intr_type=GPIO_INTR_POSEDGE;
    gpio_cfg.pull_down_en=GPIO_PULLDOWN_ENABLE;
    gpio_cfg.pull_up_en=GPIO_PULLDOWN_DISABLE;
    gpio_config(&gpio_cfg);
    gpio_install_isr_service(0);

    gpio_isr_handler_add(GPIO_NUM_15,gpio_irq,(void*)GPIO_NUM_15);
    gpio_intr_enable(GPIO_NUM_15);
}

static void set_flash(uint8_t cmd){
  gpio_set_level(GPIO_NUM_4,cmd);
}


static void ISR_gpio_task( void * pvParameters )
{
  for(;;)
    {
    uint32_t io_num;
    if (xQueueReceive(mov_sensor_queue, &io_num, 0)==pdTRUE)
    {
    // set_flash(1);
    // while(xQueueReceive(mov_sensor_queue, &io_num, 0)==pdTRUE){}
    printf("open door\n");
    send_image();
    // set_flash(0);
    vTaskDelay(1000/portTICK_PERIOD_MS);
    }
    
    while(xQueueReceive(mov_sensor_queue, &io_num, 0)==pdTRUE){}
    vTaskDelay(100/portTICK_PERIOD_MS);
    
    }
}



static esp_err_t init_camera(void)
{
    camera_config_t camera_config = {
        .pin_pwdn  = CAM_PIN_PWDN,
        .pin_reset = CAM_PIN_RESET,
        .pin_xclk = CAM_PIN_XCLK,
        .pin_sccb_sda = CAM_PIN_SIOD,
        .pin_sccb_scl = CAM_PIN_SIOC,

        .pin_d7 = CAM_PIN_D7,
        .pin_d6 = CAM_PIN_D6,
        .pin_d5 = CAM_PIN_D5,
        .pin_d4 = CAM_PIN_D4,
        .pin_d3 = CAM_PIN_D3,
        .pin_d2 = CAM_PIN_D2,
        .pin_d1 = CAM_PIN_D1,
        .pin_d0 = CAM_PIN_D0,
        .pin_vsync = CAM_PIN_VSYNC,
        .pin_href = CAM_PIN_HREF,
        .pin_pclk = CAM_PIN_PCLK,

        .xclk_freq_hz = CONFIG_XCLK_FREQ,
        .ledc_timer = LEDC_TIMER_0,
        .ledc_channel = LEDC_CHANNEL_0,

        .pixel_format = PIXFORMAT_JPEG,
        // .pixel_format = PIXFORMAT_GRAYSCALE,
        .frame_size = FRAMESIZE_UXGA,

        .jpeg_quality = 10,
        .fb_count = 1,
        .grab_mode = CAMERA_GRAB_WHEN_EMPTY};//CAMERA_GRAB_LATEST. Sets when buffers should be filled
    esp_err_t err = esp_camera_init(&camera_config);
    if (err != ESP_OK)
    {
        return err;
    }
    return ESP_OK;
}

esp_err_t jpg_stream_httpd_handler(httpd_req_t *req){
    camera_fb_t * fb = NULL;
    esp_err_t res = ESP_OK;
    size_t _jpg_buf_len;
    uint8_t * _jpg_buf;
    char * part_buf[64];
    static int64_t last_frame = 0;
    if(!last_frame) {
        last_frame = esp_timer_get_time();
    }

    res = httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
    if(res != ESP_OK){
        return res;
    }

    while(true){
        fb = esp_camera_fb_get();
        if (!fb) {
            ESP_LOGE(TAG, "Camera capture failed");
            res = ESP_FAIL;
            break;
        }
        if(fb->format != PIXFORMAT_JPEG){
            bool jpeg_converted = frame2jpg(fb, 80, &_jpg_buf, &_jpg_buf_len);
            if(!jpeg_converted){
                ESP_LOGE(TAG, "JPEG compression failed");
                esp_camera_fb_return(fb);
                res = ESP_FAIL;
            }
        } else {
            _jpg_buf_len = fb->len;
            _jpg_buf = fb->buf;
        }

        if(res == ESP_OK){
            res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY));
        }
        if(res == ESP_OK){
            size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, _jpg_buf_len);

            res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
        }
        if(res == ESP_OK){
            res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
        }
        if(fb->format != PIXFORMAT_JPEG){
            free(_jpg_buf);
        }
        esp_camera_fb_return(fb);
        if(res != ESP_OK){
            break;
        }
        int64_t fr_end = esp_timer_get_time();
        int64_t frame_time = fr_end - last_frame;
        last_frame = fr_end;
        frame_time /= 1000;
        ESP_LOGI(TAG, "MJPG: %uKB %ums (%.1ffps)",
            (uint32_t)(_jpg_buf_len/1024),
            (uint32_t)frame_time, 1000.0 / (uint32_t)frame_time);
    }

    printf("jpg_stream_httpd_handler return\n");
    last_frame = 0;
    return res;
}


httpd_handle_t setup_server(void)
{
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    httpd_handle_t stream_httpd  = NULL;

    if (httpd_start(&stream_httpd , &config) == ESP_OK)
    {
        httpd_register_uri_handler(stream_httpd , &uri_get);
    }

    return stream_httpd;
}
