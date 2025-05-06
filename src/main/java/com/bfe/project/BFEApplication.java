package com.bfe.project;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.bfe.project.mapper")
public class BFEApplication {
    public static void main(String[] args) {
        SpringApplication.run(BFEApplication.class, args);
    }
}
