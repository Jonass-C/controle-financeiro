package br.edu.ufop.controlefinanceiro.repository;

import br.edu.ufop.controlefinanceiro.domain.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    Optional<Categoria> findByIdAndUsuarioId(Integer id, Integer usuarioId);

    @Query("SELECT c FROM Categoria c WHERE LOWER(c.nome) = LOWER(:nome) AND c.usuario.id = :usuarioId")
    Optional<Categoria> buscarPorNomeEUsuario(@Param("nome") String nome, @Param("usuarioId") Integer usuarioId);

    List<Categoria> findByUsuarioIdOrderByNomeAsc(Integer usuarioId);
    boolean existsByNomeIgnoreCaseAndUsuarioId(String nome, Integer usuarioId);

    boolean existsByIdAndUsuarioId(Integer id, Integer usuarioId);
}
