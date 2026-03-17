import json
import time
import os
import sys
import socketio
from pynput import keyboard
from dotenv import load_dotenv

load_dotenv()
config_path = os.getenv('CONFIG_PATH', 'config.json')

with open(config_path, 'r') as f:
    config = json.load(f)

sio = socketio.Client()

@sio.event
def connect():
    print(f"Connected to server: {config['serverUrl']}")

@sio.event
def disconnect():
    print("Disconnected from server")

def send_event(event_name):
    payload = {
        "gameToken": config['tokens']['gameToken'],
        "authToken": config['tokens']['authToken'],
        "timestamp": int(time.time() * 1000)
    }
    if sio.connected:
        sio.emit(event_name, payload)
        print(f"Sent event: {event_name}")
    else:
        print(f"Failed to send {event_name}: Not connected")

def kill_program():
    print("\nKill key pressed. Shutting down...")
    if sio.connected:
        sio.disconnect()
    os._exit(0) # Force exit all threads

hotkeys = {}

# Add standard bindings
for binding in config['keyBindings']:
    combo = "+".join([f"<{m.lower()}>" for m in binding['modifiers']] + [f"<{binding['key'].lower()}>"])
    hotkeys[combo] = lambda b=binding: send_event(b['eventName'])

# Add the Kill Key binding
if "killKey" in config:
    kill_combo = f"<{config['killKey'].lower()}>"
    hotkeys[kill_combo] = kill_program

try:
    sio.connect(config['serverUrl'])
except Exception as e:
    print(f"Connection failed: {e}")

print(f"Listening... Press {config.get('killKey', 'N/A')} to exit.")

with keyboard.GlobalHotKeys(hotkeys) as h:
    h.join()