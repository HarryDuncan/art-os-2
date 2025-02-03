from flask import Flask, request, jsonify
from collections import namedtuple


app = Flask(__name__)

class CommandProcessor:
    def __init__(self):
        self.history = []
        self.interactionNode = None

    def process_command(self, command, data=None):
        match command:
            case 'sameVerticies':
                return 'test'
            case 'initialize_ipc':
                return True
            case _:
                return f"Error: Unknown command '{command}'"

command_processor = CommandProcessor()

@app.route('/process_command', methods=['POST'])
def process_command():
    print('test command')
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "Invalid JSON format"}), 400
        
        command = payload.get("command")
        data = payload.get("data", {})
        DataObject = namedtuple("DataObject", data.keys())
        obj = DataObject(*data.values())
        
        if not command:
            return jsonify({"error": "Missing 'command' field"}), 400
        
        response = command_processor.process_command(command, obj)
        return jsonify({"command": command, "response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_app_info', methods=['GET'])
def get_app_info():
     return jsonify({"isRunning" : True})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

