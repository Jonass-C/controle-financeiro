package br.edu.ufop.controlefinanceiro.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsuarioResponse {

    private Integer id;
    private String identificadorLogin;
}
