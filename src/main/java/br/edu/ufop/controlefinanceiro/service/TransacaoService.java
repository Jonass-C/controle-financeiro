package br.edu.ufop.controlefinanceiro.service;

import br.edu.ufop.controlefinanceiro.controller.dto.TransacaoFormRequest;
import br.edu.ufop.controlefinanceiro.controller.dto.TransacaoResponse;
import br.edu.ufop.controlefinanceiro.domain.Transacao;
import br.edu.ufop.controlefinanceiro.exception.RegraDeNegocioException;
import br.edu.ufop.controlefinanceiro.repository.TransacaoRepository;
import br.edu.ufop.controlefinanceiro.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public void criarTransacao(TransacaoFormRequest request){
        validarDataEValor(request.getData(), request.getValor());

        if(!usuarioRepository.existsById(request.getUsuarioId())) {
            throw new RegraDeNegocioException("Usuário inexistente.");
        }

        Transacao transacao = Transacao.builder()
                .titulo(request.getTitulo())
                .data(request.getData())
                .valor(request.getValor())
                .tipo(request.getTipo())
                .descricao(request.getDescricao())
                .categoriaId(request.getCategoriaId())
                .usuarioId(request.getUsuarioId())
                .build();

        transacaoRepository.save(transacao);
    }

    public void excluirTransacao(Integer idTransacao){
        transacaoRepository.deleteById(idTransacao);
    }

    public void editarTransacao(Integer id, @Valid TransacaoFormRequest request){
        validarDataEValor(request.getData(), request.getValor());

        if(!usuarioRepository.existsById(request.getUsuarioId())) {
            throw new RegraDeNegocioException("Usuário inexistente.");
        }
        Transacao transacao = transacaoRepository.findById(id)
                .orElseThrow(()->new RegraDeNegocioException("Transação não existe."));

        transacao.setTitulo(request.getTitulo());
        transacao.setData(request.getData());
        transacao.setValor(request.getValor());
        transacao.setTipo(request.getTipo());
        transacao.setDescricao(request.getDescricao());
        transacao.setCategoriaId(request.getCategoriaId());

        transacaoRepository.save(transacao);
    }

    public List<TransacaoResponse> listarTransacao(Integer idUsuario) {
        if (!usuarioRepository.existsById(idUsuario)) {
            throw new RegraDeNegocioException("Usuário inexistente.");
        }

        List<Transacao> transacoes = transacaoRepository.findTransacaoByUsuarioId(idUsuario);
        List<TransacaoResponse> listaResponse = new ArrayList<>();

        for (Transacao transacao : transacoes) {
            listaResponse.add(converterParaResponse(transacao));
        }

        return listaResponse;
    }

    private TransacaoResponse converterParaResponse(Transacao transacao) {
        return new TransacaoResponse(
                transacao.getId(),
                transacao.getTitulo(),
                transacao.getData(),
                transacao.getValor(),
                transacao.getTipo(),
                transacao.getDescricao(),
                transacao.getCategoriaId(),
                transacao.getUsuarioId()
        );
    }

    public void validarDataEValor(LocalDate data, double valor){
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
}