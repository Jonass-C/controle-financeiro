package br.edu.ufop.controlefinanceiro.service;

import br.edu.ufop.controlefinanceiro.controller.dto.CadastroRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.LoginRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.UsuarioResponse;
import br.edu.ufop.controlefinanceiro.domain.Usuario;
import br.edu.ufop.controlefinanceiro.exception.RegraDeNegocioException;
import br.edu.ufop.controlefinanceiro.repository.UsuarioRepository;
import br.edu.ufop.controlefinanceiro.security.CryptoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CryptoService cryptoService;
    @Value("${app.security.dev-mode:false}")
    private boolean devMode;


    public UsuarioResponse cadastrar(CadastroRequest request) {
        int tamanhoMinimo = devMode ? 1 : 6;
        if (request.getSenhaPura().length() < tamanhoMinimo) {
            throw new RegraDeNegocioException("A senha deve conter no mínimo " + tamanhoMinimo + " caracteres.");
        }

        if (!request.getSenhaPura().equals(request.getConfirmacaoSenha())) {
            throw new RegraDeNegocioException("As senhas não coincidem.");
        }

        if (usuarioRepository.existsByIdentificadorLogin(request.getIdentificadorLogin())) {
            throw new RegraDeNegocioException("Já existe um usuário com esse identificador.");
        }

        String salt = cryptoService.gerarSalt();
        String hashSenha = cryptoService.hashSenha(request.getSenhaPura(), salt);

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .identificadorLogin(request.getIdentificadorLogin())
                .hashSenha(hashSenha)
                .salt(salt)
                .build();

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return new UsuarioResponse(usuarioSalvo.getId(), usuarioSalvo.getIdentificadorLogin());
    }

    public UsuarioResponse autenticar(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByIdentificadorLogin(request.getIdentificadorLogin())
                .orElseThrow(() -> new RegraDeNegocioException("Identificador ou senha incorretos."));

        boolean senhaCorreta = cryptoService.verificarSenha(request.getSenhaPura(), usuario.getHashSenha(), usuario.getSalt());
        if (!senhaCorreta) {
            throw new RegraDeNegocioException("Identificador ou senha incorretos.");
        }

        return new UsuarioResponse(usuario.getId(), usuario.getIdentificadorLogin());
    }
}
