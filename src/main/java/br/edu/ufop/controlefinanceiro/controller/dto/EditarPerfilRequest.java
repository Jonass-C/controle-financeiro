package br.edu.ufop.controlefinanceiro.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditarPerfilRequest {

    @NotBlank(message = "Informe o seu novo nome.")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
    private String nome;

    @NotBlank(message = "O novo identificador de login é obrigatório.")
    @Size(max = 255, message = "O identificador de login deve ter no máximo 255 caracteres.")
    private String identificadorLogin;
}
