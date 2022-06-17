import React, { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { headerTextAtom } from '../Global/atoms'
import { accountAtom } from '../Models/AccountModel'

function Favorites() {

    const setHeaderText = useSetRecoilState(headerTextAtom)
    const account = useRecoilValue(accountAtom)

    const [savedTrack, setSavedTracks] = useState([])

    useEffect(() => {
        setHeaderText("Favorites")
        //
    }, [])

    useEffect(() => {

      

    }, [account.savedTracks])



  return (
    <div>
      {account.savedTracks ? account.savedTracks.map((savedTrack, key) => {
      return (<div key={key}>{savedTrack}</div>)
    }): null}
    </div>

    
  )
}

export default Favorites