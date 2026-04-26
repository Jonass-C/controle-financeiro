package br.edu.ufop.controlefinanceiro.controller.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioLoginRequest {

    @NotBlank(message = "O identificador de login é obrigatório.")
    private String identificadorLogin;

    @NotBlank(message = "A senha é obrigatória.")
    private String senhaPura;
}
