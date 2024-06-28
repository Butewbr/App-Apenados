import json
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from flask_bcrypt import generate_password_hash, check_password_hash
import logging
import psycopg2
import datetime
from flask_cors import CORS


app = Flask(__name__)

app.secret_key = 'your_secret_key'  # Change this to a random secret key
CORS(app, supports_credentials=True)
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
    cur.execute("SELECT matricula FROM Usuario WHERE matricula = %s", (matricula,))
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
        cur.execute("SELECT matricula,cpf_pessoa,password_hash,nome FROM Usuario WHERE matricula = %s", (matricula,))
        result = cur.fetchone()

        if result is not None:
            db_matricula,cpf_pessoa,password_hash,nome = result
            if db_matricula == matricula and check_password_hash(password_hash, password):
                user = User()
                user.id = matricula
                login_user(user)
                return jsonify({'message':'Login successfull', 'usuario':{'nome': nome, 'matricula': db_matricula, 'cpf': cpf_pessoa}})

        # Invalid credentials
        logout_user()
        return jsonify({'error': 'Invalid credentials'}), 401

    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        password = request.json['senha']
        matricula = request.json['matricula']
        telefone = request.json['telefone']
        cpf = request.json['cpf']
        nome = request.json['nome']

        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT matricula FROM Usuario WHERE matricula = %s", (matricula,))
        user_exists = cur.fetchone()
        hashed_password = generate_password_hash(password).decode('utf-8')

        if user_exists is None:
            cur.execute("""
                INSERT INTO Usuario (matricula, password_hash, cpf_pessoa, nome)
                VALUES (%s, %s, %s, %s)
            """, (matricula, hashed_password, cpf, nome))
            conn.commit()

            return jsonify({'message':'Registrado com sucesso', 'usuario':{'nome': nome, 'matricula': matricula, 'cpf': cpf}})
        else:
            cur.execute("""
                UPDATE Usuario
                SET password_hash = %s, telefone = %s, cpf_pessoa = %s, nome = %s
                WHERE matricula = %s
            """, (hashed_password, telefone, cpf, nome, matricula))
            conn.commit()
            return jsonify({'message':'Atualizado com sucesso', 'usuario':{'nome': nome, 'matricula': matricula, 'cpf': cpf}})

    return jsonify({'error': 'Erro'}), 401

@app.route('/api/policiais', methods=['GET'])
@login_required
def get_policiais_api():    
    conn = get_db()
    cur = conn.cursor()
    logging.debug('Buscando policiais registrados no banco de dados...')
    cur.execute("SELECT * FROM Usuario")
    policiais = cur.fetchall()
    policiais_list = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in policiais]
    
    logging.debug('Enviando ao aplicativo...')
    return jsonify(policiais_list)

