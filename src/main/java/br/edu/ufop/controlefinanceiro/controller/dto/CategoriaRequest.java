package br.edu.ufop.controlefinanceiro.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoriaRequest {
    @NotBlank(message = "Informe o nome da categoia.")
    @Size(max = 64, message = "A categoria deve ter no máximo 64 caracteres.")
    private String nome;
}
