CREATE TABLE transacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    valor REAL NOT NULL,
    categoria VARCHAR(64) NOT NULL,
    tipo VARCHAR(30) NOT NULL, -- 30 caso haja adições futuras
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);