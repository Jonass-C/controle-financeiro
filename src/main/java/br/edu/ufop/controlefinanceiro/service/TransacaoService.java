package br.edu.ufop.controlefinanceiro.service;

import br.edu.ufop.controlefinanceiro.controller.dto.TransacaoCriarRequest;
import br.edu.ufop.controlefinanceiro.domain.Transacao;
import br.edu.ufop.controlefinanceiro.exception.RegraDeNegocioException;
import br.edu.ufop.controlefinanceiro.repository.TransacaoRepository;
import br.edu.ufop.controlefinanceiro.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public void criarTransacao(TransacaoCriarRequest request){
        if(request.getData().isAfter(LocalDate.now().plusYears(5))) {
            throw new RegraDeNegocioException("A data não pode ser superior a cinco anos.");
        }
        if(request.getData().isBefore(LocalDate.now().minusYears(5))) {
            throw new RegraDeNegocioException("A data não pode ser inferior a cinco anos.");
        }

        if(request.getValor() <= 0.0) {
            throw new RegraDeNegocioException("O valor deve ser positivo.");
        }

        if(!transacaoRepository.existsByCategoria(request.getCategoria())) {
            throw new RegraDeNegocioException("Selecione uma categoria existente.");
        }

        if(!usuarioRepository.existsById(request.getUsuarioId())) {
            throw new RegraDeNegocioException("Usuário inexistente.");
        }

        Transacao transacao = Transacao.builder()
                .titulo(request.getTitulo())
                .data(request.getData())
                .valor(request.getValor())
                .categoria(request.getCategoria())
                .tipo(request.getTipo())
                .usuarioId(request.getUsuarioId())
                .descricao(request.getDescricao())
                .build();

        transacaoRepository.save(transacao);
    }

//    public void editarTransacao(String idString, Transacao transacao){
//        Integer id = converterEValidarId(idString);
//        Transacao transacaoAux = transacaoRepository.findTransacaoById(id);
//    }

    public void excluirTransacao(Integer idTransacao){
        transacaoRepository.deleteById(idTransacao);
    }
}