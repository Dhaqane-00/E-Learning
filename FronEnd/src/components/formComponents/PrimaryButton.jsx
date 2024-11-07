import React from 'react'
import { dotStream } from 'ldrs'

dotStream.register()

function PrimaryButton({ text, classname, onClick, isLoading }) {
  return (
    <button
      className={`${classname} text-sm font-medium rounded-full px-5 py-1.5 bg-gradientForBg text-bgOne`}
      onClick={onClick}
    >
      {isLoading &&
        <l-dot-stream
          size="40"
          speed="3.5"
          color="black"
        ></l-dot-stream>
      }

      {!isLoading && <p>{text}</p>}

    </button>
  )
}

export default PrimaryButton