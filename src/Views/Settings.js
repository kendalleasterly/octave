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
