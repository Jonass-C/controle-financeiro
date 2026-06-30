package br.edu.ufop.controlefinanceiro.service;

import br.edu.ufop.controlefinanceiro.controller.dto.UsuarioCadastroRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.UsuarioLoginRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.UsuarioResponse;
import br.edu.ufop.controlefinanceiro.domain.Usuario;
import br.edu.ufop.controlefinanceiro.exception.RegraDeNegocioException;
import br.edu.ufop.controlefinanceiro.repository.UsuarioRepository;
import br.edu.ufop.controlefinanceiro.security.CryptoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CryptoService cryptoService;

    public UsuarioResponse cadastrar(UsuarioCadastroRequest request) {
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

        return new UsuarioResponse(usuarioSalvo.getId(), usuarioSalvo.getIdentificadorLogin(), usuarioSalvo.getNome());
    }

    public UsuarioResponse autenticar(UsuarioLoginRequest request) {
        Usuario usuario = usuarioRepository.findByIdentificadorLogin(request.getIdentificadorLogin())
                .orElseThrow(() -> new RegraDeNegocioException("Identificador ou senha incorretos."));

        boolean senhaCorreta = cryptoService.verificarSenha(request.getSenhaPura(), usuario.getHashSenha(), usuario.getSalt());
        if (!senhaCorreta) {
            throw new RegraDeNegocioException("Identificador ou senha incorretos.");
        }

        return new UsuarioResponse(usuario.getId(), usuario.getIdentificadorLogin(), usuario.getNome());
    }
}
