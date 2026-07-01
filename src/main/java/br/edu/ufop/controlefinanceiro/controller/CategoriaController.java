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
    public ResponseEntity<List<CategoriaResponse>> listarEmTransacao(@RequestParam Integer idUsuario) {
        List<CategoriaResponse> categorias = categoriaService.listarEmTransacao(idUsuario);
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/gestao")
    public ResponseEntity<List<CategoriaResponseGestao>> listarEmGestao(@RequestParam Integer idUsuario) {
        List<CategoriaResponseGestao> categorias = categoriaService.listarEmGestao(idUsuario);
        return ResponseEntity.ok(categorias);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> editar(@PathVariable("id") Integer idCategoria, @Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse response = categoriaService.editar(idCategoria, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Integer idCategoria, @RequestParam Integer idUsuario) {
        categoriaService.excluir(idCategoria, idUsuario);
        return ResponseEntity.noContent().build();
    }
}
