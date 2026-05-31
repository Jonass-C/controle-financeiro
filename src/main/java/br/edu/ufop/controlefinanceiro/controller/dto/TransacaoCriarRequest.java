package br.edu.ufop.controlefinanceiro.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TransacaoCriarRequest {
    @NotBlank(message = "Informe o título da transação.")
    @Size(max = 255, message = "O título deve ter no máximo 255 caracteres.")
    private String titulo;

    @NotBlank(message = "Informe a data da transação.")
    private LocalDateTime data;

    @NotBlank(message = "Informe o valor da transação.")
    private Double valor;

    @NotBlank(message = "Informe a categoria da transação.")
    @Size(max = 64, message = "A categoria deve ter no máximo 64 caracteres.")
    private String categoria;

    @NotBlank(message = "Informe o tipo da transação.")
    @Size(max = 30, message = "O tipo deve ter no máximo 30 caracteres.")
    private String tipo;

    private Integer usuarioId;
}
