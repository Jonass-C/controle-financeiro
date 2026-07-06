package br.edu.ufop.controlefinanceiro.repository;

import br.edu.ufop.controlefinanceiro.domain.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransacaoRepository extends JpaRepository<Transacao, Integer> {
    Optional<Transacao> findByIdAndUsuarioId(Integer id, Integer usuarioId);
    List<Transacao> findByUsuarioIdOrderByDataDesc(Integer usuarioId);
    int countByCategoriaIdAndUsuarioId(Integer categoriaId, Integer usuarioId);
}
