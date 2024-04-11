from flask import Flask, render_template, request, redirect, url_for
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

# Dummy user data (replace this with a proper user database)
users = {
    "a": "123",
    "b": "123",
}

@app.route('/')
def index():
    logging.debug('Index route!')
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    logging.debug('Login route!')
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            # Successful login, redirect to a protected route
            logging.debug('Login successful!')
            return redirect(url_for('protected'))
        else:
            # Login failed, redirect back to login page with a message
            logging.debug('Login failed!')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/protected')
def protected():
    logging.debug('Protected route!')
    return "This is a protected route!"

if __name__ == '__main__':
    app.run(debug=True)
