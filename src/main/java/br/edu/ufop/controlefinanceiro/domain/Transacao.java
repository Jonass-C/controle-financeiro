package br.edu.ufop.controlefinanceiro.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "transacao")

public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @NotBlank(message = "Informe o título da transação.")
    @Size(max = 255, message = "O título deve ter no máximo 255 caracteres.")
    @Column(name = "titulo", nullable = false, length = 255)
    private String titulo;

    @NotBlank(message = "Informe a data da transação.")
    @Column(name = "data", nullable = false)
    private LocalDateTime data;

    @NotBlank(message = "Informe o valor da transação.")
    @Column(name = "valor", nullable = false)
    private Double valor;

    @NotBlank(message = "Informe a categoria da transação.")
    @Size(max = 64, message = "A categoria deve ter no máximo 64 caracteres.")
    @Column(name = "categoria", nullable = false, length = 64)
    private String categoria;

    @NotBlank(message = "Informe o tipo da transação.")
    @Size(max = 30, message = "O tipo deve ter no máximo 30 caracteres.")
    @Column(name = "tipo", nullable = false, length = 30)
    private String tipo;

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;
}
