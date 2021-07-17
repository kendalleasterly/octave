import React, { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { headerTextAtom, isDarkAtom } from '../Global/atoms';
import { useAccountModel } from '../Models/AccountModel';



function Settings() {

    const [isDark, setIsDark] = useRecoilState(isDarkAtom)
	const setHeaderText = useSetRecoilState(headerTextAtom)
	const accountModel = useAccountModel()

	useEffect(() => {
		setHeaderText("Settings")
	})

	function setNewIsDark(newIsDark) {

        setIsDark(newIsDark)
		document.getElementsByTagName("body").item(0).style.backgroundColor = newIsDark ? "#18181B" : "#FFFFFF"
		console.log("set it to", newIsDark ? "#18181B" : "#FFFFFF")

        localStorage.setItem("isDark", newIsDark)
    }

    return (
			<div className = "flex flex-col">

				<button onClick = {accountModel.signIn} className = "text text-left">
					Sign In
				</button>

				<button onClick = {accountModel.signOut} className = "text text-left">
					Sign Out
				</button>

				<button className="text text-left" onClick={() => setNewIsDark(!isDark)}>
					Dark Mode: {isDark ? "on" : "off"}
				</button>
			</div>
		);
}

export default Settings
