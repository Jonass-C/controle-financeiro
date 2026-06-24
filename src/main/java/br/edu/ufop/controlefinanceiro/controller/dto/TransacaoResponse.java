package br.edu.ufop.controlefinanceiro.controller.dto;

import br.edu.ufop.controlefinanceiro.domain.enums.Tipo;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class TransacaoResponse {
    private Integer id;
    private String titulo;
    private LocalDate data;
    private Double valor;
    private Tipo tipo;
    private String descricao;
    private Integer categoriaId;
    private Integer usuarioId;
}
