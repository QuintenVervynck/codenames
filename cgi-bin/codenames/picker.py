import json
import os.path


def pick(code, index):

    # path
    path = './temp/' + code + '.json'

    # check if file exist
    if not os.path.isfile(path):
        return {'error': 'game with code: ' + code + ' , does not exist'}

    # load json
    with open(path, 'r') as js:
        game = json.load(js)
    board = game['board']
    curr_team = game['current_team']
    word = board[index]

    # errors
    # check if game is already finished
    if game['winner'] != '':
        return {"error": "game is already finished"}
    # check if already indicated
    if game['board'][index]['indicated']:
        return {'error': 'word is already indicated'}


    # turn card
    game['board'][index]['indicated'] = True

    # check card / decides what happens next
    if game['board'][index]['team'] == 'ASSASSIN':
        # winner found
        game['winner'] = 'RED' if game['current_team'] == 'BLUE' else 'BLUE'
    elif game['board'][index]['team'] == 'NEUTRAL':
        # switch current team
        game['current_team'] = 'RED' if game['current_team'] == 'BLUE' else 'BLUE'
    elif game['board'][index]['team'] != curr_team:
        # switch current team
        game['current_team'] = 'RED' if game['current_team'] == 'BLUE' else 'BLUE'
        # update cards needed to find
        game[game['current_team'].lower()] -= 1
    else:
        # update cards needed to find
        game[game['current_team'].lower()] -= 1

    # check winner
    if game[game['current_team'].lower()] == 0:
        game['winner'] = game['current_team']

    # write back to json file
    with open(path, 'w+') as js:
        json.dump(game, js)

    # return json
    return game
