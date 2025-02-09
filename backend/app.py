from flask import Flask, json, request, jsonify
import os
from geometry_editing.simplify_object import simplify_mesh
from geometry_editing.same_vertices import same_vertices
from interaction_node.interaction_node import InteractionNode
import logging

logging.basicConfig(filename="flask_logs.txt", level=logging.DEBUG)
app = Flask(__name__)



class CommandProcessor:
    def __init__(self):
        self.history = []
        self.interaction_node = None

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
            case 'simplifyMesh':
                assets = payload.get("assets", {})
                if len(assets) > 0:
                     # Extract paths and create output paths based on asset IDs
                    input_files = [asset["path"] for asset in assets if "path" in asset]
                    output_folder = os.path.join(os.path.expanduser("~"), "Downloads")
                    os.makedirs(output_folder, exist_ok=True)  # Ensure folder 
                    reduction_percentage = 0.98
                    return simplify_mesh(input_files, output_folder, reduction_percentage)
                else:
                    return {"error" : "No valid assets provided"}
            case 'initialize_interaction_process':
                 interaction_algorithm = payload.get('interaction_algorithm', None)
                 interaction_algorithm_config = payload.get("interaction_algorithm_config", {})
                 self.interaction_node = InteractionNode()
                 if(interaction_algorithm != None):
                    is_initialized =  self.interaction_node.initialize_interaction_node()
                    is_algorithm_initialized = self.interaction_node.initialize_algorithm(interaction_algorithm, interaction_algorithm_config )
                    return {'isInitialized' : is_initialized, "isAlgorithmInitialized" : is_algorithm_initialized}
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
