package br.edu.ufop.controlefinanceiro.controller.dto;

import br.edu.ufop.controlefinanceiro.domain.enums.Tipo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TransacaoFormRequest {
    @NotBlank(message = "Informe o título da transação.")
    @Size(max = 255, message = "O título deve ter no máximo 255 caracteres.")
    private String titulo;

    @NotNull(message = "Informe a data da transação.")
    private LocalDate data;

    @NotNull(message = "Informe o valor da transação.")
    private Double valor;

    @NotBlank(message = "Informe a categoria da transação.")
    @Size(max = 64, message = "A categoria deve ter no máximo 64 caracteres.")
    private String categoria;

    @NotNull(message = "Informe o tipo da transação.")
    private Tipo tipo;

    @NotNull(message = "O ID do usuário é obrigatório.")
    private Integer usuarioId;

    @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres.")
    private String descricao;
}
