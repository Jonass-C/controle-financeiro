package br.edu.ufop.controlefinanceiro.repository;

import br.edu.ufop.controlefinanceiro.domain.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Integer> {
    List<Transacao> findByUsuarioIdOrderByDataDesc(Integer idUsuario);

    // TODO: Implementar métodos findByIdAndUsuarioId() na Sprint de Segurança para blindagem multi-tenant
}
