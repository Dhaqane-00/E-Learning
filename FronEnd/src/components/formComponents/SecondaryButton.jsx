import React from 'react'

function SecondaryButton({text, classname,onClick}) {
  return (
    <button
    className={`${classname} text-sm font-medium rounded-full px-5 py-1.5 bg-bgTwo border`}
    onClick={onClick}
    >
        <p>
        {text}
        </p>
    </button>
  )
}

export default SecondaryButton