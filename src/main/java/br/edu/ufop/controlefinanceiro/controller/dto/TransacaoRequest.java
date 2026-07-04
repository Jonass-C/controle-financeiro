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
public class TransacaoRequest {
    @NotBlank(message = "Informe o título da transação.")
    @Size(max = 255, message = "O título deve ter no máximo 255 caracteres.")
    private String titulo;

    @NotNull(message = "Informe a data da transação.")
    private LocalDate data;

    @NotNull(message = "Informe o valor da transação.")
    private Double valor;

    @NotNull(message = "Informe o tipo da transação.")
    private Tipo tipo;

    @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres.")
    private String descricao;

    @NotBlank(message = "Informe o nome da categoria.")
    private String categoriaNome;

    // TODO: remover este atributo daqui e fazer a autenticação/sessão seguindo boas práticas de segurança
    @NotNull(message = "O ID do usuário é obrigatório.")
    private Integer usuarioId;
}
