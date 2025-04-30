from flask import Flask, render_template, request, Response
from zeroc import run

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run', methods=['POST'])
def run_code():
    code = request.form.get('code', '')
    try:
        output = run(code)
        if output and not output.endswith('\n'):
            output += '\n'
    except Exception as e:
        output = f"Error: {str(e)}\n"
    return Response(output, mimetype='text/plain')

if __name__ == '__main__':
    app.run(debug=True)
