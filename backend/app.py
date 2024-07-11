from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/time', methods=['GET'])
def get_time():
    # You can return a simple message or any other data
    return jsonify({"message": "Pomodoro Timer Backend"})

if __name__ == '__main__':
    app.run(debug=True)
