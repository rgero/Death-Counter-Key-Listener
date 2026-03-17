import websocket
import threading

class WebSocketWorker:
    def __init__(self, url, on_message_callback):
        self.url = url
        self.on_message_callback = on_message_callback
        self.ws = None

    def _run(self):
        self.ws = websocket.WebSocketApp(
            self.url,
            on_message=lambda ws, msg: self.on_message_callback(msg),
            on_error=lambda ws, err: print(f"WS Error: {err}"),
            on_close=lambda ws, code, msg: print("WS Closed")
        )
        self.ws.run_forever()

    def start(self):
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def stop(self):
        if self.ws:
            self.ws.close()