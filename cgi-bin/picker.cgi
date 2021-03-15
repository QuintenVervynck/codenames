#!/usr/bin/python3

import cgi
import json
from codenames import picker

data = json.loads(cgi.FieldStorage().getvalue('data'))
code = data['code']
index = data['index']

print("Content-type: text/html\n")
print()
print(json.dumps(picker.pick(code, index)))
