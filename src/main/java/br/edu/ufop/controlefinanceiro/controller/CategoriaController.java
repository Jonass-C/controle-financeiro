package br.edu.ufop.controlefinanceiro.controller;

import br.edu.ufop.controlefinanceiro.controller.dto.CategoriaRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.CategoriaResponse;
import br.edu.ufop.controlefinanceiro.controller.dto.CategoriaResponseGestao;
import br.edu.ufop.controlefinanceiro.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @PostMapping
    public ResponseEntity<CategoriaResponse> criar(@Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse response = categoriaService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listarEmTransacao(@RequestParam Integer usuarioId) {
        List<CategoriaResponse> response = categoriaService.listarEmTransacao(usuarioId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/gestao")
    public ResponseEntity<List<CategoriaResponseGestao>> listarEmGestao(@RequestParam Integer usuarioId) {
        List<CategoriaResponseGestao> response = categoriaService.listarEmGestao(usuarioId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> editar(@PathVariable("id") Integer categoriaId, @Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse response = categoriaService.editar(categoriaId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Integer categoriaId, @RequestParam Integer usuarioId) {
        categoriaService.excluir(categoriaId, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
