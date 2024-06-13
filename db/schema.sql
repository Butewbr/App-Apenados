CREATE TABLE Pessoa (
    cpf VARCHAR(11) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE Policial (
    matricula VARCHAR(50) PRIMARY KEY,
    cpf_pessoa VARCHAR(11) UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    FOREIGN KEY (cpf_pessoa) REFERENCES Pessoa(cpf)
);

CREATE TABLE Endereco (
    id SERIAL PRIMARY KEY,
    rua VARCHAR(250),
    numero INT,
    complemento VARCHAR(250),
    cep INT,
    estado VARCHAR(250),
    municipio VARCHAR(250)
);

CREATE TABLE ArtigoPenal (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(1000) NOT NULL
);

CREATE TABLE Crime (
    id SERIAL PRIMARY KEY,
    data_ocorrido DATE,
    descricao VARCHAR(1000),
    id_artigo_penal INT REFERENCES ArtigoPenal(id)
);

CREATE TABLE Apenado (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) UNIQUE,
    id_endereco INT REFERENCES Endereco(id),
    id_crime INT REFERENCES Crime(id),
    Relevancia INT,
    Data_fim_liberdade DATE,
    FOREIGN KEY (cpf) REFERENCES Pessoa(cpf)
);

CREATE TABLE Visita (
    id SERIAL PRIMARY KEY,
    observacao VARCHAR(1000) NOT NULL,
    id_endereco INT REFERENCES Endereco(id),
    matricula_policial VARCHAR(50) REFERENCES Policial(matricula),
    id_apenado INT REFERENCES Apenado(id),
    data_visita DATE
);