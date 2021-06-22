import { Link, useLocation } from "react-router-dom"

import { ReactComponent as LibraryIcon } from "../Images/library.svg"
import { ReactComponent as SearchIcon } from "../Images/search.svg"
import { ReactComponent as AccountIcon } from "../Images/account.svg"
import { ReactComponent as HomeIcon } from "../Images/home.svg"
import { useRecoilState } from "recoil"
import { timelineIsActiveAtom } from "../Global/atoms"

function Menu() {
	const { pathname } = useLocation()
	const page = pathname.replace("/", "")

	const setTimelineIsActive = useRecoilState(timelineIsActiveAtom)[1]

	function getBarColor(slug, isSVG) {
		if (page === slug.toLowerCase()) {
			return isSVG ? "#FFFFFF" : "text-white"
		} else {
			return isSVG ? "#A1A1AA" : "text-gray-400"
		}
	}

	return (
		<div className = "hidden md:block">
			<div className="p-4 border rounded-2xl border-borderColor mr-8 space-y-8">
				<div className="space-y-4">
					<p className="text-gray-300 text-lg font-semibold">Menu</p>

					<div className="space-y-2.5">
						<MenuBar title="Home" slug="/">
							<HomeIcon fill={getBarColor("", true)} className="icon" />
						</MenuBar>

						<hr className="border-borderColor" />

						<MenuBar title="Library" slug="/library">
							<LibraryIcon
								fill={getBarColor("Library", true)}
								className="icon"
							/>
						</MenuBar>

						<hr className="border-borderColor" />

						<MenuBar title="Search" slug="/search">
							<SearchIcon fill={getBarColor("Search", true)} className="icon" />
						</MenuBar>

						<hr className="border-borderColor" />

						<MenuBar title="Account" slug="/account">
							<AccountIcon
								fill={getBarColor("Account", true)}
								className="icon"
							/>
						</MenuBar>
					</div>
				</div>

				<div className="space-y-4">
					<p className="text-gray-300 text-lg font-semibold">Playlists</p>

					<div className="space-y-2.5">
						<p className={"px-2 text-gray-400"}>LoFi Chill Hop Study Beats</p>

						<hr className="border-borderColor" />

						<p className={"px-2 text-gray-400"}>rgt</p>

						<hr className="border-borderColor" />

						<p className={"px-2 text-gray-400"}>Bedtime Beats</p>

						<hr className="border-borderColor" />

						<p className={"px-2 text-gray-400"}>Nil</p>

						<hr className="border-borderColor" />

						<p className={"px-2 text-gray-400"}>transfer bucket</p>
					</div>
				</div>
			</div>

			<p></p>

		</div>
	)

	function MenuBar(props) {
		const { title, slug } = props

		return (
			<div onClick = {() => setTimelineIsActive(false)}>
				<Link to={slug}>
					<div className="flex">
						<div className="my-auto">{props.children}</div>

						<p className={"px-2 " + getBarColor(slug)}>{title}</p>
					</div>
				</Link>
			</div>
		)
	}
}

export default Menu
