import { animated, useSpring, useTransition } from "@react-spring/web";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { headerTextAtom } from "../Global/atoms";

import MenuIcon from "../Images/menu.svg";
import Menu from "./Menu";

function SmallMenu() {
  const [menuIsActive, setMenuIsActive] = useState(false);
  const headerText = useRecoilValue(headerTextAtom);
  
  const menuTransitions = useTransition(menuIsActive, {
    from: { transition: 0 },
    enter: { opacity: 0.2 },
    leave: { opacity: 0 },
  });

  const maskTransitions = useTransition(menuIsActive, {
    from: { opacity: 0 },
    enter: { opacity: 0.2 },
    leave: { opacity: 0 },
  });

  return (
    <div>
      <div className="one-button-header space-x-4 md:space-x-0 z-10">
        <button
          onClick={() => setMenuIsActive(true)}
          className="rounded-full bg-secondarybg p-2.5 md:hidden h-11"
        >
          <img src={MenuIcon} alt="" className="icon" />
        </button>

        <p className="text-2xl font-semibold text-white m-auto text-center">
          {headerText}
        </p>
      </div>

      <div id="small-menu">
        {maskTransitions(
          (styles, item) =>
            item && (
              <animated.div style={styles}>
                <div
                  className="bg-black absolute left-0 right-0 top-0 bottom-0"
                  onClick={() => setMenuIsActive(false)}
                >
                  <p className="text-white">hellos</p>
                </div>
              </animated.div>
            )
        )}

        {menuTransitions(
          (styles, item) =>
            item && (
              <animated.div style={styles}>
                <div
                  className="bg-black absolute left-0 right-0 top-0 bottom-0"
                  onClick={() => setMenuIsActive(false)}
                >
                  <p className="text-white">hellos</p>
                </div>
              </animated.div>
            )
        )}

        {/* <animated.div style={backgroundStyles}>
          <div
            onClick={() => setMenuIsActive(false)}
            className="z-20 bg-black opacity-50 absolute top-0 bottom-0 left-0 right-0 md:hidden"
          >
            hello
          </div>
        </animated.div>
        <animated.div
          style={menuStyles}
          className="absolute top-0 bottom-0 left-0 w-4/5 z-30 bg-gray-900 md:hidden"
        >
          <p>hello</p>
        </animated.div> */}
      </div>
    </div>
  );
}

export default SmallMenu;
