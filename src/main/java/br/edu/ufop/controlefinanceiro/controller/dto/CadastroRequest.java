package br.edu.ufop.controlefinanceiro.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CadastroRequest {

    @NotBlank(message = "Informe o seu nome.")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
    private String nome;

    @NotBlank(message = "O identificador de login é obrigatório.")
    @Size(max = 255, message = "O identificador de login deve ter no máximo 255 caracteres.")
    private String identificadorLogin;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String senhaPura;

    @NotBlank(message = "A confirmação de senha é obrigatória.")
    private String confirmacaoSenha;
}
