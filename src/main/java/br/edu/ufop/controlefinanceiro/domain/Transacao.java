package br.edu.ufop.controlefinanceiro.domain;

import br.edu.ufop.controlefinanceiro.domain.enums.Tipo;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

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

    @NotNull(message = "Informe a data da transação.")
    @Column(name = "data", nullable = false)
    private LocalDate data;

    @NotNull(message = "Informe o valor da transação.")
    @Column(name = "valor", nullable = false)
    private Double valor;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 30)
    private Tipo tipo;

    @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres.")
    @Column(name = "descricao", length = 255)
    private String descricao;

    @Column(name = "categoria_id", nullable = false)
    private Integer categoriaId;

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;
}
