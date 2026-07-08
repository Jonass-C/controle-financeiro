package br.edu.ufop.controlefinanceiro.controller;

import br.edu.ufop.controlefinanceiro.controller.dto.*;
import br.edu.ufop.controlefinanceiro.domain.Usuario;
import br.edu.ufop.controlefinanceiro.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioResponse> editarPerfil(@Valid @RequestBody EditarPerfilRequest request, @AuthenticationPrincipal Usuario usuarioLogado) {
    UsuarioResponse response = usuarioService.editarPerfil(request, usuarioLogado.getId());
    return ResponseEntity.ok(response);
    }

    @PutMapping("/senha")
    public ResponseEntity<UsuarioResponse> alterarSenha(@Valid @RequestBody AlterarSenhaRequest request, @AuthenticationPrincipal Usuario usuarioLogado) {
        usuarioService.alterarSenha(request, usuarioLogado.getId());
        return ResponseEntity.noContent().build();
    }
}
