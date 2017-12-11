class Game {
  constructor(id) {
    this.el = document.getElementById('game');
    this.board = new Board();
    this.x = 'X';
    this.o = 'O';
    this.turn = this.x;
    this.gameOver = false;
    this.setClicks();
  }

  setClicks() {
    this.board.spaces.forEach(space => {
      space.el.addEventListener('click', this.takeTurn.bind(this, space));
    });
  }

  takeTurn(space, e) {
    if (this.gameOver) {
      e.preventDefault();
      return;
    }

    if (!space.tagged) {
      space.tag(this.turn);
      if (!this.checkWinner()) {
        this.turn = this.turn === this.x ? this.o : this.x;
      } else {
        console.log(`WINNER ${this.turn}`);
        this.gameOver = true;
      }
    } else {
      console.log('SPACE TAKEN!!!!');
    }
  }

  checkWinner() {
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

    return (
      winCases.filter(c => {
        return (
          this.board.spaces[c[0]].tagged == this.turn &&
          this.board.spaces[c[1]].tagged == this.turn &&
          this.board.spaces[c[2]].tagged == this.turn
        );
      }).length > 0
    );
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
