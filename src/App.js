import "./App.css"
import { RecoilRoot } from "recoil"

import Player from "./Components/Player"
import Search from "./Search"


function App() {

	return (
		<div className = "p-4">
			<RecoilRoot>
				<Search />
				<Player/>
			</RecoilRoot>
		</div>
	)
}

export default App
