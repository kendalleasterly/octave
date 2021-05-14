import "./App.css"
import { RecoilRoot } from "recoil"

import Player from "./Components/Player"
import Search from "./Search"

function App() {
	return (
		<RecoilRoot >
			<div className="content-with-player">
				<Search />
				<Player />
			</div>
		</RecoilRoot>
	)
}

export default App
