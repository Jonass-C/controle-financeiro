package br.edu.ufop.controlefinanceiro.repository;

import br.edu.ufop.controlefinanceiro.domain.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    // lista as categorias personalizadas do usuário + as globais (definidas na migration V2)
    List<Categoria> findByUsuarioIdOrUsuarioIsNull(Long usuarioId);

    // garante que o usuário só mexa no que é dele (ou global)
    Optional<Categoria> findByIdAndUsuarioIdOrUsuarioIsNull(Long id, Long usuarioId);

    // verifica se já existe categoria com o mesmo nome para o mesmo usuário
    boolean existsByNomeIgnoreCaseAndUsuarioId(String nome, Long usuarioId);

    // busca categoria pelo nome no escopo do usuário para o Find-or-Create
    Optional<Categoria> findByNomeIgnoreCaseAndUsuarioIdOrUsuarioIsNull(String nome, Long usuarioId);
}
