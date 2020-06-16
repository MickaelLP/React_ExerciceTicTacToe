import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import Hello from './Hello';
import './style.css';



function Square(props){
    return (
      // <button className="square" onClick={function(){alert('click');}}>
      //   {this.props.value}
      // </button>

      // Utilisation des fonctions flêchés :
      // <button className="square" onClick={() => this.props.onClick({value:'X'})}>
      //  {this.props.value}
      // </button>

      <button className="square" onClick={props.onClick}>
       {props.value}
      </button>
    );
}


class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={ () => this.props.onClick(i) }
      />
    );
  }

  render() {
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  // D'où vient le paramètre props ?
  constructor(props) {
    // Remarque : 

    // Dans les classes JavaScript, vous devez toujours appeler super quand vous définissez le constructeur d’une sous-classe. Tous les composants React à base de classes qui ont leur propre constructor devraient le faire démarrer par un appel à super(props).

    super(props); // A quoi sert la fonction super ?
    this.state = {
      history : [
        {
        squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext:true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice(); // créer une copie du tableau squares à modifier, plutôt que de modifier le tableau existant.

    if(calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O"; // A quoi correspond le signe "?" ? // ? est un opérateur ternaire retournant conditionnellement un résultat.

    this.setState({
      history : history.concat([
        {
        squares: squares
        }
      ]),
      stepNumber : history.length,
      xIsNext : !this.state.xIsNext
      });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move) => {
      const desc = move ?
        "Revenir au tour numéro " + move : 
        "Revenir au début de la partie ";
        return (
          <li key={move}>
            <button onClick={()=> this.jumpTo(move)}>{desc}</button>
          </li>
        )
    });

    let status;
    if(winner){
      status = winner + " à gagné";
    } else {
      status = "prochain joueur : " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}