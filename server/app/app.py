from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from flask_bcrypt import generate_password_hash, check_password_hash
import logging
import psycopg2
import datetime


app = Flask(__name__)

app.secret_key = 'your_secret_key'  # Change this to a random secret key

logging.basicConfig(level=logging.DEBUG)

login_manager = LoginManager()
login_manager.init_app(app)

def get_db():
    conn = psycopg2.connect(
        dbname="appApenadosDB",
        user="postgres",
        password="123",
        host="database",
        port="5432"
    )
    return conn

class User(UserMixin):
    pass

@app.route('/')
def index():
    logging.debug('Index route!')
    return render_template('index.html')

@login_manager.user_loader
def user_loader(matricula):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT matricula FROM Policial WHERE matricula = %s", (matricula,))
    user_id = cur.fetchone()
    if user_id is None:
        return
    user = User()
    user.id = user_id[0]
    return user

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        matricula = request.form['matricula']
        password = request.form['password']

        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT matricula, password_hash FROM Policial WHERE matricula = %s", (matricula,))
        result = cur.fetchone()

        if result is not None:
            db_matricula, db_password_hash = result
            if db_matricula == matricula and check_password_hash(db_password_hash, password):
                user = User()
                user.id = matricula
                login_user(user)
                return redirect(url_for('display_data'))

    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        password = request.form['password']
        matricula = request.form['matricula']
        telefone = request.form['telefone']
        cpf = request.form['cpf']
        nome = request.form['nome']

        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT matricula FROM Policial WHERE matricula = %s", (matricula,))
        user_exists = cur.fetchone()
        cur.execute("SELECT cpf FROM Pessoa WHERE cpf = %s", (cpf,))
        pessoa_exists = cur.fetchone()

        if pessoa_exists is None:
            hashed_password = generate_password_hash(password).decode('utf-8')
            cur.execute("""
                INSERT INTO Pessoa (cpf, nome)
                VALUES (%s, %s)
            """, (cpf, nome))
        if user_exists is None:
            cur.execute("""
                INSERT INTO Policial (matricula, password_hash, telefone, cpf_pessoa)
                VALUES (%s, %s, %s, %s)
            """, (matricula, hashed_password, telefone, cpf))
            conn.commit()

            user = User()
            user.id = matricula
            login_user(user)
            return redirect(url_for('display_data'))

    return render_template('register.html')

@app.route('/api/policiais', methods=['GET'])
@login_required
def get_policiais_api():    
    conn = get_db()
    cur = conn.cursor()
    logging.debug('Buscando policiais registrados no banco de dados...')
    cur.execute("SELECT * FROM Policial")
    policiais = cur.fetchall()
    policiais_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in policiais]
    
    logging.debug('Enviando ao aplicativo...')
    return jsonify(policiais_list)

@app.route('/api/syncdata', methods=['GET'])
def get_all_data_api():
    conn = get_db()
    cur = conn.cursor()

    logging.debug('Buscando dados novos no banco...')
    # Execute all queries in one go
    queries = [
        "SELECT * FROM Pessoa",
        "SELECT * FROM Policial",
        "SELECT * FROM Endereco",
        "SELECT * FROM Crime",
        "SELECT * FROM ArtigoPenal",
        "SELECT * FROM Visita"
    ]
    
    all_data = {}
    for table, query in zip(["Pessoa", "Policial", "Endereco", "Crime", "ArtigoPenal", "Visita"], queries):
        cur.execute(query)
        data = cur.fetchall()
        data_list = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in data]
        all_data[table] = data_list

    # Include timestamp in the response
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    all_data["timestamp"] = timestamp
    
    logging.debug('Enviando dados...')

    return jsonify(all_data)

@app.route('/delete_apenado', methods=['POST'])
@login_required
def delete_apenado():
    if request.method == 'POST':
        id = request.form['id']

        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            DELETE FROM Apenado
            WHERE id = %s
        """, (id,))
        conn.commit()

        return redirect(url_for('display_data'))
    
@app.route('/api/sync_visits', methods=['POST'])
def sync_visits():
    if request.method == 'POST':
        logging.debug("Dados de visita recebidos!")
        
        data = request.get_json()

        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO Visita (observacao, id_endereco, matricula_policial, id_apenado, data_visita)
            VALUES (%s, %s, %s, %s, %s)
        """, (data['observacao'], data['id_endereco'], data['matricula_policial'], data['id_apenado'], data['data_visita']))
        
        conn.commit()

        return redirect(url_for('display_data'))
    else:
        return redirect(url_for('/'))

