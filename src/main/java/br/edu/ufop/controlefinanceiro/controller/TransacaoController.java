package br.edu.ufop.controlefinanceiro.controller;

import br.edu.ufop.controlefinanceiro.controller.dto.TransacaoFormRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.TransacaoResponse;
import br.edu.ufop.controlefinanceiro.service.TransacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;

    @PostMapping
    public ResponseEntity<TransacaoResponse> criar(@Valid @RequestBody TransacaoFormRequest request){
        TransacaoResponse transacoes = transacaoService.criar(request);
        return ResponseEntity.ok(transacoes);
    }

    @GetMapping
    public ResponseEntity<List<TransacaoResponse>> listar(@RequestParam Integer idUsuario){
        List<TransacaoResponse> transacoes = transacaoService.listar(idUsuario);
        return ResponseEntity.ok(transacoes);
    }
    @PutMapping("/{id}")
    public ResponseEntity<TransacaoResponse> editar(@PathVariable("id") Integer idTransacao, @Valid @RequestBody TransacaoFormRequest request){
        TransacaoResponse response = transacaoService.editar(idTransacao, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Integer idTransacao){
        transacaoService.excluir(idTransacao);
        return ResponseEntity.noContent().build();
    }
}
