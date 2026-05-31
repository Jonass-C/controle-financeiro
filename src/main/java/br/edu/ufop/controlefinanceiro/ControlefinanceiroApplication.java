package br.edu.ufop.controlefinanceiro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ControlefinanceiroApplication {

	public static void main(String[] args) {
		SpringApplication.run(ControlefinanceiroApplication.class, args);
		System.out.println("http://localhost:8080");
	}

}
