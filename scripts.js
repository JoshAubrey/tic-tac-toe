// const playerFactory = () => {

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

    let boardArray = ['','','','','','','','']
    let currentPlayer = 'X'
    let gameOver = false
    
    function showPlayerTurn() {
        message.textContent = `${currentPlayer}'s turn to play!`
    }

    function reset() {
        cells.forEach(cell => cell.textContent = '')
        message.textContent = ''
        message.classList.remove('winner')
        boardArray = ['','','','','','','','']
        currentPlayer = 'X'
        gameOver = false
    }

    function checkForWin() {

        winningCombosArray.forEach(combo => {

            if ( (boardArray[combo[0]] != '') &&
                 (boardArray[combo[0]] == boardArray[combo[1]] && 
                    boardArray[combo[1]] == boardArray[combo[2]]) ) {

                    let winner = boardArray[combo[0]]
                    message.textContent = `${winner} won the game!`
                    message.classList.add('winner')
                    gameOver = true
            }
        })
    }

    function checkForDraw () {
        if (!boardArray.includes('')){
            message.textContent = `Cat's game!`
            gameOver = true
        }
    }

    cells.forEach(cell => cell.addEventListener('click', (e) => {
        if (gameOver == true){
            reset()
        }

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

            checkForDraw()
        }
    } ))

})()