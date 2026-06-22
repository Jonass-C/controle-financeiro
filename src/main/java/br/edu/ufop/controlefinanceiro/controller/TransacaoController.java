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
    public ResponseEntity<String> criar(@Valid @RequestBody TransacaoFormRequest request){
        transacaoService.criarTransacao(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Transação cadastrada com sucesso!");
    }

    @GetMapping
    public ResponseEntity<List<TransacaoResponse>> listar(@RequestParam Integer idUsuario){
        List<TransacaoResponse> transacoes = transacaoService.listarTransacao(idUsuario);
        return ResponseEntity.ok(transacoes);
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> editar(@PathVariable Integer id, @Valid @RequestBody TransacaoFormRequest request){
        transacaoService.editarTransacao(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Transação editada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id){
        transacaoService.excluirTransacao(id);
        return ResponseEntity.noContent().build();
    }
}
