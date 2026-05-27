package br.edu.ufop.controlefinanceiro.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @NotBlank(message = "Informe o seu nome.")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "O identificador de login é obrigatório.")
    @Size(max = 255, message = "O identificador de login deve ter no máximo 255 caracteres.")
    @Column(name = "identificador_login", nullable = false, unique = true, length = 255)
    private String identificadorLogin;

    @Column(name = "hash_senha", nullable = false, length = 64)
    private String hashSenha;

    @Column(nullable = false, length = 32)
    private String salt;
}
