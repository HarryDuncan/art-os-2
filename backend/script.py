import sys
import json

# Function to process incoming commands
def process_command(command, data=None):
    if command == "/say":
        # Respond with a simple message
        return f"You said: {data.get('message', 'nothing')}"
    
    elif command == "/math/add":
        # Perform addition
        numbers = data.get('numbers', [])
        if isinstance(numbers, list) and all(isinstance(num, (int, float)) for num in numbers):
            return f"Sum: {sum(numbers)}"
        return "Error: Invalid numbers for addition"

    elif command == "/reverse":
        # Reverse a string
        text = data.get('text', '')
        return text[::-1] if isinstance(text, str) else "Error: Invalid text to reverse"
    
    elif command == "/echo":
        # Echo the entire data payload
        return json.dumps(data)
    
    else:
        # Handle unknown commands
        return f"Error: Unknown command '{command}'"

# Continuously read from stdin
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
                response = process_command(command, data)
                print(response, flush=True)  # Send response to Electron
            else:
                print("Error: Missing 'command' field", flush=True)
        else:
            print(f"Nothing found", flush=True)
    except Exception as e:
        print(f"Error: {e}", flush=True)