@app.route('/api/syncdata', methods=['GET'])
@login_required
def get_all_data_api():
    conn = get_db()
    cur = conn.cursor()

    logging.debug('Buscando dados novos no banco...')
    # Execute all queries in one go
    queries = [
        "SELECT * FROM Apenado left join AltPenal on Apenado.id = AltPenal.id_apenado ",
        "SELECT * FROM Endereco join AltPenal on Endereco.id = AltPenal.id_endereco join Apenado on AltPenal.id_apenado = Apenado.id ",
        "SELECT * FROM Usuario",
        "SELECT * FROM Crime join AltPenal on Crime.id_altpenal = AltPenal.id",
        "SELECT AltPenal.id as id_altpenal, AltPenal.*, Apenado.*,Endereco.*, (select data_visita from visita where AltPenal.id=visita.id_altpenal order by id desc limit 1) as last_visit FROM AltPenal left join Apenado on AltPenal.id_apenado = Apenado.id left join Endereco on AltPenal.id_endereco = Endereco.id ",
        "SELECT * FROM Visita"
    ]
    
    all_data = {}
    for table, query in zip(["Apenado", "Endereco", "Usuario", "Crime", "AltPenal", "Visita"], queries):
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
        
        for visit in data:
            cur.execute("""
                INSERT INTO Visita (observacao, id_endereco, matricula_usuario, id_apenado, id_altpenal, estava_em_casa)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (visit['observacao'], visit['id_endereco'], visit['matricula_usuario'], visit['id_apenado'], visit['id_altpenal'], visit['estava_em_casa']))
        
        conn.commit()

        return get_all_data_api()
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
        id_apenado = request.json.get('apenado', {}).get('id_apenado', None)
        nome = request.json.get('apenado', {}).get('nome', None)
        cpf = request.json.get('apenado', {}).get('cpf', None)
        relevancia = request.json.get('apenado', {}).get('relevancia', None)
        telefone = request.json.get('apenado', {}).get('telefone', None)
        
        # Collect individual address components
        id_endereco = request.json.get('endereco', {}).get('id_endereco', None)
        rua = request.json.get('endereco', {}).get('rua', None)
        numero = request.json.get('endereco', {}).get('numero', None) or None
        complemento = request.json.get('endereco', {}).get('complemento', None)
        cep = request.json.get('endereco', {}).get('cep', None) or None
        estado = request.json.get('endereco', {}).get('estado', None)
        municipio = request.json.get('endereco', {}).get('municipio', None)
        latitude = request.json.get('endereco', {}).get('latitude', None)
        longitude = request.json.get('endereco', {}).get('longitude', None)

        
        id_altpenal = request.json.get('altPenal', {}).get('id_altpenal', None)
        vara = request.json.get('altPenal', {}).get('vara', None)
        numeroAutos = request.json.get('altPenal', {}).get('numeroAutos', None)
        dataInicio = request.json.get('altPenal', {}).get('dataInicio', None)
        dataFim = request.json.get('altPenal', {}).get('dataFim', None)
        medidaImposta = request.json.get('altPenal', {}).get('medidaImposta', None)
        
        # Collect crime details
        crimes = request.json.get('crimes', None)

        conn = get_db()
        cur = conn.cursor()

        # Insert into Endereco table
        if id_endereco is not None:
            cur.execute("""
                UPDATE Endereco
                SET rua = %s, numero = %s, complemento = %s, cep = %s, estado = %s, municipio = %s, info_geo = %s
                WHERE id = %s
            """, (rua, numero, complemento, cep, estado, municipio, json.dumps({"coordinates": [longitude,latitude]}), id_endereco))
        else:
            cur.execute("""
                INSERT INTO Endereco (rua, numero, complemento, cep, estado, municipio, info_geo)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (rua, numero, complemento, cep, estado, municipio, json.dumps({"coordinates": [longitude,latitude]})))
        
            id_endereco = cur.fetchone()[0]


        # Insert into Apenado table
        if id_apenado is not None:
            cur.execute("""
                UPDATE Apenado
                SET nome = %s, cpf = %s, telefone = %s, relevancia = %s
                WHERE id = %s
            """, (nome, cpf, telefone, relevancia, id_apenado))
        else:
            cur.execute("""
                INSERT INTO Apenado (nome, cpf, telefone, relevancia)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """, (nome, cpf, telefone, relevancia))
            id_apenado = cur.fetchone()[0]

        # Insert into AltPenal table
        if id_altpenal is not None:
            cur.execute("""
                UPDATE AltPenal
                SET id_apenado = %s, id_endereco = %s, vara = %s, num_autos = %s, data_inicio = %s, data_fim = %s, medida_imposta = %s
                WHERE id = %s
            """, (id_apenado, id_endereco, vara, numeroAutos, dataInicio, dataFim, medidaImposta, id_altpenal))
        else:                   
            cur.execute("""
                INSERT INTO AltPenal (id_apenado, id_endereco, vara, num_autos, data_inicio, data_fim, medida_imposta)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (id_apenado, id_endereco, vara, numeroAutos, dataInicio, dataFim, medidaImposta))
            id_altpenal = cur.fetchone()[0]
        
        for crime in crimes:
            if crime['descricao']:
                if crime.get('id', None) is not None:
                    cur.execute("""
                        UPDATE Crime
                        SET data_ocorrido = %s, descricao = %s
                        WHERE id = %s
                    """, (crime['dataOcorrido'], crime['descricao'], crime['id']))
                else:
                    cur.execute("""
                    INSERT INTO Crime (data_ocorrido, descricao, id_altpenal)
                    VALUES (%s,%s,%s)
                    """, (crime['dataOcorrido'], crime['descricao'], id_altpenal))
        # artigo_penal_id = req
        conn.commit()
        cur.close()

        return redirect(url_for('display_data'))

    
@app.route('/api/apenados', methods=['GET'])
@login_required
def get_apenados_api():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT Apenado.*, Endereco.*, AltPenal.*, AltPenal.id as id_altpenal, Apenado.id as id
        FROM Apenado
        LEFT JOIN AltPenal ON Apenado.id = AltPenal.id_apenado
        LEFT JOIN Endereco ON AltPenal.id_endereco = Endereco.id
    """)
    apenados = cur.fetchall()
    apenados_list = []
    for row in apenados:
        apenado_dict = dict((cur.description[i][0], value) for i, value in enumerate(row))
        apenado_dict['crimes'] = []
        apenados_list.append(apenado_dict)
        
    # Fetch crimes for each apenado
    for apenado in apenados_list:
        cur.execute("""
            SELECT Crime.*
            FROM Crime
            WHERE Crime.id_altpenal = %s
        """, (apenado['id_altpenal'],))
        crimes = cur.fetchall()
        apenado['crimes'] = [dict((cur.description[i][0], value) for i, value in enumerate(crime)) for crime in crimes]
        
    # Fetch visitas for each apenado
    for apenado in apenados_list:
        cur.execute("""
            SELECT Visita.*
            FROM Visita
            WHERE Visita.id_altpenal = %s
        """, (apenado['id_altpenal'],))
        visitas = cur.fetchall()
        apenado['visitas'] = [dict((cur.description[i][0], value) for i, value in enumerate(visita)) for visita in visitas]
        
    return jsonify(apenados_list)

