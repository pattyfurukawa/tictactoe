import React from 'react';
import style from './style.scss'

function Square ({name, type, onClick}) {
  return (
      <button className={type} onClick={onClick}>{name}</button>
  );
}

export default Square;