@app.route('/update_data', methods=['POST'])
@login_required
def update_data():
    if request.method == 'POST':
        id = request.form['id']
        new_nome = request.form['nome']
        new_cpf = request.form['cpf']
        new_relevancia = request.form['relevancia']
        new_crime_descricao = request.form['crime_descricao']

        # Collect individual address components
        new_rua = request.form['rua']
        new_numero = request.form['numero']
        new_complemento = request.form['complemento']
        new_cep = request.form['cep']
        new_estado = request.form['estado']
        new_municipio = request.form['municipio']

        conn = get_db()
        cur = conn.cursor()

        # Fetch id_endereco and id_crime for the given Apenado id
        cur.execute("""
            SELECT id_endereco, id_crime
            FROM Apenado
            WHERE id = %s
        """, (id,))
        apenado_data = cur.fetchone()
        id_endereco = apenado_data[0]
        id_crime = apenado_data[1]

        # Update Apenado table
        cur.execute("""
            UPDATE Apenado
            SET cpf = %s, Relevancia = %s
            WHERE id = %s
        """, (new_cpf, new_relevancia, id))

        # Update Pessoa table
        cur.execute("""
            UPDATE Pessoa
            SET nome = %s
            WHERE cpf = %s
        """, (new_nome, new_cpf))

        # Update Endereco table
        cur.execute("""
            UPDATE Endereco
            SET rua = %s, numero = %s, complemento = %s, cep = %s, estado = %s, municipio = %s
            WHERE id = %s
        """, (new_rua, new_numero, new_complemento, new_cep, new_estado, new_municipio, id_endereco))

        # Update Crime table
        cur.execute("""
            UPDATE Crime
            SET descricao = %s
            WHERE id = %s
        """, (new_crime_descricao, id_crime))

        conn.commit()
        cur.close()

        return redirect(url_for('display_data'))

@app.route('/add_apenado', methods=['POST'])
@login_required
def add_apenado():
    if request.method == 'POST':
        nome = request.form['nome']
        cpf = request.form['cpf']
        relevancia = request.form['relevancia']
        
        # Collect individual address components
        rua = request.form['rua']
        numero = request.form['numero']
        complemento = request.form['complemento']
        cep = request.form['cep']
        estado = request.form['estado']
        municipio = request.form['municipio']
        
        # Collect crime details
        crime_descricao = request.form['crime_descricao']
        crime_data = request.form['crime_data']
        # artigo_penal_id = request.form['artigo_penal_id']

        conn = get_db()
        cur = conn.cursor()

        # Insert into Pessoa table if not exists
        cur.execute("""
            INSERT INTO Pessoa (cpf, nome)
            SELECT %s, %s
            WHERE NOT EXISTS (SELECT 1 FROM Pessoa WHERE cpf = %s)
        """, (cpf, nome, cpf))

        # Insert into Endereco table
        cur.execute("""
            INSERT INTO Endereco (rua, numero, complemento, cep, estado, municipio)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (rua, numero, complemento, cep, estado, municipio))
        
        endereco_id = cur.fetchone()[0]

        # Insert into Crime table
        cur.execute("""
            INSERT INTO Crime (data_ocorrido, descricao)
            VALUES (%s, %s)
            RETURNING id
        """, (crime_data, crime_descricao))
        
        crime_id = cur.fetchone()[0]

        # Insert into Apenado table
        cur.execute("""
            INSERT INTO Apenado (cpf, id_endereco, id_crime, Relevancia)
            VALUES (%s, %s, %s, %s)
        """, (cpf, endereco_id, crime_id, relevancia))
        
        conn.commit()
        cur.close()

        return redirect(url_for('display_data'))

    
@app.route('/api/apenados', methods=['GET'])
@login_required
def get_apenados_api():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT Apenado.*, Pessoa.nome, Endereco.*, Crime.*, ArtigoPenal.descricao as artigo_penal_descricao
        FROM Apenado
        INNER JOIN Pessoa ON Apenado.cpf = Pessoa.cpf
        LEFT JOIN Endereco ON Apenado.id_endereco = Endereco.id
        LEFT JOIN Crime ON Apenado.id_crime = Crime.id
        LEFT JOIN ArtigoPenal ON Crime.id_artigo_penal = ArtigoPenal.id
    """)
    apenados = cur.fetchall()
    apenados_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in apenados]
    return jsonify(apenados_list)

@app.route('/gerenciamento')
@login_required
def display_data():
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT Apenado.*, Pessoa.nome,
               Endereco.rua, Endereco.numero, Endereco.complemento, Endereco.cep, Endereco.estado, Endereco.municipio,
               Crime.descricao AS crime_descricao, Crime.data_ocorrido
        FROM Apenado
        INNER JOIN Pessoa ON Apenado.cpf = Pessoa.cpf
        LEFT JOIN Endereco ON Apenado.id_endereco = Endereco.id
        LEFT JOIN Crime ON Apenado.id_crime = Crime.id
    """)
    
    apenados = cur.fetchall()
    cur.close()
    
    apenados_list = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in apenados]
    
    return render_template('gerenciamento.html', apenados=apenados_list)


if __name__ == '__main__':
    app.run(debug=True)