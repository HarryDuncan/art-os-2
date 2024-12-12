import sys

# Continuously read from stdin
while True:
    line = sys.stdin.readline().strip()
    if line:
        print(f"Echo: {line}", flush=True)  # Send response to Electron
       
