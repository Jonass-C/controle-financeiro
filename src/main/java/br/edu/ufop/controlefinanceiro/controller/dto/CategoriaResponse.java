package br.edu.ufop.controlefinanceiro.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoriaResponse {
    private Integer id;
    private String nome;
    private Integer usuarioId;
}
