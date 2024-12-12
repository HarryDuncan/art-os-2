import sys
import json

import sys
import json
import interaction_node.interaction_node as InteractionNode;

class CommandProcessor:
    def __init__(self):
     
        self.history = []
        self.interactionNode = None

    def process_command(self, command, data=None):
        match command:
            case 'initialize_ipc':
                return True
            case 'initialize_interaction_node':
                self.interactionNode = InteractionNode()
                self.interactionNode.InitializeInteractionNode()
                if self.interactionNode != None:
                    return True
                else:
                    return False
            case 'initialize_algorithm':
                if self.interactionNode != None:
                    initialize_algorithm_result = self.interactionNode.InitializeAlgorithm(data)
                    return initialize_algorithm_result
                else:
                    return False
            case _:
                return f"Error: Unknown command '{command}'"

    

   
        
            


command_processor = CommandProcessor()


while True:
    try:
        input_data = sys.stdin.readline().strip() 
        if input_data:
            try:
                payload = json.loads(input_data)
                command = payload.get("command")
                data = payload.get("data", {})
            except json.JSONDecodeError:
                print("Error: Invalid JSON format", flush=True)
                continue
            # Process the command
            if command:
                response = command_processor.process_command(command, data)
                final_response = {
                    "command": command,
                    "response": response
                }
                print(final_response, flush=True)  # Send response to Electron
            else:
                print("Error: Missing 'command' field", flush=True)
        else:
            print(f"Nothing found", flush=True)
    except Exception as e:
        print(f"Error: {e}", flush=True)
