# Manual de Migrations (Flyway)

Este diretório armazena a evolução do esquema do banco de dados do sistema. O Spring Boot executa esses scripts automaticamente na inicialização da aplicação.

---

## Regras do Flyway

* **Nunca modificar um arquivo `.sql` já executado:** O Flyway calcula um *Checksum* (hash de verificação) de cada arquivo rodado. Caso haja alteração em `V1__create_table_usuario.sql` após ter sido executada, a aplicação irá travar com um erro de **`FlywayException`**.
    * > *Precisa alterar uma coluna? **Crie uma nova migration.***

* **Padrão de Nomenclatura:** Para o Spring reconhecer o script, o nome do arquivo deve seguir rigorosamente a sintaxe:
    ```text
    V<PROXIMO_NUMERO>__<descricao_em_minusculo_separada_por_underline>.sql
    ```
    * > *Observe: a letra **'V'** tem que ser **maiúscula** e **antes da descrição** deve ter **DOIS** underlines.*

## 📖 Para mais informações, consulte a [Documentação Oficial do Flyway](https://documentation.red-gate.com/fd/migrations-271585107.html).