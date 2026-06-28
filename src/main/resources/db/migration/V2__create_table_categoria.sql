CREATE TABLE categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(64) NOT NULL,
    usuario_id INTEGER DEFAULT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

INSERT INTO categoria(nome)
VALUES ('Alimentação'),
       ('Moradia'),
       ('Transporte'),
       ('Saúde'),
       ('Educação'),
       ('Lazer'),
       ('Compras'),
       ('Salário'),
       ('Investimentos');