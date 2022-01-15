function GameState(socket, sb) {
    this.playerType = null;
    this.playerTurn = null;
    this.socket = socket;
    this.gameGrid = [[0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]];
    this.statusBar = sb;
    this.stack = null;
    this.numberOfDiscs = 0;

    this.sec = 0;
    this.min = 0;
    this.stoptime = true;
}
GameState.prototype.startTimer = function () {
    if (this.stoptime == true) {
          this.stoptime = false;
          timer(gs);
      }
  }
GameState.prototype.stopTimer = function () {
    if (this.stoptime == false) {
      this.stoptime = true;
    }
  }
  function timer(gs) {
    if (gs.stoptime == false) {
    gs.timerCycle();
    gs.sec = gs.sec + 1;
    setInterval(timer(gs), 1000);
    }
  }
GameState.prototype.timerCycle = function () {
    if (this.stoptime == false) {
    this.sec = parseInt(this.sec);
    this.min = parseInt(this.min);

    if (this.sec == 60) {
        this.min = this.min + 1;
        this.sec = 0;
    }
<<<<<<< Updated upstream

    if (this.sec < 10 || this.sec == 0) {
        this.sec = '0' + this.sec;
    }
    if (this.min < 10 || this.min == 0) {
        this.min = '0' + this.min;
    }

=======

    if (this.sec < 10 || this.sec == 0) {
        this.sec = '0' + this.sec;
    }
    if (this.min < 10 || this.min == 0) {
        this.min = '0' + this.min;
    }

>>>>>>> Stashed changes
    this.document.getElementById("timer").innerHTML = "Time e: " + this.min + ":" + this.sec;
  }
}
GameState.prototype.getPlayerType = function () {
    return this.playerType;
};

GameState.prototype.getPlayerTurn = function () {
    return this.playerTurn;
};

GameState.prototype.setPlayerTurn = function (p) {
    this.playerTurn = p;
};

GameState.prototype.setPlayerType = function (p) {
    this.playerType = p;
};

GameState.prototype.initializeStack = function () {
    this.stack = Array(7).fill(5);
}
GameState.prototype.fourInARow = function(player) {
    return horizontalCheck(player, this.gameGrid) || verticalCheck(player, this.gameGrid)|| diagonalCheck(player, this.gameGrid) || secondDiagonalCheck(player, this.gameGrid);
}
function horizontalCheck(player, grid){
    for (let row = 0; row < grid.length; row++){
        for (let col =0; col < 4; col++){
            if(grid[row][col] == player && grid[row][col+1] == player && grid[row][col+2] == player && grid[row][col+3] == player)
               return true;
        }
    }
    return false;
}

function verticalCheck(player, grid){
    for (let col = 0; col < 7; col++){
        for (let row = 0; row < 3; row++){
            if(grid[row][col] == player && grid[row+1][col] == player && grid[row+2][col] == player && grid[row+3][col] == player)
               return true;
         }
    }
    return false;
}

function diagonalCheck(player, grid){
    for(let col = 0; col < 4; col++){
        for (let row = 0; row < 3; row++){
            if(grid[row][col] == player && grid[row+1][col+1] == player && grid[row+2][col+2] == player && grid[row+3][col+3] == player)
                    return true;

            }
        }
        return false;
}

function secondDiagonalCheck(player, grid){
    for(let col = 0; col < 4; col++){
        for (let row = 5; row > 2; row--){
            if(grid[row][col] == player && grid[row-1][col+1] == player && grid[row-2][col+2] == player && grid[row-3][col+3] == player)
                    return true;

        }
    }
    return false;
}

GameState.prototype.checkIfOver = function() {
    //the grid is full, so the game is a tie
    if(this.numberOfDiscs == 42) {
        return "TIE";
    }
    //check if player A won
    if(this.getPlayerTurn() == "B") {
        if(this.fourInARow(1)) {
            return 'A';
        }
    }
    //check if player B won
    else {
        if(this.fourInARow(2)) {
            return 'B';
        }
    }
    //game is not over
    return null;
};

