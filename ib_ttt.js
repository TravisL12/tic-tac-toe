const Board = () => {
  const [tiles, setTiles] = React.useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [playerTurnIdx, setPlayerTurnIdx] = React.useState(0);
  const players = ["x", "o"];

  const checkIsGameOver = (updatedTiles) => {
    const winScenarios = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [6, 4, 2],
    ];

    for (let i = 0; i < winScenarios.length; i++) {
      const scenario = winScenarios[i];
      if (
        scenario.every(
          (square) => updatedTiles[square] === players[playerTurnIdx]
        )
      ) {
        return true;
      }
    }

    return tiles.every((tile) => tile);
  };

  const playTile = (idx) => {
    const updatedTiles = [...tiles];
    updatedTiles[idx] = players[playerTurnIdx];
    setTiles(updatedTiles);

    if (checkIsGameOver(updatedTiles)) {
      console.log(`Player ${playerTurnIdx + 1} wins`);
      setIsGameOver(true);
    } else {
      setPlayerTurnIdx(playerTurnIdx === 1 ? 0 : 1);
    }
  };

  return (
    <div className="board">
      {tiles.map((tile, idx) => {
        return (
          <div
            className="tile"
            key={idx}
            onClick={() => {
              if (!isGameOver) playTile(idx);
            }}
          >
            {tile}
          </div>
        );
      })}
    </div>
  );
};

const App = () => (
  <div className="container">
    <Board />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
