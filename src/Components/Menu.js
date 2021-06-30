import { Link, useLocation } from "react-router-dom";

import { ReactComponent as LibraryIcon } from "../Images/library.svg";
import { ReactComponent as SearchIcon } from "../Images/search.svg";
import { ReactComponent as AccountIcon } from "../Images/account.svg";
import { ReactComponent as HomeIcon } from "../Images/home.svg";
import {useSetRecoilState } from "recoil";
import { menuIsActiveAtom, timelineIsActiveAtom } from "../Global/atoms";

function Menu() {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const setTimelineIsActive = useSetRecoilState(timelineIsActiveAtom);
  const setMenuIsActive = useSetRecoilState(menuIsActiveAtom)

  function getBarColor(slug, isSVG) {
    if (page === slug.toLowerCase()) {
      return isSVG ? "#FFFFFF" : "text-white";
    } else {
      return isSVG ? "#A1A1AA" : "text-gray-400";
    }
  }

  return (
    <div className="p-4 md:border rounded-2xl border-borderColor mr-8 space-y-8 overflow-scroll menu overscroll-contain">
      <div className="space-y-6 md:space-y-4">
        <p className="text-gray-300 text-xl md:text-lg font-semibold">Menu</p>

        <div className="space-y-3 md:space-y-2.5">
          {/* THIS CANNOT BE REFACTORED, BECAUSE THE ICONS CAN'T BE PUT INTO AN OBJECT*/}
          <MenuBar title="Home" slug="/">
            <HomeIcon fill={getBarColor("", true)} className="icon" />
          </MenuBar>

          <Divider/>

          <MenuBar title="Library" slug="/library">
            <LibraryIcon fill={getBarColor("Library", true)} className="icon" />
          </MenuBar>

          <Divider/>

          <MenuBar title="Search" slug="/search">
            <SearchIcon fill={getBarColor("Search", true)} className="icon" />
          </MenuBar>

          <Divider/>

          <MenuBar title="Account" slug="/account">
            <AccountIcon fill={getBarColor("Account", true)} className="icon" />
          </MenuBar>
        </div>
      </div>

      <div className="space-y-6 md:space-y-4 overflow-scroll">
        <p className="text-gray-300 text-xl md:text-lg font-semibold">Playlists</p>

        <div className="space-y-3 md:space-y-2.5 overflow-scroll max-h-full">
          <p className={"px-2 text-gray-400 text-lg md:text-base"}>LoFi Chill Hop Study Beats</p>

          <Divider/>

          <p className={"px-2 text-gray-400 text-lg md:text-base"}>rgt</p>

          <Divider/>

          <p className={"px-2 text-gray-400 text-lg md:text-base"}>Bedtime Beats</p>

          <Divider/>

          <p className={"px-2 text-gray-400 text-lg md:text-base"}>Nil</p>

          <Divider/>

          <p className={"px-2 text-gray-400 text-lg md:text-base"}>transfer bucket</p>

		  <Divider/>

          <p className={"px-2 text-gray-400 text-lg md:text-base"}>rgt</p>

          <Divider/>

          <p className={"px-2 text-gray-400 text-lg md:text-base"}>Bedtime Beats</p>

          <Divider/>

          <p className={"px-2 text-gray-400 text-lg md:text-base"}>Nil</p>

          <Divider/>

          <p className={"px-2 text-gray-400 text-lg md:text-base"}>transfer bucket</p>
        </div>
      </div>
    </div>
  );

  function MenuBar(props) {
    const { title, slug } = props;

    return (
      <div onClick={() => {
		  setMenuIsActive(false)
		  }}>
        <Link to={slug}>
          <div className="flex">
            <div className="my-auto">{props.children}</div>

            <p className={"px-2 md:text-base text-lg " + getBarColor(slug)}>{title}</p>
          </div>
        </Link>
      </div>
    );
  }

  function Divider() {
	return (
		<div>
			<hr className="border-transparent md:border-borderColor" />

		</div>
	)
  }
}

export default Menu;
