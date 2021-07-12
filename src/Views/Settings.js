import React, { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { headerTextAtom, isDarkAtom } from '../Global/atoms';



function Settings() {

    const [isDark, setIsDark] = useRecoilState(isDarkAtom)
	const setHeaderText = useSetRecoilState(headerTextAtom)

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
			<div>
				<button className="text" onClick={() => setNewIsDark(!isDark)}>
					Dark Mode: {isDark ? "on" : "off"}
				</button>
			</div>
		);
}

export default Settings
