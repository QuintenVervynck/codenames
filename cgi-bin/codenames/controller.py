import json
import os.path


def end_turn(code):
    # path
    path = './temp/' + code + '.json'

    # check if file exist
    if not os.path.isfile(path):
        return {'error': 'game with code: ' + code + ' , does not exist'}

    # load json
    with open(path, 'r') as js:
        game = json.load(js)
    game['current_team'] = 'BLUE' if game['current_team'] == 'RED' else 'RED'
    # write back to json file
    with open(path, 'w+') as js:
        json.dump(game, js)
    return game

