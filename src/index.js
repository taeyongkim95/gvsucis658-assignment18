import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import emptyImg from './assets/empty.png';
import xImg from './assets/x.png';
import oImg from './assets/o.png';

function Square(props) {
  let imgSrc = emptyImg;
  if (props.value === 'X') {
    imgSrc = xImg;
  } else if (props.value === 'O') {
    imgSrc = oImg;
  }
  return (
    <button className={"square " + props.className} onClick={props.onClick}>
      <img src={imgSrc} alt={props.value}/>
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)
      }
    />;
  }

  render() {
    let squareCount = this.props.boardConfig * this.props.boardConfig;
    let squares = [];
    for (let i = 0; i < squareCount; i++) {
      let isLastInLine = i % Math.sqrt(squareCount) === 0;
      squares.push(<Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        className={isLastInLine ? 'next-line' : ''}
      />);
    }

    return (
      <div>
        {squares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,    
      boardConfig: 3
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  setBoardConfig(count) {
    this.setState({
      stepNumber: 0,
      xIsNext: true,
      history: [{
        squares: Array(count*count).fill(null),
      }],
      boardConfig: count
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.boardConfig);
    console.log(winner);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            boardConfig={this.state.boardConfig}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="game-info">
          <div>Board Configuration</div>
          <ol>
            <li>
              <button onClick={() => this.setBoardConfig(3)}>3x3</button>
            </li>
            <li>
              <button onClick={() => this.setBoardConfig(4)}>4x4</button>
            </li>
            <li>
              <button onClick={() => this.setBoardConfig(5)}>5x5</button>
            </li>
          </ol>
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

function calculateWinner(squares, boardConfig) {
  const threeLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const fourLines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12]
  ];
  const fiveLines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
  ];

  if (boardConfig === 3) {
    for (let i = 0; i < threeLines.length; i++) {
      const [a, b, c] = threeLines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
  } else if (boardConfig === 4) {
    for (let i = 0; i < fourLines.length; i++) {
      const [a, b, c, d] = fourLines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
        return squares[a];
      }
    }
  } else if (boardConfig === 5) {
    for (let i = 0; i < fiveLines.length; i++) {
      const [a, b, c, d, e] = fiveLines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
        return squares[a];
      }
    }
  }
  return null;
}
