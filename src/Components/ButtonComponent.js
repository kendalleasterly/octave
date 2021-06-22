import React from 'react'

function ButtonComponent({text, action}) {
    return (
        <button className = "py-1 bg-secondarybg rounded-full px-10 w-full" onClick = {action}>
            <p className = "text-accent font-semibold text-lg text-center">{text}</p>
        </button>
    )
}

export default ButtonComponent
