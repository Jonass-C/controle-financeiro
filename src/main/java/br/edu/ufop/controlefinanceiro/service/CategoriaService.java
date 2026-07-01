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
import jakarta.validation.Valid;
import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final TransacaoRepository transacaoRepository;

    public CategoriaResponse criar(@Valid CategoriaRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RegraDeNegocioException("Usuário não encontrado"));

        if (categoriaRepository.existsByNomeIgnoreCaseAndUsuarioId(request.getNome(), request.getUsuarioId())) {
            throw new RegraDeNegocioException("Categoria já existente.");
        }

        Categoria categoria = Categoria.builder()
                .nome(request.getNome())
                .usuario(usuario)
                .build();

        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return converterParaResponse(categoriaSalva);
    }

    public List<CategoriaResponse> listarEmTransacao(Integer idUsuario) {
        if (!usuarioRepository.existsById(idUsuario)) {
            throw new RegraDeNegocioException("Usuário não encontrado.");
        }

        List<Categoria> categorias = categoriaRepository.buscarGlobaisEPersonalizadas(idUsuario);
        List<CategoriaResponse> listaResponse = new ArrayList<>();

        for (Categoria categoria: categorias) {
            listaResponse.add(converterParaResponse(categoria));
        }

        return listaResponse;
    }

    public List<CategoriaResponseGestao> listarEmGestao(Integer idUsuario) {
        if (!usuarioRepository.existsById(idUsuario)) {
            throw new RegraDeNegocioException("Usuário não encontrado.");
        }

        List<Categoria> categorias = categoriaRepository.buscarPersonalizadasDoUsuario(idUsuario);
        List<CategoriaResponseGestao> listaResponse = new ArrayList<>();

        for (Categoria categoria: categorias) {
            listaResponse.add(converterParaResponseGestao(categoria, transacaoRepository.countByCategoriaIdAndUsuarioId(categoria.getId(), idUsuario)));
        }

        return listaResponse;
    }

    public CategoriaResponse editar(Integer idCategoria, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RegraDeNegocioException("Categoria não encontrada."));

        if (categoria.getUsuario() == null) {
            throw new RegraDeNegocioException("Categorias padrão não podem ser editadas.");
        }

        if (!categoria.getUsuario().getId().equals(request.getUsuarioId())) {
            throw new RegraDeNegocioException("Você não tem permissão para editar esta categoria.");
        }

        if (!categoria.getNome().equalsIgnoreCase(request.getNome())) {
            if (categoriaRepository.existsByNomeIgnoreCaseAndUsuarioId(request.getNome(), request.getUsuarioId())) {
                throw new RegraDeNegocioException("Você já possui uma categoria com este nome.");
            }
        }

        categoria.setNome(request.getNome());

        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return converterParaResponse(categoriaSalva);
    }

    public void excluir(Integer idCategoria, Integer idUsuario) {
        Categoria categoria = categoriaRepository.findById(idCategoria)
                        .orElseThrow(() -> new RegraDeNegocioException("Categoria não encontrada."));

        if (categoria.getUsuario() == null) {
            throw new RegraDeNegocioException("Categorias padrão não podem ser excluídas.");
        }

        if (!categoria.getUsuario().getId().equals(idUsuario)) {
            throw new RegraDeNegocioException("Você não tem permissão para excluir esta categoria.");
        }

        if (transacaoRepository.countByCategoriaIdAndUsuarioId(idCategoria, idUsuario) > 0) {
            throw new RegraDeNegocioException("Não é possível excluir: existem transações vinculadas a esta categoria.");
        }

        categoriaRepository.deleteById(idCategoria);
    }

    private CategoriaResponse converterParaResponse(Categoria categoria) {
        Integer usuarioId = (categoria.getUsuario() != null) ? categoria.getUsuario().getId() : null;
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNome(),
                usuarioId
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
