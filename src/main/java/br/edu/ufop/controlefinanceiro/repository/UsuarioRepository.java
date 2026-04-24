package br.edu.ufop.controlefinanceiro.repository;

import br.edu.ufop.controlefinanceiro.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByIdentificadorLogin(String identificadorLogin);
    boolean existsByIdentificadorLogin(String identificadorLogin);
}
