package br.edu.ufop.controlefinanceiro.service;

import br.edu.ufop.controlefinanceiro.domain.Transacao;
import br.edu.ufop.controlefinanceiro.exception.RegraDeNegocioException;
import br.edu.ufop.controlefinanceiro.repository.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;

    public void criarTransacao(String titulo, LocalDateTime data, Double valor, String categoria, String tipo, Integer usuarioId){
        if(data.isAfter(LocalDateTime.now().plusYears(1))){
            throw new RegraDeNegocioException("A data não pode ser mais distante que um ano.");
        }
        if(valor <= 0.0){
            throw new RegraDeNegocioException("O valor deve ser positivo.");
        }

        if(!transacaoRepository.existsByCategoria(categoria)){
            throw new RegraDeNegocioException("Selecione uma categoria existente.");
        }

        if(!transacaoRepository.existsByTipo(tipo)){
            throw new RegraDeNegocioException("Selecione um tipo existente.");
        }

        if(!transacaoRepository.existsByUsuarioId(usuarioId)){
            throw new RegraDeNegocioException("Usuário inexistente.");
        }

        Transacao transacao = Transacao.builder()
                .titulo(titulo)
                .data(data)
                .valor(valor)
                .categoria(categoria)
                .tipo(tipo)
                .usuarioId(usuarioId)
                .build();

        transacaoRepository.save(transacao);
    }

    public void editarTransacao(String idString, Transacao transacao){
        Integer id = converterEValidarId(idString);
        Transacao transacaoAux = transacaoRepository.findTransacaoById(id);
    }

    public void excluirTransacao(String idString){
        Integer id = converterEValidarId(idString);
        Transacao transacao = transacaoRepository.findTransacaoById(id);

        transacaoRepository.delete(transacao);
    }

    private Integer converterEValidarId(String idString) {
        try {
            Integer id = Integer.valueOf(idString);
            if (id <= 0) {
                throw new RegraDeNegocioException("O ID deve ser um número maior que zero.");
            }
            return id;
        } catch (NumberFormatException e) {
            throw new RegraDeNegocioException("O ID deve ser numérico e não conter letras.");
        }
    }
}