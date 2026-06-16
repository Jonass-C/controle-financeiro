package br.edu.ufop.controlefinanceiro.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RegraDeNegocioException.class)
    public ProblemDetail handleRegraDeNegocio(RegraDeNegocioException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidacoes(MethodArgumentNotValidException e) {
        String mensagemErro = e.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getDefaultMessage())
                .findFirst()
                .orElse("Erro de validacao nos campos.");

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, mensagemErro);

        Map<String, String> erros = new HashMap<>();

        e.getFieldErrors().forEach(
                erro -> erros.put(erro.getField(), erro.getDefaultMessage())
        );

        problem.setProperty("erros", erros);
        return problem;
    }

}
