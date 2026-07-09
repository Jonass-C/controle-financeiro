package br.edu.ufop.controlefinanceiro.service;

import br.edu.ufop.controlefinanceiro.controller.dto.TransacaoRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.TransacaoResponse;
import br.edu.ufop.controlefinanceiro.domain.Categoria;
import br.edu.ufop.controlefinanceiro.domain.Transacao;
import br.edu.ufop.controlefinanceiro.domain.Usuario;
import br.edu.ufop.controlefinanceiro.domain.enums.Tipo;
import br.edu.ufop.controlefinanceiro.exception.RegraDeNegocioException;
import br.edu.ufop.controlefinanceiro.repository.CategoriaRepository;
import br.edu.ufop.controlefinanceiro.repository.TransacaoRepository;
import br.edu.ufop.controlefinanceiro.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;

    public TransacaoResponse criar(TransacaoRequest request, Integer usuarioId){
        validarDataEValor(request.getData(), request.getValor());

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraDeNegocioException("Usuário não encontrado."));

        Categoria categoria = categoriaRepository.buscarPorNomeEUsuario(request.getCategoriaNome().trim(), usuarioId)
                .orElseGet(() -> {
                    Categoria novaCategoria = Categoria.builder()
                            .nome(request.getCategoriaNome().trim())
                            .usuario(usuario)
                            .build();
                    return categoriaRepository.save(novaCategoria);
                });

        Transacao transacao = Transacao.builder()
                .titulo(request.getTitulo().trim())
                .data(request.getData())
                .valor(request.getValor())
                .tipo(request.getTipo())
                .descricao(request.getDescricao() != null ? request.getDescricao().trim() : null)
                .categoria(categoria)
                .usuario(usuario)
                .build();

        Transacao transacaoSalva = transacaoRepository.save(transacao);
        return converterParaResponse(transacaoSalva);
    }

    public List<TransacaoResponse> listar(Integer usuarioId, String ordem) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RegraDeNegocioException("Usuário não encontrado.");
        }

        List<Transacao> transacoes;

        if (ordem.equalsIgnoreCase("receitas")) {
            transacoes = transacaoRepository.findByUsuarioIdAndTipoOrderByCriadoEmDesc(usuarioId, Tipo.RECEITA);
        }
        else if (ordem.equalsIgnoreCase("despesas")) {
            transacoes = transacaoRepository.findByUsuarioIdAndTipoOrderByCriadoEmDesc(usuarioId, Tipo.DESPESA);
        }
        else {
            Sort sort = determinarOrdem(ordem);
            transacoes = transacaoRepository.findByUsuarioId(usuarioId, sort);
        }

        List<TransacaoResponse> listaResponse = new ArrayList<>();
        for (Transacao transacao : transacoes) {
            listaResponse.add(converterParaResponse(transacao));
        }

        return listaResponse;
    }

    public TransacaoResponse editar(Integer transacaoId, TransacaoRequest request, Integer usuarioId){
        validarDataEValor(request.getData(), request.getValor());

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraDeNegocioException("Usuário não encontrado."));

        Transacao transacao = transacaoRepository.findByIdAndUsuarioId(transacaoId, usuarioId)
                .orElseThrow(()->new RegraDeNegocioException("Transação não encontrada."));

        Categoria categoria = categoriaRepository.buscarPorNomeEUsuario(request.getCategoriaNome().trim(), usuarioId)
                .orElseGet(() -> {
                    Categoria novaCategoria = Categoria.builder()
                            .nome(request.getCategoriaNome().trim())
                            .usuario(usuario)
                            .build();
                    return categoriaRepository.save(novaCategoria);
                });

        transacao.setTitulo(request.getTitulo().trim());
        transacao.setData(request.getData());
        transacao.setValor(request.getValor());
        transacao.setTipo(request.getTipo());
        transacao.setDescricao(request.getDescricao() != null ? request.getDescricao().trim() : null);
        transacao.setCategoria(categoria);

        Transacao transacaoSalva = transacaoRepository.save(transacao);
        return converterParaResponse(transacaoSalva);
    }

    public void excluir(Integer transacaoId, Integer usuarioId){
        Transacao transacao = transacaoRepository.findByIdAndUsuarioId(transacaoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada."));

        transacaoRepository.delete(transacao);
    }

    private TransacaoResponse converterParaResponse(Transacao transacao) {
        return new TransacaoResponse(
                transacao.getId(),
                transacao.getTitulo(),
                transacao.getData(),
                transacao.getValor(),
                transacao.getTipo(),
                transacao.getDescricao(),
                transacao.getCategoria().getNome(),
                transacao.getUsuario().getId()
        );
    }

    private void validarDataEValor(LocalDate data, double valor){
        if(data.isAfter(LocalDate.now().plusYears(5))) {
            throw new RegraDeNegocioException("A data não pode ser superior a cinco anos.");
        }
        if(data.isBefore(LocalDate.now().minusYears(5))) {
            throw new RegraDeNegocioException("A data não pode ser inferior a cinco anos.");
        }

        if(valor <= 0.0) {
            throw new RegraDeNegocioException("O valor deve ser positivo.");
        }
    }

    private Sort determinarOrdem(String ordem) {
        if (ordem == null || ordem.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "criadoEm");
        }

        return switch (ordem.trim().toLowerCase()) {
            case "recentes" -> Sort.by(Sort.Direction.DESC, "criadoEm");
            case "antigas" -> Sort.by(Sort.Direction.ASC, "criadoEm");
            case "data_desc" -> Sort.by(Sort.Direction.DESC, "data");
            case "data_asc" -> Sort.by(Sort.Direction.ASC, "data");
            case "maior_valor" -> Sort.by(Sort.Direction.DESC, "valor");
            case "menor_valor" -> Sort.by(Sort.Direction.ASC, "valor");
            case "categoria" -> Sort.by(Sort.Direction.ASC, "categoria.nome").and(Sort.by(Sort.Direction.DESC, "data"));
            default -> Sort.by(Sort.Direction.DESC, "criadoEm");
        };
    }
}