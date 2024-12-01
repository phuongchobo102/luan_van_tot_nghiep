set(app_src i2c_intf.c)
set(pri_reg )
idf_component_register(SRCS ${app_src}
                    INCLUDE_DIRS "."
                    PRIV_REQUIRES driver esp_timer
                    REQUIRES ${pri_reg})
