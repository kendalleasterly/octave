import React from 'react'
import { useRecoilState } from 'recoil'
import { isDarkAtom } from '../Global/atoms'

function Settings() {

    const [isDark, setIsDark] = useRecoilState(isDarkAtom)

    return (
			<div>
				<button className="text" onClick={() => setIsDark(!isDark)}>
					Dark Mode: {isDark ? "on" : "off"}
				</button>
			</div>
		);
}

export default Settings
