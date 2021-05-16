import "./App.css"
import { RecoilRoot } from "recoil"
import {
	BrowserRouter as Router,
	useLocation,
	Switch,
	Route,
} from "react-router-dom"

import Search from "./Views/Search"
import Home from "./Views/Home"

import Player from "./Components/Player"
import Menu from "./Components/Menu"
import MenuIcon from "./Images/menu.svg"

function App() {
	function testFunction() {}

	return (
		<Router>
			<RecoilRoot>
				<div className="content-with-player p-4 md:py-6 md:px-8">
					<div className="main">
						<Menu></Menu>

						<p className="md:hidden"></p>

						<p></p>

						<div id="content" className="space-y-4">
							<div className="one-button-header">
								<button
									onClick={testFunction}
									className="rounded-full bg-secondaryBackground p-2.5 md:hidden"
								>
									<img src={MenuIcon} alt="" className="" />
								</button>

								<HeaderText />
							</div>

							<Switch>
								<Route exact path = "/">
									<Home>
										
									</Home>
								</Route>
								<Route path="/search">
									<Search />
								</Route>
							</Switch>
						</div>

						{/* <p className = "hidden md:block lg:w-20 xl:w-56 2xl:w-96"></p> */}
						<p></p>
					</div>
					<Player />
				</div>
			</RecoilRoot>
		</Router>
	)

	function HeaderText() {
		const { pathname } = useLocation()

		const page = pathname.replace("/", "")

		function capitalizedHeader() {
			if (page !== "") {
				return page.charAt(0).toUpperCase() + page.slice(1)
			} else {
				return "Home"
			}
		}

		return (
			<div>
				<p className={"text-2xl font-semibold text-white m-auto text-center"}>
					{capitalizedHeader()}
				</p>
			</div>
		)
	}
}

export default App
