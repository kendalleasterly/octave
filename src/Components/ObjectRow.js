import React from 'react'

function ObjectRow(props) {

    const {object, playFunction} = props

    return (
        <button className = "flex space-x-4 px-4" onClick = {playFunction}>
			<img className = "thumbnail rounded" src={object.thumbnail} alt="" />

			<div className = "text-left my-auto space-y-1">
				<p className = "text-lg md:text-base text-white">{object.title}</p>
				<p className = "md:text-sm text-gray-400">{object.artist}</p>
			</div>

            {props.children}

		</button>
    )
}

export default ObjectRow
