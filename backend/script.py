import sys
import json
from collections import namedtuple
import sys
import json
from interaction_node.interaction_node import InteractionNode;


            
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
            case 'run_algorithm':
                if self.interactionNode != None:
                    self.interactionNode.RunAlgorithm()
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
                DataObject = namedtuple("DataObject", data.keys())
                obj = DataObject(*data.values())
            except json.JSONDecodeError:
                print("Error: Invalid JSON format", flush=True)
                continue
            # Process the command
            if command:
                response = command_processor.process_command(command, obj)
                final_response = {
                    "command": command,
                    "response": response
                }
                json_response = json.dumps(final_response)
                print(json_response, end='', flush=True)  # Send response to Electron
            else:
                print("Error: Missing 'command' field", flush=True)
        else:
            print(f"Nothing found", flush=True)
    except Exception as e:
        print(f"Error: {e}", flush=True)
