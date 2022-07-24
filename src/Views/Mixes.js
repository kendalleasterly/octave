import React from 'react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import ButtonComponent from '../Components/ButtonComponent'
import { headerTextAtom } from '../Global/atoms'

function Mixes() {

    const setHeaderText = useSetRecoilState(headerTextAtom)
    const history = useHistory()

    useEffect(() => {
        setHeaderText("Mixes")
    }, [])

  return (
   <div>
       <ButtonComponent text = "Add New" action = {() => {
           history.push("/library/mixes/create")
       }}/>
   </div>
  )
}

export default Mixes