import Player from "./components/player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import { useState } from "react";
import Log from "./components/log.jsx";
import { WINNING_COMBINATIONS } from "./components/winningcombination.js";

function deriveActivePlayer(gameTurns) {
  return gameTurns.length % 2 === 0 ? "X" : "O";
}

function checkWinner(gameTurns, recentPlayer) {
  const playerMoves = gameTurns
    .filter((turn) => turn.player === recentPlayer)
    .map((turn) => `${turn.square.row},${turn.square.col}`);

  return WINNING_COMBINATIONS.some((combination) =>
    combination.every((position) => playerMoves.includes(position))
  );
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [hasWinner, setHasWinner] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // State for player names
  const [playerNames, setPlayerNames] = useState({
    X: "Player 1",
    O: "Player 2",
  });

  const activePlayer = deriveActivePlayer(gameTurns);

  function handleSelectSquare(rowIndex, colIndex) {
    if (hasWinner || gameOver) return;

    const isSquareTaken = gameTurns.some(
      (turn) => turn.square.row === rowIndex && turn.square.col === colIndex
    );

    if (isSquareTaken) return;

    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        {
          square: { row: rowIndex, col: colIndex },
          player: currentPlayer,
        },
        ...prevTurns,
      ];

      if (checkWinner(updatedTurns, currentPlayer)) {
        setHasWinner(true);
        setWinner(playerNames[currentPlayer]); // Use the updated name
      } else if (updatedTurns.length === 9) {
        setGameOver(true);
      }

      return updatedTurns;
    });
  }

  function resetGame() {
    setGameTurns([]);
    setHasWinner(false);
    setGameOver(false);
    setWinner(null);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayerNames((prevNames) => ({
      ...prevNames,
      [symbol]: newName,
    }));
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            name={playerNames.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onNameChange={(newName) => handlePlayerNameChange("X", newName)}
          />
          <Player
            name={playerNames.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onNameChange={(newName) => handlePlayerNameChange("O", newName)}
          />
        </ol>
        <GameBoard onSelectSquare={handleSelectSquare} turns={gameTurns} />
      </div>

      {hasWinner && <p>{`${winner} Wins!`}</p>}
      {gameOver && !hasWinner && <p>It's a Draw!</p>}

      <Log turns={gameTurns} />
      <button onClick={resetGame} id='reset-game'>Reset Game</button>
    </main>
  );
}

export default App;
