import json
import random
import string
import os.path


def board(path_words_file='words.txt'):
    # how many words are in the file?
    amount_of_words = 0
    with open(path_words_file, 'r') as file:
        for _ in file:
            amount_of_words += 1

    # pick 25 randomly chosen words out of the file
    words = []
    for _ in range(25):  # pick 25 numbers (linenumbers for the words)
        temp = random.randint(0, amount_of_words)
        while temp in words:
            temp = random.randint(0, amount_of_words)
        words.append(temp)
    # sort so we only have to go over the file with words once
    words.sort()
    # change numbers to actual words
    i = 0
    with open(path_words_file, 'r') as file:
        for index, line in enumerate(file):
            if index == words[i]:
                words[i] = line.strip()
                i += 1
                if i == len(words):
                    break
    # shuffle the list
    random.shuffle(words)
    # place words in a team
    teams = ['RED', 'BLUE']
    random.shuffle(teams)
    words[0] = [words[0], 'ASSASSIN']
    for i in range(1, 10):
        words[i] = [words[i], teams[0]]
    for i in range(10, 18):
        words[i] = [words[i], teams[1]]
    for i in range(18, len(words)):
        words[i] = [words[i], 'NEUTRAL']

    # every words is false since it is a new game
    for i in range(len(words)):
        words[i].append(False)

    # shuffle words so that the teams are in random order as well
    random.shuffle(words)

    # create a code that doesn't exist yet
    code = ''.join(random.choice(string.ascii_letters) for _ in range(10))
    path = './temp/' + code + '.json'
    while os.path.exists(path):
        code = ''.join(random.choice(string.ascii_letters) for _ in range(10))
        path = './temp/' + code + '.json'

    game = {'code': code,
            'current_team': teams[0],
            'board': {},
            'winner': '',
            teams[0].lower(): 9,
            teams[1].lower(): 8}

    for i in range(len(words)):
        game['board'][i] = {'word': words[i][0],
                            'team': words[i][1],
                            'indicated': words[i][2]}

    # we also put json in a file in the temp directory
    with open(path, 'w+') as js:
        json.dump(game, js)

    return game

