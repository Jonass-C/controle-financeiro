package br.edu.ufop.controlefinanceiro.repository;

import br.edu.ufop.controlefinanceiro.domain.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    // lista as categorias globais e as do usuário (será usada na lista dentro de nova transação)
    @Query("SELECT c FROM Categoria c WHERE c.usuario IS NULL OR c.usuario.id = :usuarioId ORDER BY c.usuario.id ASC, c.nome ASC")
    List<Categoria> buscarGlobaisEPersonalizadas(@Param("usuarioId") Integer usuarioId);

    // lista apenas as categorias do usuário (será usada na lista dentro de gestão de categorias)
    @Query("SELECT c FROM Categoria c WHERE c.usuario.id = :usuarioId ORDER BY c.nome ASC")
    List<Categoria> buscarPersonalizadasDoUsuario(@Param("usuarioId") Integer usuarioId);

    // verifica se já existe categoria com o mesmo nome para o mesmo usuário
    boolean existsByNomeIgnoreCaseAndUsuarioId(String nome, Integer usuarioId);

    @Query("SELECT c FROM Categoria c WHERE LOWER(c.nome) = LOWER(:nome) AND (c.usuario.id = :usuarioId OR c.usuario IS NULL)")
    Optional<Categoria> buscarPorNomeEUsuario(@Param("nome") String nome, @Param("usuarioId") Integer usuarioId);
}
