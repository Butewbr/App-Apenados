# Importando as bibliotecas necessárias
from flask import Flask, render_template, redirect, url_for, request, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

# Inicializando a aplicação Flask
app = Flask(__name__)

# Configurando o caminho do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

# Configurando a chave secreta para a sessão
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'

# Inicializando o objeto SQLAlchemy com a aplicação Flask
db = SQLAlchemy(app)

# Inicializando o gerenciador de login
login_manager = LoginManager()

# Configurando o gerenciador de login com a aplicação Flask
login_manager.init_app(app)

# Definindo a rota de login
login_manager.login_view = 'login'

# Definindo o modelo de usuário
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Campo de ID
    username = db.Column(db.String(15), unique=True)  # Campo de nome de usuário
    password = db.Column(db.String(80))  # Campo de senha

# Carregando o usuário
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Rota para a página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':  # Se o método for POST
        username = request.form.get('username')  # Obter o nome de usuário do formulário
        password = request.form.get('password')  # Obter a senha do formulário
        user = User.query.filter_by(username=username).first()  # Procurar o usuário no banco de dados

        # Se o usuário não existir ou a senha estiver incorreta, redirecionar para a página de login
        if not user or not check_password_hash(user.password, password):
            flash('Por favor, verifique suas credenciais de login e tente novamente.')
            return redirect(url_for('login'))

        # Se o login for bem-sucedido, redirecionar para o dashboard
        login_user(user)
        return redirect(url_for('dashboard'))

    # Se o método for GET, renderizar a página de login
    return render_template('login.html')

# Rota para a página de inscrição
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':  # Se o método for POST
        username = request.form.get('username')  # Obter o nome de usuário do formulário
        password = request.form.get('password')  # Obter a senha do formulário
        user = User.query.filter_by(username=username).first()  # Procurar o usuário no banco de dados

        # Se o usuário já existir, redirecionar para a página de inscrição
        if user: 
            flash('Nome de usuário já existe')
            return redirect(url_for('signup'))

        # Criar um novo usuário com o nome de usuário e a senha fornecidos
        new_user = User(username=username, password=generate_password_hash(password, method='sha256'))

        # Adicionar o novo usuário à sessão do banco de dados
        db.session.add(new_user)

        # Confirmar a sessão do banco de dados
        db.session.commit()

        # Redirecionar para a página de login após a inscrição bem-sucedida
        return redirect(url_for('login'))

    # Se o método for GET, renderizar a página de inscrição
    return render_template('signup.html')

# Rota para o dashboard
@app.route('/dashboard')
@login_required
def dashboard():
    # Renderizar a página do dashboard
    return render_template('dashboard.html')

# Rota para logout
@app.route('/logout')
@login_required
def logout():
    # Fazer logout do usuário
    logout_user()

    # Redirecionar para a página de login após o logout
    return redirect(url_for('index'))

# Rodar a aplicação Flask
if __name__ == '__main__':
    app.run(debug=True)
