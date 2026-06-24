CREATE TABLE transacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    valor REAL NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    descricao VARCHAR(255) DEFAULT NULL,
    categoria_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);