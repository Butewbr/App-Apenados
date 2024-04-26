from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from flask_bcrypt import generate_password_hash, check_password_hash
import logging
import psycopg2


app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a random secret key

logging.basicConfig(level=logging.DEBUG)

login_manager = LoginManager()
login_manager.init_app(app)

def get_db():
    conn = psycopg2.connect(
        dbname="app-apenados",
        user="postgres",
        password="admin",
        host="localhost",
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

@app.route('/api/pessoas', methods=['GET'])
@login_required
def get_pessoas_api():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM Pessoa")
    pessoas = cur.fetchall()
    pessoas_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in pessoas]
    return jsonify(pessoas_list)

@app.route('/api/policiais', methods=['GET'])
@login_required
def get_policiais_api():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM Policial")
    policiais = cur.fetchall()
    policiais_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in policiais]
    return jsonify(policiais_list)

@app.route('/api/enderecos', methods=['GET'])
@login_required
def get_enderecos_api():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM Endereco")
    enderecos = cur.fetchall()
    enderecos_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in enderecos]
    return jsonify(enderecos_list)

@app.route('/api/crimes', methods=['GET'])
@login_required
def get_crimes_api():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM Crime")
    crimes = cur.fetchall()
    crimes_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in crimes]
    return jsonify(crimes_list)

@app.route('/api/artigos_penais', methods=['GET'])
@login_required
def get_artigos_penais_api():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM ArtigoPenal")
    artigos_penais = cur.fetchall()
    artigos_penais_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in artigos_penais]
    return jsonify(artigos_penais_list)

@app.route('/api/visitas', methods=['GET'])
@login_required
def get_visitas_api():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM Visita")
    visitas = cur.fetchall()
    visitas_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in visitas]
    return jsonify(visitas_list)

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

@app.route('/update_data', methods=['POST'])
@login_required
def update_data():
    if request.method == 'POST':
        id = request.form['id']
        new_nome = request.form['nome']
        new_cpf = request.form['cpf']
        new_relevancia = request.form['relevancia']
        #new_data_fim_liberdade = request.form['data_fim_liberdade']
        new_endereco = request.form['endereco']
        new_descricao = request.form['descricao']

        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            UPDATE Apenado
            SET cpf = %s, Relevancia = %s, endereco = %s, descricao = %s
            WHERE id = %s
        """, (new_cpf, new_relevancia, new_endereco, new_descricao, id))
        cur.execute("""
            UPDATE Pessoa
            SET nome = %s
            WHERE cpf = %s
        """, (new_nome, new_cpf))
        conn.commit()

        return redirect(url_for('display_data'))

@app.route('/add_apenado', methods=['POST'])
@login_required
def add_apenado():
    if request.method == 'POST':
        nome = request.form['nome']
        cpf = request.form['cpf']
        endereco = request.form['endereco']
        descricao = request.form['descricao']
        relevancia = request.form['relevancia']
        #data_fim_liberdade = request.form['data_fim_liberdade']

        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO Pessoa (cpf, nome)
            SELECT %s, %s
            WHERE NOT EXISTS (SELECT 1 FROM Pessoa WHERE cpf = %s)
        """, (cpf, nome, cpf))

        cur.execute("""
            INSERT INTO Apenado (cpf, endereco, descricao, Relevancia)
            SELECT %s, %s, %s, %s
            WHERE EXISTS (SELECT 1 FROM Pessoa WHERE cpf = %s)
        """, (cpf, endereco, descricao, relevancia, cpf))
        conn.commit()

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
        SELECT Apenado.*, Pessoa.nome
        FROM Apenado
        INNER JOIN Pessoa ON Apenado.cpf = Pessoa.cpf
    """)
    # cur.execute("""
    #     SELECT Apenado.*, Pessoa.nome, Endereco.*, Crime.*, ArtigoPenal.descricao as artigo_penal_descricao
    #     FROM Apenado
    #     INNER JOIN Pessoa ON Apenado.cpf = Pessoa.cpf
    #     LEFT JOIN Endereco ON Apenado.id_endereco = Endereco.id
    #     LEFT JOIN Crime ON Apenado.id_crime = Crime.id
    #     LEFT JOIN ArtigoPenal ON Crime.id_artigo_penal = ArtigoPenal.id
    # """)
    apenados = cur.fetchall()
    apenados_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in apenados]
    return render_template('gerenciamento.html', apenados=apenados_list)

if __name__ == '__main__':
    app.run(debug=True)