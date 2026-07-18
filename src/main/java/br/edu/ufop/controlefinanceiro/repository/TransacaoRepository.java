package br.edu.ufop.controlefinanceiro.repository;

import br.edu.ufop.controlefinanceiro.domain.Transacao;
import br.edu.ufop.controlefinanceiro.domain.enums.Tipo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransacaoRepository extends JpaRepository<Transacao, Integer> {
    Optional<Transacao> findByIdAndUsuarioId(Integer id, Integer usuarioId);
    List<Transacao> findByUsuarioId(Integer usuarioId, Sort sort);
    List<Transacao> findByUsuarioIdAndTipoOrderByCriadoEmDesc(Integer usuarioId, Tipo tipo);
    int countByCategoriaIdAndUsuarioId(Integer categoriaId, Integer usuarioId);
}