@app.route('/api/apenado/<int:apenado_id>', methods=['GET'])
@login_required
def get_apenado_api(apenado_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT Apenado.*, Endereco.*, AltPenal.*, AltPenal.id as id_altpenal, Apenado.id as id
        FROM Apenado
        LEFT JOIN AltPenal ON Apenado.id = AltPenal.id_apenado
        LEFT JOIN Endereco ON AltPenal.id_endereco = Endereco.id
        WHERE Apenado.id = %s
    """, (apenado_id,))
    apenado = cur.fetchone()
    if apenado is None:
        return jsonify({'error': 'Apenado not found'})
    
    apenado_dict = dict((cur.description[i][0], value) for i, value in enumerate(apenado))
    apenado_dict['crimes'] = []
    
    cur.execute("""
        SELECT Crime.*
        FROM Crime
        WHERE Crime.id_altpenal = %s
    """, (apenado_dict['id_altpenal'],))
    crimes = cur.fetchall()
    apenado_dict['crimes'] = [dict((cur.description[i][0], value) for i, value in enumerate(crime)) for crime in crimes]

    # Fetch visitas for each apenado
    cur.execute("""
        SELECT Visita.*
        FROM Visita
        WHERE Visita.id_altpenal = %s
    """, (apenado_dict['id_altpenal'],))
    visitas = cur.fetchall()
    apenado_dict['visitas'] = [dict((cur.description[i][0], value) for i, value in enumerate(visita)) for visita in visitas]
    
    return jsonify(apenado_dict)

@app.route('/gerenciamento')
@login_required
def display_data():
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT Apenado.*, 
               Endereco.rua, Endereco.numero, Endereco.complemento, Endereco.cep, Endereco.estado, Endereco.municipio
        FROM Apenado
        LEFT JOIN Endereco ON Endereco.id_apenado = Apenado.id
        LEFT JOIN AltPenal ON Apenado.id = AltPenal.id_apenado
    """)
    
    apenados = cur.fetchall()
    cur.close()
    
    apenados_list = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in apenados]
    
    return render_template('gerenciamento.html', apenados=apenados_list)


if __name__ == '__main__':
    app.run(debug=True)