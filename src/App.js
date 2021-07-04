import "./App.css"
import { useRecoilState, useRecoilValue } from "recoil"
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useHistory,
	useLocation,
} from "react-router-dom"

import Search from "./Views/Search"
import Home from "./Views/Home"
import Settings from "./Views/Settings"
import Notification from "./Components/Notification"

import Player from "./Components/Player"
import Menu from "./Components/Menu"
import { isDarkAtom, timelineIsActiveAtom } from "./Global/atoms"
import Timeline from "./Views/Timeline"
import { notificationsAtom } from "./Models/NotificationModel"
import { useEffect } from "react"
import AlbumView from "./Views/AlbumView"
import SmallMenu from "./Components/SmallMenu"
import NotFound from "./Views/NotFound"

function App() {
	const [timelineIsActive, setTimelineIsActive] =
		useRecoilState(timelineIsActiveAtom)
	const isDark = useRecoilValue(isDarkAtom)
	const notifications = useRecoilValue(notificationsAtom)
	const location = useLocation()

	useEffect(() => {
		setTimelineIsActive(false)
	}, [location])

	return (
		<div id="color-scheme" className={isDark ? "dark" : ""}>
			<div id="app-notifications-player" className="bg-white dark:bg-gray-900">
				<div className="hidden fixed left-0 bottom-16 py-6 px-8 space-y-4 md:block mb-2">
					{notifications.map((notification, key) => {
						return <Notification notificationObject={notification} key={key} />;
					})}
				</div>

				<div className="fixed bottom-14 py-6 px-8 space-y-4 md:hidden w-screen mb-2">
					{notifications.length > 0 ? (
						<Notification
							isSmall={true}
							notificationObject={notifications[0]}
						/>
					) : (
						<p></p>
					)}
				</div>
				<div className="content-with-player pb-23" id="content">
					<div className="main">
						<div className="medium-only border-r h-fullscreen overflow-scroll overscroll-contain dark:border-gray-700 border-gray-200 pt-10 pl-12 pb-4">
							<Menu />
						</div>

						<div
							id="content"
							className="space-y-6 pl-10 pt-10 h-fullscreen overflow-scroll overscroll-contain pr-12 pb-4">
							<SmallMenu />

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
									<Route path="/settings">
										<Settings />
									</Route>
									<Route path="/album/:albumID">
										<AlbumView />
									</Route>
									{/* <Route>
									<NotFound/>
								</Route> */}
								</Switch>
							)}

							{/* <p></p> */}
						</div>
					</div>
				</div>
				<Player />
			</div>
		</div>
	);
}

export default App
