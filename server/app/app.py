from flask import Flask, render_template, request, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from flask_bcrypt import generate_password_hash, check_password_hash
import logging

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a random secret key

logging.basicConfig(level=logging.DEBUG)

# Dummy apenados data
apenados = {
    "Robert": "123",
    "Alice": "456",
    "John": "789",
    "Emily": "246",
    "Michael": "135",
    "Sarah": "579",
    "David": "802",
    "Jennifer": "304",
    "Daniel": "687",
    "Jessica": "910",
    "Matthew": "234",
    "Amanda": "567",
    "Christopher": "891",
    "Michelle": "432",
    "Andrew": "765"
}

# Dummy user data
users = {
    'user1': {'password_hash': generate_password_hash('123')},
    'user2': {'password_hash': generate_password_hash('123')},
    'user3': {'password_hash': generate_password_hash('123')},
    'user4': {'password_hash': generate_password_hash('123')},
    'user5': {'password_hash': generate_password_hash('123')}
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
def load_user(username):
    if username in users:
        user = User()
        user.id = username
        return user

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and check_password_hash(users[username]['password_hash'], password):
            user = User()
            user.id = username
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
        username = request.form['username']
        password = request.form['password']
        # Check if the username is already taken
        if username not in users:
            hashed_password = generate_password_hash(password).decode('utf-8')
            users[username] = {'password_hash': hashed_password}
            user = User()
            user.id = username
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
        name = request.form['name']
        if name in apenados:
            del apenados[name]
    return redirect(url_for('display_data'))

@app.route('/update_data', methods=['POST'])
@login_required
def update_data():
    if request.method == 'POST':
        name = request.form['name']
        new_data = request.form['data']
        # Update the data in the apenados dictionary
        apenados[name] = new_data
        return redirect(url_for('display_data'))
    
@app.route('/add_apenado', methods=['POST'])
@login_required
def add_apenado():
    if request.method == 'POST':
        name = request.form['name']
        data = request.form['data']
        # Update the data in the apenados dictionary
        apenados[name] = data
        return redirect(url_for('display_data'))

if __name__ == '__main__':
    app.run(debug=True)
