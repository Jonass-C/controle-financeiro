package br.edu.ufop.controlefinanceiro.controller;

import br.edu.ufop.controlefinanceiro.exception.RegraDeNegocioException;
import br.edu.ufop.controlefinanceiro.controller.dto.UsuarioCadastroRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.UsuarioLoginRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.UsuarioResponse;
import br.edu.ufop.controlefinanceiro.domain.Usuario;
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
    public ResponseEntity<String> cadastrar(@Valid @RequestBody UsuarioCadastroRequest request) {
        usuarioService.cadastrarUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody UsuarioLoginRequest request) {
        try {
            Usuario usuarioLogado = usuarioService.autenticarUsuario(request);

            UsuarioResponse response = new UsuarioResponse(
                    usuarioLogado.getId(),
                    usuarioLogado.getIdentificadorLogin()
            );

            return ResponseEntity.ok(response);

        } catch (RegraDeNegocioException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