GameState.prototype.updateGame = function(clickedSquare) {
    if(this.stack[parseInt(clickedSquare[5])] >= 0) {
        if(this.getPlayerTurn() == "A") {
            this.gameGrid[this.stack[parseInt(clickedSquare[5])]][parseInt(clickedSquare[5])] = 1;
             document.getElementById("cell" +this.stack[parseInt(clickedSquare[5])].toString() + clickedSquare[5]) .className = "red";
            this.setPlayerTurn("B");
            if(this.getPlayerType() == "A") {
                const outgoingMsg = Messages.O_MAKE_A_GUESS;
                outgoingMsg.data = "cell" + this.stack[parseInt(clickedSquare[5])].toString() + clickedSquare[5];
                this.socket.send(JSON.stringify(outgoingMsg));
                const squares = document.querySelectorAll(".grid div");
                Array.from(squares).forEach(function (el) {
                    var e = el.cloneNode(true);
                    e.id = el.id;
                    e.className = el.className;
                    el.replaceWith(e);
                })
                this.statusBar.setStatus(Status["wait"]);
            }
        }

        else {
            this.gameGrid[this.stack[parseInt(clickedSquare[5])]][parseInt(clickedSquare[5])] = 2;
             document.getElementById("cell" +this.stack[parseInt(clickedSquare[5])].toString() + clickedSquare[5]) .className = "yellow";
             this.setPlayerTurn("A");
             if(this.getPlayerType() == "B") {
                 const outgoingMsg = Messages.O_MAKE_A_GUESS;
                 outgoingMsg.data = "cell" +this.stack[parseInt(clickedSquare[5])].toString() + clickedSquare[5];
                 this.socket.send(JSON.stringify(outgoingMsg));
                 const squares = document.querySelectorAll(".grid div");
                 Array.from(squares).forEach(function (el) {

                     var e = el.cloneNode(true);
                     e.id = el.id;
                     e.className = el.className;
                     el.replaceWith(e);
                 })
                 this.statusBar.setStatus(Status["wait"]);
             }
        }

        //console.log(outgoingMsg.data);
        this.stack[parseInt(clickedSquare[5])] --;
        this.numberOfDiscs++;
    }



    const winner = this.checkIfOver();
    if(winner != null) {
        this.stopTimer();
        const elements = document.querySelectorAll(".cell");
        Array.from(elements).forEach(function (el) {
          el.style.pointerEvents = "none";
        });

        let alertString;
        if(winner == "TIE") {
            alertString = Status["gameTied"];
            alertString += Status["playAgain"];
            this.statusBar.setStatus(alertString);
            let finalMsg = Messages.S_GAME_TIED;
            this.socket.send(finalMsg);
        }
        else {
            if (winner == this.playerType) {
                alertString = Status["gameWon"];
            } else {
                alertString = Status["gameLost"];
            }
            alertString += Status["playAgain"];
            this.statusBar.setStatus(alertString);

            let finalMsg = Messages.O_GAME_WON_BY;
            finalMsg.data = winner;
            this.socket.send(JSON.stringify(finalMsg));
        }
        this.socket.close();
    }
    console.table(this.gameGrid);
}

    GameState.prototype.initialize = function (gs) {
        const squares = document.querySelectorAll(".grid div");
        Array.from(squares).forEach(function (el) {
            el.addEventListener('mouseover',  function f1(e) {
                const hoveredSquare = e.target.id;
                const column = hoveredSquare[5];
                const nextAvailable = gs.stack[parseInt(column)];
                if (gs.getPlayerTurn() == "A")
                    var colorClass = "takenRed";
                else
                    colorClass = "takenYellow";
                if(nextAvailable >= 0)
                    document.getElementById("cell" + nextAvailable.toString() + column).className = colorClass;
            });
            el.addEventListener('mouseleave', function f2(e) {
                const hoveredSquare = e.target.id;
                const column = hoveredSquare[5];
                const nextAvailable = gs.stack[parseInt(column)];
                if(nextAvailable >= 0)
                    document.getElementById("cell" + nextAvailable.toString() + column).className = "cell";
            });

            el.addEventListener('click', function singleClick(e) {
                const clickedSquare = e.target["id"];
                gs.updateGame(clickedSquare);
            });
        })

    }

function StatusBar() {
    this.setStatus = function (status) {
        document.getElementById("status").innerHTML = status;
    };
}

(function setup() {
    const socket = new WebSocket(Setup.WEB_SOCKET_URL);
    const sb = new StatusBar();
    const gs = new GameState(socket, sb);
    
    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        //set player type
        if (incomingMsg.type === Messages.T_PLAYER_TYPE) {
            gs.setPlayerType(incomingMsg.data);
            if(gs.getPlayerType() == "A") {
<<<<<<< Updated upstream
                sb.setStatus(Status["waitForOpponent"]);
            }
                
=======
<<<<<<< HEAD
                document.getElementById("left").style.backgroundColor = "red";
                document.getElementById("right").style.backgroundColor = "yellow";
                sb.setStatus(Status["waitForOpponent"]);
            }

=======
                sb.setStatus(Status["waitForOpponent"]);
            }

>>>>>>> a55043e5dbc8758e6a059a21eaaa0ad02bbc487a
>>>>>>> Stashed changes
            else {
                document.getElementById("left").style.backgroundColor = "yellow";
                document.getElementById("right").style.backgroundColor = "red";
                sb.setStatus(Status["wait"]);
                let msg = Messages.O_PLAYER_2;
                socket.send(JSON.stringify(msg));
            }
            gs.setPlayerTurn("A");
            gs.initializeStack();
<<<<<<< Updated upstream
            
=======

>>>>>>> Stashed changes
        }

        if(incomingMsg.type == Messages.T_PLAYER_2) {
            if(gs.getPlayerType() == "A") {
                sb.setStatus(Status["picked"]);
                gs.initialize(gs);
            }
        }
        if (incomingMsg.type == Messages.T_MAKE_A_GUESS) {
            if(gs.getPlayerTurn() == "A") {
                if(gs.getPlayerType() == "B") {
                    sb.setStatus(Status["picked"]);
                    gs.updateGame(incomingMsg.data);
                    gs.initialize(gs);
                    gs.setPlayerTurn("B");

                }
            }

            else if(gs.getPlayerTurn() == "B") {
                if(gs.getPlayerType() == "A") {
                    sb.setStatus(Status["picked"]);
                    gs.updateGame(incomingMsg.data);
                    gs.initialize(gs);
                    gs.setPlayerTurn("A");
            }
                else
                    sb.setStatus(Status["wait"]);
             }
        }
        }
        socket.onopen = function () {
            socket.send("{}");
        };

        //server sends a close event only if the game was aborted from some side
        socket.onclose = function () {
            if (gs.checkIfOver() == null) {
<<<<<<< Updated upstream
                
=======

>>>>>>> Stashed changes
                sb.setStatus(Status["aborted"]);
            }
        };
    socket.onerror = function () {};
})();