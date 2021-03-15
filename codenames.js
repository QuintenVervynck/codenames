

class Codenames {

    constructor() {
        // the game-state
        this.state = undefined;

        // the code of this game
        this.code = undefined;
        // visualisation of the code
        this.currentCodeLabel = document.getElementById("current_code_label");

        // the teams
        this.currentTeam = undefined;
        this.victoryTeam = '';
        // visualisation of the current team
        this.currentTeamLabel = document.getElementById('team_label');
        this.victoryTeamLabel = document.getElementById('winner_label');

        // the current board
        this.board = undefined;
        // visualisation of the board
        this.boardDiv = document.getElementById('gameboard');

        // whether this is gamemaster or not
        this.spymaster = false;

        // the div that shows game-controls
        this.gameControlDiv = document.getElementById('game_control');
        this.spymasterToggler = document.getElementById('spymaster_toggle')

        // the updater
        this.updateChecker = undefined;
    }


    /**
     * creates a new game
     */
    newGame() {
        // stop the checking for updates
        window.clearInterval(this.updateChecker);
        // start new game
        fetch("cgi-bin/creator.cgi?")
            .then(response => response.json())
            .then(data => {
                this.gameControlDiv.classList.remove('invis');
                this.state = data;
                this.updateCode(data['code']);
                this.updateCurrentTeam(data['winner'], data['current_team']);
                this.updateBoard(data['board']);
            });
        // start new update checker
        this.updateChecker = this.getUpdateRequiredChecker();
    }


    /**
     * connects to an existing game
     */
    connect(code) {
        // stop the checking for updates
        window.clearInterval(this.updateChecker);
        this.code = code;
        fetch("cgi-bin/current_state.cgi?data=" + JSON.stringify(this.code))
            .then(response => response.json())
            .then(data => {
                if ('error' in data) { // the code doesn't exist
                    // don't show anything of a game
                    this.currentTeamLabel.innerText = "";
                    this.boardDiv.innerHTML = "";
                    this.gameControlDiv.classList.add('invis') ;
                    // show alert to user,
                    // without timeout it doesn't first clear the old game visuals
                    setTimeout(() => alert(data['error']), 150);
                }
                else {
                    // make visable
                    this.gameControlDiv.classList.remove('invis');
                    // change ENTIRE state
                    this.state = data;
                    this.updateCurrentTeam(data['winner'], data['current_team'])
                    this.updateCode(data['code']);
                    this.updateBoard(data['board']);
                    // start the checking for updates
                    this.updateChecker = this.getUpdateRequiredChecker();
                }
            });
    }


    /**
     * returns an interval that updates the currentState every 1000ms
     */
    getUpdateRequiredChecker() {
        return setInterval(() => {
            fetch("cgi-bin/current_state.cgi?data=" + JSON.stringify(this.code))
                .then(response => response.json())
                .then(state => {
                    if ((! this.stateIsEqual(state))) {
                        this.updateCurrentState();
                    }
                });
        }, 500);
    }


    /**
     * checks if this.state = state given as param
     */
    stateIsEqual(state) {
        for (let key = 0 ; key < 25 ; key += 1) {
            if (state['board'][key]['indicated'] !== this.state['board'][key]['indicated']) {
                return false;
            }
        }
        return !(
            state['winner'] !== this.victoryTeam
            || state['code'] !== this.code
            || state['current_team'] !== this.currentTeam
        );
    }


    /**
     * updates the game-state and all visualisation of the game-state,
     * will only be called when a new update is found by this.updateChecker
     */
    updateCurrentState() {
        // stop the checking for updates
        window.clearInterval(this.updateChecker);
        fetch("cgi-bin/current_state.cgi?data=" + JSON.stringify(this.code))
            .then(response => response.json())
            .then(data => {
                this.state = data;
                this.updateCurrentTeam(data['winner'], data['current_team'])
                this.updateCode(data['code']);
                this.updateBoard(data['board']);
                // stop the checking for updates
                this.updateChecker = this.getUpdateRequiredChecker();
            });
    }


    /**
     * updates the code and all visualisation of the code
     */
    updateCode(code) {
        this.code = code;
        this.currentCodeLabel.innerText = "";
        this.currentCodeLabel.appendChild(
            document.createTextNode("Share this code: " + this.code)
        );
    }


