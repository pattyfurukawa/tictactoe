import React from 'react';
import ReactDOM from 'react-dom';

import Calculator from './components/TicTacToe';

function App() {
  return (
    <div>
      <TicTacToe/>
    </div>
  );
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
