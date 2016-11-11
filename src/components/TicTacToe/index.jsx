import React from 'react';
import style from './style';
import Square from '../Square';

function copyGame(game) {
  var game = resetGame();
  for (var i = 0; i<3; i++) {
    for (var j=0; j<3; j++) {
      g[i][j] = game[i][j];
    }
  }
  return game;
}

function changePlayer(player) {
  if (player === 'x')
    return 'o';
  else
    return 'x';
}

function makePlay(game, player, move) {
  game[move[0]][move[1]] = player;
  return game;
}

function getMoves(game) {
  var moves = [];
  var move = [];
  for (var i=0; i<3; i++) {
    for (var j=0; j<3; j++) {
      if (game[i][j] != 'x' && game[i][j] != 'o') {
        move = [];
        move.push(i,j);
        moves.push(move);
      }
    }
  }
  return moves;
}

function resetGame(){
  var game = [];
  var row = [];
  for (var i = 0; i<3; i++) {
    for (var j = 0; j<3; j++)
      row.push('_');
    game.push(row);
    row = [];
  }
  return game;
}

function checkVertical(game, x, y, player) {
  for (var i = 0; i<3; i++) {
    if(game[i][y] != player)
      return 0;;
  }
  return 1;
}

function checkHorizontal(game, x, y, player) {
  for (var i = 0; i<3; i++) {
    if(game[x][i] != player)
      return 0;;
  }
  return 1;
}

function checkDiagonal(game, x, y, player) {
  var v1 = 0;
  var v2 = 0;
  if (x === y) {
    for (var i=0; i<3; i++) {
      if(game[i][i] === player)
        v1 += 1;
    }
  }
  if (x+y === 2) {
    var z = 2;
    for (var i=0; i<3; i++) {
      if(game[i][z] === player)
        v2 += 1;
      z--;
    }
  }
  if (v1 === 3 || v2 === 3)
    return 1;
  else
    return 0;
}

function checkWin(game, x, y, player) {
  if (checkHorizontal(game, x, y, player) === 1)
    return 1;
  else if (checkVertical(game, x, y, player) === 1)
    return 1;
  else if (checkDiagonal(game, x, y, player) === 1)
    return 1;
  else
    return 0;
}

function checkTie(game) {
  for (var i = 0; i<3; i++) {
    for (var j = 0; j<3; j++) {
      if (game[i][j] === '_')
        return 0;
    }
  }
  return 1;
}

function checkState(moves, state) {
  for (var i = 0; i<moves.length; i++) {
    if (moves[i][2] === state)
      return moves[i];
  }
  return null;
}

function computerPlay(game, player) {
  var m = getMoves(game);
  var g = [];
  var poss = [];
  for (var i = 0; i<m.length; i++) {
    g = copyGame(game);
    var move = m[i];
    g = makePlay(g, player, move);
    if (checkWin(g, move[0], move[1], player))
      return (move[0], move[1], player);
    else if (checkTie(g))
      poss.push([move[0], move[1], 't']);
    else {
      var pos = ([move[0], move[1], computerPlay(g, changePlayer(player))]);
      if (pos[2] === player)
        return pos;
      else
        poss.push(pos);
    }
  }
  var play = checkState(poss, 't');
  if (play != null)
    return play;
  else
    return poss[0];
}

var g = resetGame();

class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {turn: 'o', game: g, message: '', player: 'Computer', gameon: true};
  }

  onClick = (x,y) => {
    console.log(this.state.gameon);
    if (this.state.game[x][y] != '_')
      this.setState({message: 'Space Taken. Please choose again!'});

    if (this.state.gameon === false)
      this.setState({message: 'Game Over! Please reset the board!'})
    else {
      var gm = this.state.game;
      gm[x][y] = this.state.turn;
      if (checkWin(gm, x, y, this.state.turn))
        this.setState({message: this.state.turn + 'wins!!', gameon: false});
      if (checkTie(gm))
        this.setState({message: "It's a tie! Please reset the board!", gameon: false});
      var t = changePlayer(this.state.turn);
      if(this.state.player === 'Computer' && this.state.gameon === false) {
        var move = computerPlay(gm, t);
        gm[move[0]][move[1]] = t;
        if (checkWin(gm, move[0], move[1], this.state.turn))
          this.setState({message: 'Computer Wins!', gameon: false});
        if (checkTie(gm))
          this.setState({message: "It's a tie, try again!", gameon: false});
        t = changePlayer(t);
      }
      this.setState({game:gm, turn: t});
    }
  }

  handleChange = (event) => {
    this.setState({game: resetGame(), player: event.target.value});
  }

  clickStart = () => {
    this.setState({game: resetGame(), turn: 'o', message:'', gameon: true});
  }

  render() {
    var test;
    if (this.state.player === 'Computer')
      test = <p>You are playing against the computer</p>
    else if (this.state.player === 'Human')
      test = <p>You are playing against a human</p>

    return (
      <div className='tictactoe'>
        <div>
          <Square type='double' name={this.state.game[0][0]} onClick={() => this.onClick(0,0)}/>
          <Square type='double' name={this.state.game[0][1]} onClick={() => this.onClick(0,1)}/>
          <Square type='hori' name={this.state.game[0][2]} onClick={() => this.onClick(0,2)}/>
        </div>
        <div>
          <Square type='double' name={this.state.game[1][0]} onClick={() => this.onClick(1,0)}/>
          <Square type='double' name={this.state.game[1][1]} onClick={() => this.onClick(1,1)}/>
          <Square type='hori' name={this.state.game[1][2]} onClick={() => this.onClick(1,2)}/>
        </div>
         <div>
           <Square type='vert' name={this.state.game[2][0]} onClick={() => this.onClick(2,0)}/>
           <Square type='vert' name={this.state.game[2][1]} onClick={() => this.onClick(2,1)}/>
           <Square type='none' name={this.state.game[2][2]} onClick={() => this.onClick(2,2)}/>
         </div> <br></br>
         Type of Player:  <select name='play' onChange={this.handleChange}>
            <option>Computer</option>
            <option>Human</option>
          </select><br></br>
         <label>Turn: {this.state.turn}</label><br></br>
         <button className='Reset' onClick={() => this.clickStart()}>Restart</button><br></br>
         <label>{this.state.message}</label>
         {test}
      </div>

    );
  }
};

export default TicTacToe;
