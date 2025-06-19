package com.saltoit.farmapp.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.saltoit.farmapp")
public class FarmappApplication {
   public static void main(String[] args) {
      SpringApplication.run(FarmappApplication.class, args);
   }
}
