# Utilizamos recuperação de e-mail
# Importando as bibliotecas necessárias
from flask import Flask, render_template, redirect, url_for, request, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

# Inicializando a aplicação Flask
app = Flask(__name__)

# Configurando o caminho do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

# Configurando a chave secreta para a sessão
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'

# Configurando o servidor de e-mail
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'  # Substitua pelo seu e-mail
app.config['MAIL_DEFAULT_SENDER'] = 'your-email@gmail.com'  # Substitua pelo seu e-mail
app.config['MAIL_PASSWORD'] = 'your-password'  # Substitua pela sua senha

# Inicializando o objeto SQLAlchemy com a aplicação Flask
db = SQLAlchemy(app)

# Inicializando o gerenciador de login
login_manager = LoginManager()

# Configurando o gerenciador de login com a aplicação Flask
login_manager.init_app(app)

# Definindo a rota de login
login_manager.login_view = 'login'

# Inicializando o serviço de e-mail
mail = Mail(app)

# Inicializando o serializador de URL seguro
s = URLSafeTimedSerializer('Thisisasecret!')

# Definindo o modelo de usuário
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Campo de ID
    username = db.Column(db.String(15), unique=True)  # Campo de nome de usuário
    password = db.Column(db.String(80))  # Campo de senha
    email = db.Column(db.String(50), unique=True)  # Campo de e-mail

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
        email = request.form.get('email')  # Obter o e-mail do formulário
        user = User.query.filter_by(username=username).first()  # Procurar o usuário no banco de dados

        # Se o usuário já existir, redirecionar para a página de inscrição
        if user: 
            flash('Nome de usuário já existe')
            return redirect(url_for('signup'))

        # Criar um novo usuário com o nome de usuário, a senha e o e-mail fornecidos
        new_user = User(username=username, password=generate_password_hash(password, method='sha256'), email=email)

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

# Rota para recuperação de senha
@app.route('/recover', methods=['GET', 'POST'])
def recover():
    if request.method == 'POST':  # Se o método for POST
        email = request.form.get('email')  # Obter o e-mail do formulário
        user = User.query.filter_by(email=email).first()  # Procurar o usuário no banco de dados

        # Se o usuário existir, enviar um e-mail de recuperação de senha
        if user:
            token = s.dumps(email, salt='email-confirm')  # Gerar um token seguro
            msg = Message('Recuperação de senha', recipients=[email])  # Criar uma nova mensagem
            link = url_for('reset', token=token, _external=True)  # Gerar um link para redefinir a senha
            msg.body = 'Clique no link a seguir para redefinir sua senha: {}'.format(link)  # Definir o corpo da mensagem
            mail.send(msg)  # Enviar a mensagem
            return '<p>Um e-mail foi enviado para você com instruções para redefinir sua senha.</p>'

    # Se o método for GET, renderizar a página de recuperação de senha
    return render_template('recover.html')

# Rota para redefinição de senha
@app.route('/reset/<token>', methods=['GET', 'POST'])
def reset(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)  # Verificar o token
    except SignatureExpired:
        return '<p>O link expirou!</p>'  # Se o token expirou, retornar uma mensagem de erro

    if request.method == 'POST':  # Se o método for POST
        password = request.form.get('password')  # Obter a nova senha do formulário
        user = User.query.filter_by(email=email).first()  # Procurar o usuário no banco de dados
        user.password = generate_password_hash(password, method='sha256')  # Atualizar a senha do usuário
        db.session.add(user)  # Adicionar o usuário à sessão do banco de dados
        db.session.commit()  # Confirmar a sessão do banco de dados
        return redirect(url_for('login'))  # Redirecionar para a página de login

    # Se o método for GET, renderizar a página de redefinição de senha
    return render_template('reset.html')

# Rodar a aplicação Flask
if __name__ == '__main__':
    app.run(debug=True)
