import "./App.css"
import { useRecoilValue } from "recoil"
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom"

import Search from "./Views/Search"
import Home from "./Views/Home"
import Notification from "./Components/Notification"

import Player from "./Components/Player"
import Menu from "./Components/Menu"
import {timelineIsActiveAtom } from "./Global/atoms"
import Timeline from "./Views/Timeline"
import { notificationsAtom } from "./Models/NotificationModel"
import { useEffect } from "react"
import AlbumView from "./Views/AlbumView"
import SmallMenu from "./Components/SmallMenu"

function App() {

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

					<div id="content" className="space-y-4 md:space-y-6 pb-17">
						<SmallMenu/>

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
								<Route path="/album/:albumID">
									<AlbumView/>
								</Route>
							</Switch>
						)}

						{/* <p></p> */}

					</div>

					<p></p>
				</div>
			</div>
			<Player/>
		</Router>
	)
}

export default App