    /**
     * updates the current team and all visualisation of the current team
     */
    updateCurrentTeam(victoryTeam, currentTeam) {
        this.victoryTeam = victoryTeam;
        this.currentTeam = currentTeam;
        if (victoryTeam === '') {
            this.currentTeamLabel.innerText = 'Current team: ' + currentTeam + ", remaining cards: " + this.state[currentTeam.toLowerCase()];
            this.victoryTeamLabel.innerText = '';
        }
        else {
            this.gameControlDiv.classList.add('invis')
            this.currentTeamLabel.innerText = 'The ' + victoryTeam.toLowerCase() + ' team won the game!';
            this.victoryTeamLabel.innerText = 'The ' + victoryTeam.toLowerCase() + ' team won the game!';
        }
    }


    /**
     * updates the board and all visualisation of the board
     */
    updateBoard (board) {
        this.board = board;

        // clear old board
        this.boardDiv.innerHTML = '';

        // new table for board
        let table = document.createElement('table');

        let r = 0; // count elements, every 5 we wil create new row
        let row = undefined;
        for (let i = 0 ; i < 25 ; i ++) { // always 25 words
            if (r % 5 === 0) { // time for a new row (placed 5 words)
                row = document.createElement("tr");
                table.appendChild(row);
            }
            r += 1;

            // create table cell and append to row
            let cell = document.createElement('td');
            cell.classList.add('td'); // don't know why, but it looks like it doesn't get the td class automaticly
            row.appendChild(cell);

            // create word button and append to table cell
            let word_btn = document.createElement("button");
            word_btn.id = ""+i;
            word_btn.classList.add("word_btn");
            cell.appendChild(word_btn);

            // put word as text in the button
            let word = document.createElement("h3");
            word.appendChild(document.createTextNode(board[i]['word']));
            word_btn.appendChild(word);

            // other cool things for the word buttons
            // when spymaster
            if (this.spymaster) {
                // add it's team to classlist, this gives the button a bg color of its team
                word_btn.classList.add(board[i]['team'].toLowerCase());
                // if not yet indicated we blur it a litle bit
                if (! this.board[i]['indicated']) {
                    word_btn.classList.add("spymaster");
                }
            }
            // when not spymaster
            else {
                // only visualize the color if the word has already been clicked on
                if (this.board[i]['indicated']) {
                    word_btn.classList.add(board[i]['team'].toLowerCase());
                }
                // if it is not clicked yet and there is not yet a winner, we need to make it clickable
                else if (this.victoryTeam === '') {
                    word_btn.classList.add('clickable')
                    let that = this;
                    word_btn.onclick = () => that.clicked(word_btn);
                }
            }
        }
        this.boardDiv.appendChild(table);
    }


    /**
     * gets called when a word_div is clicked
     */
    clicked(word_div) {
        window.clearInterval(this.updateChecker);
        // it is beter to have an if here, and don't do a fetch(), because that takes time
        if (this.victoryTeam === '' && (! this.board[word_div.id]['indicated'])) {
            fetch("cgi-bin/picker.cgi?data=" + JSON.stringify({'code': this.code, 'index': word_div.id}))
                .then(response => response.json())
                .then(data => {
                    this.updateCurrentTeam(data['winner'], data['current_team']);
                    this.updateBoard(data['board']);
                })
            this.updateChecker = this.getUpdateRequiredChecker();
        }
    }


    /**
     * makes this the spymaster
     */
    toggleSpymaster() {
        if (this.spymaster) {
            // become normal spy
            this.spymaster = false
            // button to become spymaster
            this.spymasterToggler.innerText = "Make me spymaster"
        }
        else {
            // becomes spymaster
            this.spymaster = true
            // button to becom normal spy again
            this.spymasterToggler.innerText = "Make me spy"
        }

        this.updateBoard(this.board);
    }


    /**
     * ends the turn for the current team
     */
    endTurn() {
        window.clearInterval(this.updateChecker);
        fetch("cgi-bin/controller.cgi?data=" + JSON.stringify(this.code))
            .then(response => response.json())
            .then(data => {
                this.state = data;
                this.updateCurrentTeam(data['winner'], data['current_team']);
            });
        this.updateChecker = this.getUpdateRequiredChecker();
    }


}