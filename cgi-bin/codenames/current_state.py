import json
import os.path


def get(code):
    # path
    path = './temp/' + code + '.json'

    # check if file exist
    if not os.path.isfile(path):
        return {'error': "game with code '" + code + "' , does not exist"}

    # load json
    with open(path, "r") as js:
        board = json.load(js)
    return board
