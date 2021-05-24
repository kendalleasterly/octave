import "./App.css"
import { useRecoilValue, useRecoilValueLoadable } from "recoil"
import {
	BrowserRouter as Router,
	useLocation,
	Switch,
	Route,
} from "react-router-dom"

import Search from "./Views/Search"
import Home from "./Views/Home"
import Notification from "./Components/Notification"

import Player from "./Components/Player"
import Menu from "./Components/Menu"
import MenuIcon from "./Images/menu.svg"
import { timelineIsActiveAtom } from "./Global/atoms"
import Timeline from "./Views/Timeline"
import { notificationsAtom } from "./Models/NotificationModel"
import { useEffect } from "react"

function App() {
	function testFunction() {}

	const timelineIsActive = useRecoilValue(timelineIsActiveAtom)
	const notifications = useRecoilValue(notificationsAtom)

	useEffect(() => {
		console.log({notifications})
	}, [notifications])

	return (
		<Router>
			<div className="hidden fixed left-0 bottom-16 py-6 px-8 space-y-4 md:block mb-2">
				{notifications.map((notification, key) => {
					return <Notification notificationObject={notification} key = {key}/>
				})}
			</div>

			<div className="fixed bottom-14 py-6 px-8 space-y-4 md:hidden w-screen mb-2">
				{notifications.length > 0 ? <Notification isSmall={true} notificationObject = {notifications[0]}/> : <p ></p>}
			</div>
			<div className="content-with-player p-4 md:py-6 md:px-8">
				<div className="main">
					<Menu></Menu>

					<p className="md:hidden"></p>

					<p></p>

					<div id="content" className="space-y-4">
						<div className="one-button-header">
							<button
								onClick={testFunction}
								className="rounded-full bg-secondarybg p-2.5 md:hidden"
							>
								<img src={MenuIcon} alt="" className="" />
							</button>

							<HeaderText />
						</div>

						{timelineIsActive ? (
							<Timeline />
						) : (
							<Switch>
								<Route exact path="/">
									<Home></Home>
								</Route>
								<Route path="/search">
									<Search />
								</Route>
							</Switch>
						)}
					</div>

					<p></p>
				</div>
				<Player />
			</div>
		</Router>
	)

	function HeaderText() {
		const { pathname } = useLocation()

		const page = pathname.replace("/", "")

		function getHeader() {
			if (timelineIsActive) {
				return "Timeline"
			} else if (page !== "") {
				return page.charAt(0).toUpperCase() + page.slice(1)
			} else {
				return "Home"
			}
		}

		return (
			<div>
				<p className={"text-2xl font-semibold text-white m-auto text-center"}>
					{getHeader()}
				</p>
			</div>
		)
	}
}

export default App
