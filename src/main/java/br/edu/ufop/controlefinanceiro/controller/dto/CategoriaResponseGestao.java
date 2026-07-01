package br.edu.ufop.controlefinanceiro.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoriaResponseGestao {
    private Integer id;
    private String nome;
    private Integer usuarioId;
    private int quantidadeTransacoes;
}
