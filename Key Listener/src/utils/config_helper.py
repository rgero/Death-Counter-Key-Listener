import os
from dotenv import load_dotenv, set_key
from pathlib import Path
import json

# Load environment variables from .env file
ENV_PATH = Path(".env")
load_dotenv(ENV_PATH)

def get_config():
  config = json.load(open(os.getenv('CONFIG_PATH', 'config.json')))

  # Validate the config structure
  if 'serverUrl' not in config:
    raise ValueError("Config must contain 'serverUrl'")
  if 'tokens' not in config or 'gameToken' not in config['tokens'] or 'authToken' not in config['tokens']:
    raise ValueError("Config must contain 'tokens' with 'gameToken' and 'authToken'")
  if 'keyBindings' not in config or not isinstance(config['keyBindings'], list):
    raise ValueError("Config must contain 'keyBindings' as a list")
  
  return config
