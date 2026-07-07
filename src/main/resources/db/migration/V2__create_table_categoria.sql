CREATE TABLE categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(64) NOT NULL,
    usuario_id INTEGER DEFAULT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT uk_categoria_nome_por_usuario UNIQUE (nome, usuario_id)
);

INSERT INTO categoria(nome)
VALUES ('Alimentação'),
       ('Compras'),
       ('Educação'),
       ('Investimentos'),
       ('Lazer'),
       ('Moradia'),
       ('Salário'),
       ('Saúde'),
       ('Transporte');