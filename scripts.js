// const playerFactory = () => {
// TODO: implement factory function to create individual named players
// }

const gameModule = (() => {

    const cells = document.querySelectorAll('.cell')
    const message = document.getElementById('message')
    const winningCombosArray = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ]
    const huPlayer = 'X'
    const aiPlayer = 'O'

    let boardArray = [0,1,2,3,4,5,6,7,8]
    let currentPlayer = 'X'
    let gameOver = false

    const aiToggle = document.getElementById('aiToggle')
    let AI = false
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
    
    function showPlayerTurn() {
        message.textContent = `${currentPlayer}'s turn to play!`
    }

    function reset() {
        cells.forEach(cell => cell.textContent = '')
        message.textContent = ''
        message.classList.remove('winner')
        boardArray = [0,1,2,3,4,5,6,7,8]
        currentPlayer = 'X'
        gameOver = false
    }

    function checkForWin() {

        winningCombosArray.forEach(combo => {

            if ( (typeof boardArray[combo[0]] != 'number') &&
                 (boardArray[combo[0]] == boardArray[combo[1]] && 
                    boardArray[combo[1]] == boardArray[combo[2]]) ) {

                let winner = boardArray[combo[0]]
                message.textContent = `${winner} won the game!`
                message.classList.add('winner')
                gameOver = true
            }
        })
    }

    function emptySquares() {
        return boardArray.filter(square => typeof square == 'number')
    }

    function checkForDraw () {
        if (emptySquares().length == 0){
            message.textContent = `Cat's game!`
            gameOver = true
        }
    }
    function cellsToggleDisabled () {
        cells.forEach(cell => {
            if (cell.style.pointerEvents == 'none') {
                cell.style.pointerEvents = 'auto'
            }
            else {
                cell.style.pointerEvents = 'none'
            }
        })
    }

    function playerTurn (cell) {
        if (cell.textContent == ''){        
            if (currentPlayer == 'X'){
                cell.textContent = 'X'
                boardArray.splice(cell.id, 1, cell.textContent)
                currentPlayer = 'O'
            }
            else if (currentPlayer == 'O'){
                cell.textContent = 'O'
                boardArray.splice(cell.id, 1, cell.textContent)
                currentPlayer = 'X'
            }

            showPlayerTurn()
            checkForWin()
            if (gameOver == false) {
                checkForDraw()
            }
        }
        else return
    }

    function checkForWinningCombo (board, player) {

        if (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
        ) {
            return true
        }
        else {
            return false
        }

    }

    function minimax(newBoard, player) {

        let availSpots = emptySquares()


        // checks for the terminal states such as win, lose, and tie and returning a value accordingly
        if (checkForWinningCombo(newBoard, huPlayer)) {
            return {score: -10};
        } else if (checkForWinningCombo(newBoard, aiPlayer)) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }

        // an array to collect all the objects
        let moves = [];

        // loop through available spots
        for (let i = 0; i < availSpots.length; i++) {
            //create an object for each and store the index of that spot that was stored as a number in the object's index key
            let move = {};
            move.index = newBoard[availSpots[i]];

            // set the empty spot to the current player
            newBoard[availSpots[i]] = player;

            // if collect the score resulted from calling minimax on the opponent of the current player
            if (player == aiPlayer) {
                let result = minimax(newBoard, huPlayer);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }

            // reset the spot to empty
            newBoard[availSpots[i]] = move.index;

            // push the object to the array
            moves.push(move);
        }

        // if it is the computer's turn loop over the moves and choose the move with the highest score
        let bestMove;
        if(player === aiPlayer) {
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else { 
            // else loop over the moves and choose the move with the lowest score
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        // return the chosen move (object) from the array to the higher depth
        return moves[bestMove];

    }

    function bestSpot () {
        return minimax(boardArray, aiPlayer).index
    }

    function aiTurn () {
        cellsToggleDisabled()

        console.log('AI turn to move')

        console.log('AI is thinking...')

        let move = bestSpot()

        let cell = document.getElementById(move)

        sleep(1000).then(() => {
            console.log ('AI is done thinking.')
            console.log('AI Move: ' + move )

            cell.textContent = 'O'
            boardArray.splice(cell.id, 1, cell.textContent)
            currentPlayer = 'X'

            cellsToggleDisabled()
            showPlayerTurn()
            checkForWin()
            if (gameOver == false) {
                checkForDraw()
            }
          })
    }

    function cellClick (cell) {

        if (gameOver == true){
            reset()
        }

        playerTurn(cell)

        if (AI == true && gameOver == false) {
            aiTurn()
        }

    }

    cells.forEach(cell => cell.addEventListener('click', () => cellClick(cell)))

    aiToggle.addEventListener('click', (e) => {
        if (e.target.checked){
            AI = true
            reset()
            console.log('AI turned on')
        }
        else {
            AI = false
            reset()
            console.log('AI turned off')
        }
    })

})()