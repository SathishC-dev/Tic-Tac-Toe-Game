import { useState } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const winner = calculateWinner(board);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    // Player move (X)
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    
    if (calculateWinner(newBoard) || newBoard.every((sq) => sq !== null)) return;

    // AI move (O)
    setTimeout(() => {
      const aiIndex = findBestMove(newBoard);
      if (aiIndex !== -1) {
        newBoard[aiIndex] = "O";
        setBoard([...newBoard]);
      }
    }, 350); // small delay for realism
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
  };

  return (
    <div className="game">
      <h1>Tic Tac Toe (vs AI)</h1>
      <div className="status">
        {winner
          ? `Winner: ${winner}`
          : board.every((sq) => sq !== null)
          ? "It's a Draw!"
          : `Your Turn (X)`}
      </div>

      <div className="board">
        {board.map((value, index) => (
          <button
            key={index}
            className="square"
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="restart-contain">
        <button className="restart" onClick={handleRestart}>
        Restart Game
      </button>
      </div>
    </div>
  );
}




function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


function evaluate(board) {
  const winner = calculateWinner(board);
  if (winner === "O") return +10;
  if (winner === "X") return -10;
  return 0;
}


function minimax(board, depth, isMaximizing) {
  let score = evaluate(board);

  if (score === 10) return score - depth; // prefer faster win
  if (score === -10) return score + depth; // prefer slower loss
  if (board.every((cell) => cell !== null)) return 0; // draw

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = +Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}


function findBestMove(board) {
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";
      let moveVal = minimax(board, 0, false);
      board[i] = null;

      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
}

export default App;
