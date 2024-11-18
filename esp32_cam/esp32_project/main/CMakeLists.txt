set(srcs "main.c"
	     "connect_wifi.c")
idf_component_register(SRCS ${srcs}
                    INCLUDE_DIRS "."
                    PRIV_REQUIRES driver lcd16x2 nvs_flash esp_wifi esp32-camera-master esp_http_server 
                    esp_timer esp_http_client )

target_compile_options(${COMPONENT_LIB} PRIVATE "-Wno-format")