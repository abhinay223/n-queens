from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Flask, render_template

app = Flask(__name__)
CORS(app)  
@app.route('/')
def home():
    
    return render_template('index.html')
# Constants
BOARD_SIZE = 8

# Initialize the chessboard as a 2D list
board = [[0 for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]


def is_valid_move(row, col):
    "Check if placing a queen at (row, col) is valid"
    
    for i in range(BOARD_SIZE):
        if board[row][i] == 1 or board[i][col] == 1:
            return False

    "Check diagonals"

    for i in range(BOARD_SIZE):
        if (
            row - i >= 0 and col - i >= 0 and board[row - i][col - i] == 1
        ) or (
            row - i >= 0 and col + i < BOARD_SIZE and board[row - i][col + i] == 1
        ) or (
            row + i < BOARD_SIZE and col - i >= 0 and board[row + i][col - i] == 1
        ) or (
            row + i < BOARD_SIZE and col + i < BOARD_SIZE and board[row + i][col + i] == 1
        ):
            return False

    return True


@app.route('/place', methods=['POST'])
def place_queen():
     "Place a queen on the board"
    data = request.json
    row = data['row']
    col = data['col']

    if is_valid_move(row, col):
        board[row][col] = 1
        return jsonify({"success": True, "message": "Queen placed successfully!"})
    else:
        return jsonify({"success": False, "message": "Invalid move. Queen threatens another queen."})


@app.route('/reset', methods=['POST'])
def reset_board():
    "Reset the chessboard"
    global board
    board = [[0 for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
    return jsonify({"success": True, "message": "Board reset successfully!"})


@app.route('/status', methods=['GET'])
def board_status():
    "Return the current state of the board"
    return jsonify({"board": board})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
