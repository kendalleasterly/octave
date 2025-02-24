import "./App.css"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
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
import { contextSelectionAtom, headerTextAtom, isDarkAtom, timelineIsActiveAtom } from "./Global/atoms"
import Timeline from "./Views/Timeline"
import { notificationsAtom } from "./Models/NotificationModel"
import { useEffect } from "react"
import AlbumView from "./Views/AlbumView"
import SmallMenu from "./Components/SmallMenu"
import { useAccountModel } from "./Models/AccountModel"
import PlaylistView from "./Views/PlaylistView"
import Favorites from "./Views/Favorites"
import Mixes from "./Views/Mixes"
import CreateMix from "./Views/CreateMix"

function App() {
	const [timelineIsActive, setTimelineIsActive] =
		useRecoilState(timelineIsActiveAtom)
	const isDark = useRecoilValue(isDarkAtom)
	const notifications = useRecoilValue(notificationsAtom)
	const headerText = useRecoilValue(headerTextAtom)
	const location = useLocation()
	const accountModel = useAccountModel()
	const setContextSelection = useSetRecoilState(contextSelectionAtom)

	useEffect(() => {
		setTimelineIsActive(false)
		setContextSelection(-1)
	}, [location])

	useEffect(() => {
		accountModel.checkForGoogleRedirect()
		accountModel.getAccount()
	}, [])

	return (
		<div id="color-scheme" className={isDark ? "dark" : ""}>
			<div id="app-notifications-player" className="bg-white dark:bg-gray-900">
				<div className="hidden fixed bottom-16 py-6 px-8 space-y-4 md:block mb-2 z-auto w-full">
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
				<div className="content-with-player md:pb-23" id="main-content">
					<div className="main">
						<div className="medium-only border-r h-fullscreen overflow-scroll overscroll-contain dark:border-gray-700 border-gray-200 pt-10 pl-12 pb-4">
							<Menu />
						</div>

						<div
							id="content"
							className={
								"px-6 pt-4 md:pl-10 md:pt-10 md:pr-12 pb-28 md:pb-4 h-fullscreen overflow-scroll overscroll-contain " +
								(location.pathname.includes("/album")
									? "space-y-3"
									: "space-y-6")
							}
							onScroll={() => setContextSelection(-1)}>
							<ConditionalSmallMenu />

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

									<Route path="/library/favorites">
										<Favorites />
									</Route>

									<Route exact path="/library/mixes">
										<Mixes />
									</Route>

									<Route exact path="/library/mixes/create">
										<CreateMix />
									</Route>

									<Route path="/album/:albumID">
										<AlbumView />
									</Route>
									<Route path="/playlist/:playlistID">
										<PlaylistView />
									</Route>
								</Switch>
							)}
						</div>
					</div>
				</div>
				<Player />
			</div>
		</div>
	);


	function ConditionalSmallMenu() {
		if (headerText !== "" || window.innerWidth < 768) {
			return <SmallMenu/>
		} else {
			return null
		}
	}

}

export default App
