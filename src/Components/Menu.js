import { Link, useLocation } from "react-router-dom"

import { ReactComponent as SearchIcon } from "../Images/search.svg"
import { ReactComponent as HomeIcon } from "../Images/home.svg"
import { ReactComponent as Logo } from "../Images/logo.svg"
import { ReactComponent as SettingsIcon } from "../Images/settings.svg"
import { ReactComponent as ClockIcon } from "../Images/clock.svg"
import { ReactComponent as HeartIcon } from "../Images/heart.svg"
import { ReactComponent as AlbumIcon } from "../Images/album.svg"
import { ReactComponent as PlaylistIcon } from "../Images/playlist.svg"
import { ReactComponent as AddIcon } from "../Images/add.svg"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { isDarkAtom, menuIsActiveAtom, timelineIsActiveAtom } from "../Global/atoms"

function Menu() {
	const { pathname } = useLocation()
	const isDark = useRecoilValue(isDarkAtom)
	const page = pathname.replace("/", "")

	const setTimelineIsActive = useSetRecoilState(timelineIsActiveAtom)
	const setMenuIsActive = useSetRecoilState(menuIsActiveAtom)

	function getBarColor(slug, isSVG) {
		if (page === slug.toLowerCase().replace("/", "")) {
			return isSVG ? "#F08A79" : "text-accent75"
		} else {
			return isSVG ? isDark ? "#FFFFFF": "#3F3F46" : "text"
		}
	}

	return (
		<div
			id="menu"
			className="overflow-scroll overscroll-contain space-y-8"
		>
			<div className="flex space-x-2">
				<Logo fill = {isDark ? "#FFFFFF" : "#27272A"}/>
				<p className="text-xl font-bold text">Octave</p>
			</div>

			<div id="menu-menu" className="space-y-6">
				<SubHeading>MENU</SubHeading>

				{/* THIS CANNOT BE REFACTORED, BECAUSE THE ICONS CAN'T BE PUT INTO AN OBJECT*/}
				<Page title="Home" slug="/">
					<HomeIcon fill={getBarColor("", true)} className="icon" />
				</Page>

				<Page title="Search" slug="/search">
					<SearchIcon fill={getBarColor("/search", true)} className="icon" />
				</Page>

				<Page title="Settings" slug="/settings">
					<SettingsIcon fill={getBarColor("settings", true)} className="icon" />
				</Page>
			</div>

			<div id="menu-library" className="space-y-6">
				<SubHeading>LIBRARY</SubHeading>

				<Page title="Recent" slug="/library/recent">
					<ClockIcon
						fill={getBarColor("/library/recent", true)}
						className="icon"
					/>
				</Page>

				<Page title="Favorites" slug="/library/favorites">
					<HeartIcon
						fill={getBarColor("/library/favorites", true)}
						className="icon"
					/>
				</Page>

				<Page title="Albums" slug="/library/albums">
					<AlbumIcon
						fill={getBarColor("/library/albums", true)}
						className="icon"
					/>
				</Page>
			</div>

			<div id="menu-playlists" className="space-y-6">
				<SubHeading>PLAYLISTS</SubHeading>

				<div className="flex space-x-3">
					<div className="my-auto"><AddIcon fill = {isDark ? "#FFFFFF": "#3F3F46"}/></div>

					<p className="text one-line">Create New</p>
				</div>

				<Page title="rgt" slug="/playlist/rgtabc">
					<PlaylistIcon
						fill={getBarColor("/playlist/rgtabc", true)}
						className="icon"
					/>
				</Page>

        <Page title="rgt" slug="/playlist/rgtabc">
					<PlaylistIcon
						fill={getBarColor("/playlist/rgtabc", true)}
						className="icon"
					/>
				</Page>

        <Page title="rgt" slug="/playlist/rgtabc">
					<PlaylistIcon
						fill={getBarColor("/playlist/rgtabc", true)}
						className="icon"
					/>
				</Page>

        <Page title="rgt" slug="/playlist/rgtabc">
					<PlaylistIcon
						fill={getBarColor("/playlist/rgtabc", true)}
						className="icon"
					/>
				</Page>

        <Page title="last one" slug="/playlist/rgtabc">
					<PlaylistIcon
						fill={getBarColor("/playlist/rgtabc", true)}
						className="icon"
					/>
				</Page>
			</div>
		</div>
	)

	function SubHeading(props) {
		return <p className="text-sm font-bold text-gray-400">{props.children}</p>
	}

	function Page(props) {
		const { title, slug } = props

		return (
			<div
				onClick={() => {
					setMenuIsActive(false)
				}}
			>
				<Link to={slug}>
					<div className="flex space-x-3">
						<div className="my-auto">{props.children}</div>

						<p className={"font-medium one-line " + getBarColor(slug)}>{title}</p>
					</div>
				</Link>
			</div>
		)
	}
}

export default Menu
