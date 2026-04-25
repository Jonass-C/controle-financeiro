package br.edu.ufop.controlefinanceiro.service;

import br.edu.ufop.controlefinanceiro.domain.Usuario;
import br.edu.ufop.controlefinanceiro.repository.UsuarioRepository;
import br.edu.ufop.controlefinanceiro.security.CryptoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CryptoService cryptoService;

    public void cadastrarUsuario(String identificadorLogin, String senhaPura, String confirmacaoSenha) {
        if (!senhaPura.equals(confirmacaoSenha)) {
            throw new IllegalArgumentException("Erro: senhas incorretas.");
        }

        if (usuarioRepository.existsByIdentificadorLogin(identificadorLogin)) {
            throw new IllegalArgumentException("Erro: já existe um usuário com esse identificador.");
        }

        String salt = cryptoService.gerarSalt();
        String hashSenha = cryptoService.hashSenha(senhaPura, salt);

        Usuario usuario = Usuario.builder()
                .identificadorLogin(identificadorLogin)
                .hashSenha(hashSenha)
                .salt(salt)
                .build();

        usuarioRepository.save(usuario);
    }

    public Usuario autenticarUsuario(String identificadorLogin, String senhaPura) {
        Usuario usuario = usuarioRepository.findByIdentificadorLogin(identificadorLogin)
                .orElseThrow(() -> new IllegalArgumentException("Erro: identificador ou senhas incorretos."));

        boolean senhaCorreta = cryptoService.verificarSenha(senhaPura, usuario.getHashSenha(), usuario.getSalt());
        if (!senhaCorreta) {
            throw new IllegalArgumentException("Erro: identificador ou senhas incorretos.");
        }

        return usuario;
    }
}
