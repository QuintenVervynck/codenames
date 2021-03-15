#!/usr/bin/python3

import cgi
import json
from codenames import current_state

data = json.loads(cgi.FieldStorage().getvalue('data'))

print("Content-type: text/html\n")
print()
print(json.dumps(current_state.get(data)))