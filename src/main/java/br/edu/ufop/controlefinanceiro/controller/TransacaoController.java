package br.edu.ufop.controlefinanceiro.controller;

import br.edu.ufop.controlefinanceiro.controller.dto.TransacaoCriarRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.TransacaoExcluirRequest;
import br.edu.ufop.controlefinanceiro.service.TransacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;

    @PostMapping("/criar")
    public ResponseEntity<String> criar(@Valid @RequestBody TransacaoCriarRequest request) {
        transacaoService.criarTransacao(
                request.getTitulo(),
                request.getData(),
                request.getValor(),
                request.getCategoria(),
                request.getTipo(),
                request.getUsuarioId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body("Transação cadastrada com sucesso!");
    }

    @PostMapping("/excluir")
    public ResponseEntity<String> excluir(@Valid @RequestBody TransacaoExcluirRequest request) {
        transacaoService.excluirTransacao(
                request.getIdString()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body("Transação excluida com sucesso!");
    }
}
