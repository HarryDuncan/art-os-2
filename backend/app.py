from flask import Flask, json, request, jsonify
import os
from geometry_editing.same_vertices import same_vertices
import logging

logging.basicConfig(filename="flask_logs.txt", level=logging.DEBUG)
app = Flask(__name__)



class CommandProcessor:
    def __init__(self):
        self.history = []
        self.interactionNode = None

    def process_command(self, command, payload=None):
        match command:
            case 'sameVerticies':
                assets = payload.get("assets", {})
                if len(assets) > 0:
                     # Extract paths and create output paths based on asset IDs
                    input_files = [asset["path"] for asset in assets if "path" in asset]
                    output_folder = os.path.join(os.path.expanduser("~"), "Downloads")
                    os.makedirs(output_folder, exist_ok=True)  # Ensure folder exists
                    return same_vertices(input_files, output_folder)
                  
                else:
                    return {"error": "No valid assets provided"}
               
            case 'initialize_ipc':
                return True
            case _:
                return f"Error: Unknown command '{command}'"

command_processor = CommandProcessor()

@app.route('/process_command', methods=['POST'])
def process_command():
    logging.info("Received command request")
    try:
        payload = request.get_json()
       
        if not payload:
            return jsonify({"error": "Invalid JSON format"}), 400
        
        command = payload.get("command")
        if not command:
            return jsonify({"error": "Missing 'command' field"}), 400  
        response = command_processor.process_command(command, payload)
        return jsonify({"command": command, "response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_app_info', methods=['GET'])
def get_app_info():
    return jsonify({"isRunning": True})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
