package br.edu.ufop.controlefinanceiro.service;

import br.edu.ufop.controlefinanceiro.controller.dto.CategoriaRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.CategoriaResponse;
import br.edu.ufop.controlefinanceiro.controller.dto.CategoriaResponseGestao;
import br.edu.ufop.controlefinanceiro.domain.Categoria;
import br.edu.ufop.controlefinanceiro.domain.Usuario;
import br.edu.ufop.controlefinanceiro.exception.RegraDeNegocioException;
import br.edu.ufop.controlefinanceiro.repository.CategoriaRepository;
import br.edu.ufop.controlefinanceiro.repository.TransacaoRepository;
import br.edu.ufop.controlefinanceiro.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final TransacaoRepository transacaoRepository;

    public void gerarCategoriasPadrao(Usuario usuario) {
        List<String> nomesPadrao = List.of(
                "Alimentação", "Compras", "Educação", "Investimentos",
                "Lazer", "Moradia", "Salário", "Saúde", "Transporte"
        );

        List<Categoria> categoriasPadrao = nomesPadrao.stream()
                .map(nome -> Categoria.builder()
                        .nome(nome)
                        .usuario(usuario)
                        .build())
                .toList();

        categoriaRepository.saveAll(categoriasPadrao);
    }

    public CategoriaResponse criar(CategoriaRequest request, Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraDeNegocioException("Usuário não encontrado"));

        if (categoriaRepository.existsByNomeIgnoreCaseAndUsuarioId(request.getNome().trim(), usuarioId)) {
            throw new RegraDeNegocioException("Categoria já existente.");
        }

        Categoria categoria = Categoria.builder()
                .nome(request.getNome().trim())
                .usuario(usuario)
                .build();

        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return converterParaResponse(categoriaSalva);
    }

    public List<CategoriaResponse> listarEmTransacao(Integer usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RegraDeNegocioException("Usuário não encontrado.");
        }

        List<Categoria> categorias = categoriaRepository.findByUsuarioIdOrderByNomeAsc(usuarioId);
        List<CategoriaResponse> listaResponse = new ArrayList<>();

        for (Categoria categoria: categorias) {
            listaResponse.add(converterParaResponse(categoria));
        }

        return listaResponse;
    }

    public List<CategoriaResponseGestao> listarEmGestao(Integer usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RegraDeNegocioException("Usuário não encontrado.");
        }

        List<Categoria> categorias = categoriaRepository.findByUsuarioIdOrderByNomeAsc(usuarioId);
        List<CategoriaResponseGestao> listaResponse = new ArrayList<>();

        for (Categoria categoria: categorias) {
            listaResponse.add(converterParaResponseGestao(categoria, transacaoRepository.countByCategoriaIdAndUsuarioId(categoria.getId(), usuarioId)));
        }

        return listaResponse;
    }

    public CategoriaResponse editar(Integer categoriaId, CategoriaRequest request, Integer usuarioId) {
        Categoria categoria = categoriaRepository.findByIdAndUsuarioId(categoriaId, usuarioId)
                .orElseThrow(() -> new RegraDeNegocioException("Categoria não encontrada."));

        if (!categoria.getNome().equalsIgnoreCase(request.getNome())) {
            if (categoriaRepository.existsByNomeIgnoreCaseAndUsuarioId(request.getNome().trim(), usuarioId)) {
                throw new RegraDeNegocioException("Você já possui uma categoria com este nome.");
            }
        }

        categoria.setNome(request.getNome().trim());

        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return converterParaResponse(categoriaSalva);
    }

    @Transactional
    public void excluir(Integer categoriaId, Integer transferirPara, Integer usuarioId) {
        Categoria categoria = categoriaRepository.findByIdAndUsuarioId(categoriaId, usuarioId)
                .orElseThrow(() -> new RegraDeNegocioException("Categoria não encontrada."));

        if (transferirPara != null) {
            if (!categoriaRepository.existsByIdAndUsuarioId(transferirPara, usuarioId)) {
                throw new RegraDeNegocioException("Categoria de destino não encontrada.");
            }
            transacaoRepository.transferirTransacoesDeCategoria(categoriaId, transferirPara, usuarioId);
        }

        if (transacaoRepository.countByCategoriaIdAndUsuarioId(categoriaId, usuarioId) > 0) {
            throw new RegraDeNegocioException("Não é possível excluir: existem transações vinculadas a esta categoria.");
        }

        categoriaRepository.delete(categoria);
    }

    private CategoriaResponse converterParaResponse(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNome(),
                categoria.getUsuario().getId()
        );
    }

    private CategoriaResponseGestao converterParaResponseGestao(Categoria categoria, int numTransacoes) {
        return new CategoriaResponseGestao(
                categoria.getId(),
                categoria.getNome(),
                categoria.getUsuario().getId(),
                numTransacoes
        );
    }
}
