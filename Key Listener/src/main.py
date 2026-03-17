import tkinter as tk
from utils.config_helper import get_config
from websockets.WebSocketWorker import WebSocketWorker

class AppUI:
    def __init__(self, root):
        self.root = root
        self.root.title("WS Controller")

        # 1. Load and Validate via your Helper
        try:
            self.config = get_config()
        except Exception as e:
            print(f"Config Error: {e}")
            # Show error in UI and prevent start
            tk.Label(root, text=f"Config Error: {e}", fg="red").pack()
            return

        # 2. Initialize Worker with the validated 'serverUrl'
        self.worker = WebSocketWorker(
            self.config['serverUrl'], 
            self.handle_incoming_msg
        )

        # 3. UI Setup
        self.status_label = tk.Label(root, text="Status: Disconnected", fg="grey")
        self.status_label.pack(pady=10)

        self.btn_start = tk.Button(root, text="Start Connection", command=self.start)
        self.btn_start.pack(pady=5)

        self.btn_stop = tk.Button(root, text="Stop Connection", command=self.stop, state=tk.DISABLED)
        self.btn_stop.pack(pady=5)

    def handle_incoming_msg(self, message):
        # This runs when the server sends data
        print(f"Received from Server: {message}")

    def start(self):
        self.worker.start()
        self.status_label.config(text="Status: Active", fg="green")
        self.btn_start.config(state=tk.DISABLED)
        self.btn_stop.config(state=tk.NORMAL)

    def stop(self):
        self.worker.stop()
        self.status_label.config(text="Status: Disconnected", fg="red")
        self.btn_start.config(state=tk.NORMAL)
        self.btn_stop.config(state=tk.DISABLED)

if __name__ == "__main__":
    root = tk.Tk()
    app = AppUI(root)
    root.mainloop()