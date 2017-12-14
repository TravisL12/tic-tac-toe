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
  constructor(board) {
    this.board = board;
    this.o = 'O';
    this.currentStrategy;
  }

  checkCurrentStrategy () {
    if (!this.currentStrategy) {
      return false;
    }

    return this.currentStrategy.filter((e,i,a) => {
      return (
        (!this.board.spaces[a[0]].tagged || this.board.spaces[a[0]].tagged === this.o ) &&
        (!this.board.spaces[a[1]].tagged || this.board.spaces[a[1]].tagged === this.o ) &&
        (!this.board.spaces[a[2]].tagged || this.board.spaces[a[2]].tagged === this.o )
      );
    }).length;
  }

  findStrategy() {
    const availableStrategies = winCases.filter(c => {
      return (
        (!this.board.spaces[c[0]].tagged || this.board.spaces[c[0]].tagged === this.o ) &&
        (!this.board.spaces[c[1]].tagged || this.board.spaces[c[1]].tagged === this.o ) &&
        (!this.board.spaces[c[2]].tagged || this.board.spaces[c[2]].tagged === this.o )
      );
    });

    return availableStrategies[0] || [0,1,2,3,4,5,6,7,8];
  }

  move () {
    let nextSpace = undefined;
    this.currentStrategy = this.checkCurrentStrategy() ? this.currentStrategy : this.findStrategy();

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
    this.el = document.getElementById('game');
    this.board = new Board();
    this.x = 'X';
    this.o = 'O';
    this.turn = this.x;
    this.cpu = new Cpu(this.board);
    this.isGameOver = false;
    this.setClickListeners();
  }

  setClickListeners() {
    this.board.spaces.forEach(space => {
      space.el.addEventListener('click', this.takeTurn.bind(this, space));
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
      console.log('SPACE TAKEN!!!!');
    }
  }

  checkWinner() {
    const isWinner = winCases.filter(c => {
      return (
        this.board.spaces[c[0]].tagged == this.turn &&
        this.board.spaces[c[1]].tagged == this.turn &&
        this.board.spaces[c[2]].tagged == this.turn
        );
    });

    const isDraw = this.board.spaces.filter( space => {
      return !space.tagged;
    })

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
    isWinner.forEach(tile => {
      this.board.spaces[tile].el.classList.add('winner');
    });
  }

  render() {
    this.el.classList.add('game-container');
    this.el.appendChild(this.board.render());
  }
}

class Board {
  constructor() {
    this.el = document.createElement('div');
    this.el.classList.add('board-container');
    this.spaces = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'].map(space => {
      return new Tile(space);
    });
  }

  render() {
    this.spaces.forEach(space => {
      this.el.appendChild(space.render());
    });

    return this.el;
  }
}

class Tile {
  constructor(id) {
    this.el = document.createElement('div');
    this.el.id = id;
    this.el.classList.add('tile');
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

new Game().render();
