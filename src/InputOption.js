import React from 'react'
import './InputOption.css'

function InputOption({ Icon, title, color, openModal }) {
  return (
    <div className="inputOption" onClick={openModal}>
        <Icon style={{ color: color}} />
        <p>{title}</p>        
    </div>
  )
}

export default InputOption