import React from 'react'
import { useHistory } from 'react-router-dom'

function NotFound() {

    const history = useHistory()
    history.push("/")

    return (
        <div>
            
        </div>
    )
}

export default NotFound
