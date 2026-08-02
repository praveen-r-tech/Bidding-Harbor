package com.praveen.biddingharbor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BiddingHarborBackendApplication
{
	public static void main(String[] args) {
		SpringApplication.run(BiddingHarborBackendApplication.class, args);
	}
}
