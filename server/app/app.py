from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from flask_bcrypt import generate_password_hash, check_password_hash
import logging

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a random secret key

logging.basicConfig(level=logging.DEBUG)

apenados = {
    "123": {
        "name": "Robert Smith",
        "cpf": "12345678901",
        "address": "123 Main St, Anytown",
        "description": "Arrested for theft",
        "danger_level": "3",
        "id": "123"
    },
    "456": {
        "name": "Alice Johnson",
        "cpf": "23456789012",
        "address": "456 Elm St, Othertown",
        "description": "Arrested for vandalism",
        "danger_level": "2",
        "id": "456"
    },
    "789": {
        "name": "John Doe",
        "cpf": "34567890123",
        "address": "789 Oak St, Another town",
        "description": "Arrested for assault",
        "danger_level": "4",
        "id": "789"
    },
    "246": {
        "name": "Emily Davis",
        "cpf": "45678901234",
        "address": "246 Pine St, Someplace",
        "description": "Arrested for drug possession",
        "danger_level": "1",
        "id": "246"
    },
    "135": {
        "name": "Michael Brown",
        "cpf": "56789012345",
        "address": "135 Cedar St, Elsewhere",
        "description": "Arrested for burglary",
        "danger_level": "5",
        "id": "135"
    },
    "579": {
        "name": "Sarah Wilson",
        "cpf": "67890123456",
        "address": "579 Maple St, Anywhere",
        "description": "Arrested for fraud",
        "danger_level": "3",
        "id": "579"
    },
    "802": {
        "name": "David Martinez",
        "cpf": "78901234567",
        "address": "802 Willow St, Nowhere",
        "description": "Arrested for embezzlement",
        "danger_level": "2",
        "id": "802"
    },
    "304": {
        "name": "Jennifer Garcia",
        "cpf": "89012345678",
        "address": "304 Birch St, Somewhere",
        "description": "Arrested for DUI",
        "danger_level": "4",
        "id": "304"
    },
    "687": {
        "name": "Daniel Rodriguez",
        "cpf": "90123456789",
        "address": "687 Pineapple St, Here",
        "description": "Arrested for public intoxication",
        "danger_level": "1",
        "id": "687"
    },
    "910": {
        "name": "Jessica Hernandez",
        "cpf": "01234567890",
        "address": "910 Cherry St, There",
        "description": "Arrested for disorderly conduct",
        "danger_level": "5",
        "id": "910"
    },
    "234": {
        "name": "Matthew Lopez",
        "cpf": "12345678901",
        "address": "234 Peach St, Anytown",
        "description": "Arrested for shoplifting",
        "danger_level": "3",
        "id": "234"
    },
    "567": {
        "name": "Amanda King",
        "cpf": "23456789012",
        "address": "567 Lemon St, Othertown",
        "description": "Arrested for trespassing",
        "danger_level": "2",
        "id": "567"
    },
    "891": {
        "name": "Christopher Scott",
        "cpf": "34567890123",
        "address": "891 Lime St, Another town",
        "description": "Arrested for disturbing the peace",
        "danger_level": "4",
        "id": "891"
    },
    "432": {
        "name": "Michelle Lee",
        "cpf": "45678901234",
        "address": "432 Orange St, Someplace",
        "description": "Arrested for public urination",
        "danger_level": "1",
        "id": "432"
    },
    "765": {
        "name": "Andrew Nguyen",
        "cpf": "56789012345",
        "address": "765 Banana St, Elsewhere",
        "description": "Arrested for loitering",
        "danger_level": "5",
        "id": "765"
    }
}

# Dummy user data
users = {
    '123456': {
        'password_hash': generate_password_hash('123'),
        'matricula': '123456',
        'telefone': '12345678901',
        'cpf': '12345678901',
        'nome': 'John Doe'
    },
    '234567': {
        'password_hash': generate_password_hash('123'),
        'matricula': '234567',
        'telefone': '23456789012',
        'cpf': '23456789012',
        'nome': 'Jane Smith'
    },
    '345678': {
        'password_hash': generate_password_hash('123'),
        'matricula': '345678',
        'telefone': '34567890123',
        'cpf': '34567890123',
        'nome': 'Alice Johnson'
    },
    '456789': {
        'password_hash': generate_password_hash('123'),
        'matricula': '456789',
        'telefone': '45678901234',
        'cpf': '45678901234',
        'nome': 'Bob Brown'
    },
    '567890': {
        'password_hash': generate_password_hash('123'),
        'matricula': '567890',
        'telefone': '56789012345',
        'cpf': '56789012345',
        'nome': 'Emily Davis'
    }
}

login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    pass

@app.route('/')
def index():
    logging.debug('Index route!')
    return render_template('index.html')

@login_manager.user_loader
def load_user(matricula):
    if matricula in users:
        user = User()
        user.id = matricula
        return user

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        matricula = request.form['matricula']  # Change 'username' to 'matricula'
        password = request.form['password']
        # Check if the matricula exists in users and password is correct
        for matricula, user_data in users.items():
            if user_data['matricula'] == matricula and check_password_hash(user_data['password_hash'], password):
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

        # Check if the username is already taken
        if matricula not in users:
            hashed_password = generate_password_hash(password).decode('utf-8')
            users[matricula] = {
                'password_hash': hashed_password,
                'matricula': matricula,
                'telefone': telefone,
                'cpf': cpf,
                'nome': nome
            }
            user = User()
            user.id = matricula
            login_user(user)
            return redirect(url_for('display_data'))
    return render_template('register.html')

@app.route('/gerenciamento')
@login_required
def display_data():
    return render_template('gerenciamento.html', apenados=apenados)

@app.route('/delete_apenado', methods=['POST'])
@login_required
def delete_apenado():
    if request.method == 'POST':
        id = request.form['id']
        if id in apenados:
            del apenados[id]
    return redirect(url_for('display_data'))

@app.route('/update_data', methods=['POST'])
@login_required
def update_data():
    if request.method == 'POST':
        id = request.form['id']
        new_full_name = request.form['name']
        new_cpf = request.form['cpf']
        new_address = request.form['address']
        new_description = request.form['description']
        new_danger_level = request.form['danger_level']  # Add new field
        if id in apenados:
            apenados[id]['name'] = new_full_name
            apenados[id]['cpf'] = new_cpf
            apenados[id]['address'] = new_address
            apenados[id]['description'] = new_description
            apenados[id]['danger_level'] = new_danger_level  # Add new field
        return redirect(url_for('display_data'))

@app.route('/add_apenado', methods=['POST'])
@login_required
def add_apenado():
    if request.method == 'POST':
        id = request.form['cpf']
        name = request.form['name']
        cpf = request.form['cpf']
        address = request.form['address']
        description = request.form['description']
        danger_level = request.form['danger_level']  # Add new field
        apenados[id] = {
            'name': name,
            'cpf': cpf,
            'address': address,
            'description': description,
            'danger_level': danger_level,  # Add new field
            'id': id
        }
        return redirect(url_for('display_data'))

@app.route('/api/apenados', methods=['GET'])
def get_apenados_api():
    # Return all apenados data as JSON
    return jsonify(apenados)


if __name__ == '__main__':
    app.run(debug=True)