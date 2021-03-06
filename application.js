const winCases = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

class Cpu {
  constructor(board, character) {
    this.board = board;
    this.o = character;
    this.currentStrategy;
  }

  checkCurrentStrategy() {
    if (!this.currentStrategy) {
      return false;
    }

    return this.currentStrategy.filter((e, i, a) => {
      return (
        (!this.board.spaces[a[0]].tagged ||
          this.board.spaces[a[0]].tagged === this.o) &&
        (!this.board.spaces[a[1]].tagged ||
          this.board.spaces[a[1]].tagged === this.o) &&
        (!this.board.spaces[a[2]].tagged ||
          this.board.spaces[a[2]].tagged === this.o)
      );
    }).length;
  }

  findStrategy() {
    const availableStrategies = winCases.filter((c) => {
      return (
        (!this.board.spaces[c[0]].tagged ||
          this.board.spaces[c[0]].tagged === this.o) &&
        (!this.board.spaces[c[1]].tagged ||
          this.board.spaces[c[1]].tagged === this.o) &&
        (!this.board.spaces[c[2]].tagged ||
          this.board.spaces[c[2]].tagged === this.o)
      );
    });

    return availableStrategies.length
      ? this.rankStrategies(availableStrategies)
      : [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  rankStrategies(strategies) {
    const ranks = new Map();
    const availableStrategies = strategies.forEach((group) => {
      const rank = group.reduce((p, c) => {
        if (this.board.spaces[c].tagged === this.o) {
          p++;
        }
        return p;
      }, 0);
      ranks.set(group, rank);
    });

    return new Map([...ranks.entries()].sort()).entries().next().value[0];
  }

  rankDefense() {
    const ranks = {};
    const availableStrategies = winCases.forEach((group, idx) => {
      const rank = group.reduce((p, c) => {
        if (this.board.spaces[c].tagged === "X") {
          p++;
        }
        if (this.board.spaces[c].tagged === this.o) {
          p--;
        }
        return p;
      }, 0);
      ranks[idx] = rank;
    });

    let defenseGroup = undefined;
    Object.keys(ranks).forEach((key) => {
      if (ranks[key] === 2) {
        defenseGroup = winCases[key];
      }
    });

    if (defenseGroup) {
      return defenseGroup.filter((space) => {
        return !this.board.spaces[space].tagged;
      });
    }

    return false;
  }

  move() {
    const defenseStrategy = this.rankDefense();

    if (defenseStrategy) {
      return this.board.spaces[defenseStrategy];
    }

    let nextSpace = undefined;
    this.currentStrategy = this.checkCurrentStrategy()
      ? this.currentStrategy
      : this.findStrategy();

    for (let i = 0; i < this.currentStrategy.length; i++) {
      const space = this.board.spaces[this.currentStrategy[i]];

      if (!space.tagged) {
        nextSpace = space;
        break;
      }
    }

    return nextSpace;
  }
}

class Game {
  constructor(id) {
    this.id = id;
    this.initialize();
  }

  initialize() {
    this.el = document.getElementById(this.id);
    this.el.innerHTML = "";
    this.board = new Board();
    this.x = "X";
    this.o = "O";
    this.turn = this.x;
    this.cpu = new Cpu(this.board, this.o);
    this.isGameOver = false;
    this.setClickListeners();
    this.render();
  }

  setClickListeners() {
    this.board.spaces.forEach((space) => {
      space.el.addEventListener("click", this.takeTurn.bind(this, space));
    });
  }

  nextTurn() {
    this.turn = this.turn === this.x ? this.o : this.x;

    if (this.turn === this.o) {
      this.takeTurn(this.cpu.move());
    }
  }

  takeTurn(space, e) {
    if (this.isGameOver) {
      e.preventDefault();
      return;
    }

    if (!space.tagged) {
      space.tag(this.turn);
      this.checkWinner();
    } else {
      console.log("SPACE TAKEN!!!!");
    }
  }

  checkWinner() {
    const isWinner = winCases.filter((c) => {
      return (
        this.board.spaces[c[0]].tagged == this.turn &&
        this.board.spaces[c[1]].tagged == this.turn &&
        this.board.spaces[c[2]].tagged == this.turn
      );
    });

    const isDraw = this.board.spaces.filter((space) => {
      return !space.tagged;
    });

    if (isWinner.length > 0) {
      this.endGame(isWinner[0]);
    } else if (!isDraw.length) {
      this.endGame([]);
    } else {
      this.nextTurn();
    }
  }

  endGame(isWinner) {
    this.isGameOver = true;

    // Draw
    if (!isWinner.length) {
      this.board.spaces.forEach((space) => {
        space.el.classList.add("draw");
      });
    }

    // Winner
    let lastTile = isWinner[0] || 0;
    isWinner.forEach((tile) => {
      this.board.spaces[tile].el.classList.add("winner");
    });

    this.board.spaces[lastTile].el.addEventListener("transitionend", () => {
      this.initialize();
    });
  }

  render() {
    this.el.classList.add("game-container");
    this.el.appendChild(this.board.render());
  }
}

class Board {
  constructor() {
    this.el = document.createElement("div");
    this.el.classList.add("board-container");
    this.spaces = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"].map(
      (space) => {
        return new Tile(space);
      }
    );
  }

  render() {
    this.spaces.forEach((space) => {
      this.el.appendChild(space.render());
    });

    return this.el;
  }
}

class Tile {
  constructor(id) {
    this.el = document.createElement("div");
    this.el.id = id;
    this.el.classList.add("tile");
    this.tagged = undefined;
  }

  tag(name) {
    this.el.textContent = name;
    this.tagged = name;
  }

  render() {
    return this.el;
  }
}

new Game("game");
