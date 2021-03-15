#!/usr/bin/python3

import cgi
import json
from codenames import creator



print("Content-type: text/html\n")
print()
print(json.dumps(creator.board()))
