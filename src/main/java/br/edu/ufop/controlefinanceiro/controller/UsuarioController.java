package br.edu.ufop.controlefinanceiro.controller;

import br.edu.ufop.controlefinanceiro.controller.dto.CadastroRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.LoginRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.UsuarioResponse;
import br.edu.ufop.controlefinanceiro.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/cadastro")
    public ResponseEntity<UsuarioResponse> cadastrar(@Valid @RequestBody CadastroRequest request) {
        UsuarioResponse response = usuarioService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody LoginRequest request) {
        UsuarioResponse response = usuarioService.autenticar(request);
        return ResponseEntity.ok(response);
    }
}
