package br.edu.ufop.controlefinanceiro.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlterarSenhaRequest {

    @NotBlank(message = "Digite a sua senha atual.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String senhaAtual;

    @NotBlank(message = "Digite a sua nova senha.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String novaSenha;

    @NotBlank(message = "Confirme a sua nova senha.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String confirmacaoNovaSenha;
}
