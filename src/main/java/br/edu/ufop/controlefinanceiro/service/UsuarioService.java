package br.edu.ufop.controlefinanceiro.service;

import br.edu.ufop.controlefinanceiro.controller.dto.*;
import br.edu.ufop.controlefinanceiro.domain.Usuario;
import br.edu.ufop.controlefinanceiro.exception.RegraDeNegocioException;
import br.edu.ufop.controlefinanceiro.repository.UsuarioRepository;
import br.edu.ufop.controlefinanceiro.security.PasswordService;
import br.edu.ufop.controlefinanceiro.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordService passwordService;
    private final TokenService tokenService;
    private final CategoriaService categoriaService;

    @Value("${app.security.dev-mode:true}")
    private boolean devMode;

    public UsuarioResponse cadastrar(CadastroRequest request) {
        int tamanhoMinimo = devMode ? 1 : 6;
        if (request.getSenhaPura().length() < tamanhoMinimo) {
            throw new RegraDeNegocioException("A senha deve conter no mínimo " + tamanhoMinimo + " caracteres.");
        }

        if (!request.getSenhaPura().equals(request.getConfirmacaoSenha())) {
            throw new RegraDeNegocioException("As senhas não coincidem.");
        }

        if (usuarioRepository.existsByIdentificadorLogin(request.getIdentificadorLogin().trim())) {
            throw new RegraDeNegocioException("Já existe um usuário com esse identificador.");
        }

        String salt = passwordService.gerarSalt();
        String hashSenha = passwordService.hashSenha(request.getSenhaPura(), salt);

        Usuario usuario = Usuario.builder()
                .nome(request.getNome().trim())
                .identificadorLogin(request.getIdentificadorLogin().trim())
                .hashSenha(hashSenha)
                .salt(salt)
                .build();

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        categoriaService.gerarCategoriasPadrao(usuario);

        String token = tokenService.gerarToken(usuarioSalvo);
        return new UsuarioResponse(usuarioSalvo.getId(), usuarioSalvo.getIdentificadorLogin(), usuarioSalvo.getNome(), token);
    }

    public UsuarioResponse autenticar(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByIdentificadorLogin(request.getIdentificadorLogin().trim())
                .orElseThrow(() -> new RegraDeNegocioException("Identificador ou senha incorretos."));

        boolean senhaCorreta = passwordService.verificarSenha(request.getSenhaPura(), usuario.getHashSenha(), usuario.getSalt());
        if (!senhaCorreta) {
            throw new RegraDeNegocioException("Identificador ou senha incorretos.");
        }

        String token = tokenService.gerarToken(usuario);
        return new UsuarioResponse(usuario.getId(), usuario.getIdentificadorLogin(), usuario.getNome(), token);
    }

    public UsuarioResponse editarPerfil(EditarPerfilRequest request, Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraDeNegocioException("Usuário não encontrado."));

        if (!usuario.getIdentificadorLogin().equals(request.getIdentificadorLogin().trim()) &&
                usuarioRepository.existsByIdentificadorLogin(request.getIdentificadorLogin().trim())) {
            throw new RegraDeNegocioException("Este identificador já está em uso.");
        }

        usuario.setNome(request.getNome().trim());
        usuario.setIdentificadorLogin(request.getIdentificadorLogin().trim());

        usuarioRepository.save(usuario);

        String token = tokenService.gerarToken(usuario);
        return new UsuarioResponse(usuario.getId(), usuario.getIdentificadorLogin(), usuario.getNome(), token);
    }

    public void alterarSenha(AlterarSenhaRequest request, Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraDeNegocioException("Usuário não encontrado"));

        boolean senhaCorreta = passwordService.verificarSenha(request.getSenhaAtual(), usuario.getHashSenha(), usuario.getSalt());
        if (!senhaCorreta) {
            throw new RegraDeNegocioException("A senha atual informada está incorreta.");
        }

        int tamanhoMinimo = devMode ? 1 : 6;
        if (request.getNovaSenha().length() < tamanhoMinimo) {
            throw new RegraDeNegocioException("A senha deve conter no mínimo " + tamanhoMinimo + " caracteres.");
        }

        if (!request.getNovaSenha().equals(request.getConfirmacaoNovaSenha())) {
            throw new RegraDeNegocioException("As senhas não coincidem.");
        }

        String salt = passwordService.gerarSalt();
        String hashSenha = passwordService.hashSenha(request.getNovaSenha(), salt);

        usuario.setSalt(salt);
        usuario.setHashSenha(hashSenha);

        usuarioRepository.save(usuario);
    }
}
