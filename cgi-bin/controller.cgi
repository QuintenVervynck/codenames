#!/usr/bin/python3

import cgi
import json
from codenames import controller

data = json.loads(cgi.FieldStorage().getvalue('data'))

print("Content-type: text/html\n")
print()
print(json.dumps(controller.end_turn(data)))