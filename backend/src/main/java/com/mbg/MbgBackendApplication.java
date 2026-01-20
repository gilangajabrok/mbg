package com.mbg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MbgBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MbgBackendApplication.class, args);
    }
}
