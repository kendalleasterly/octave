import { animated, useSpring, useTransition } from "@react-spring/web";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { headerTextAtom, menuIsActiveAtom } from "../Global/atoms";

import MenuIcon from "../Images/menu.svg";
import Menu from "./Menu";

function SmallMenu() {
  const [menuIsActive, setMenuIsActive] = useRecoilState(menuIsActiveAtom);
  const headerText = useRecoilValue(headerTextAtom);

  const maskTransitions = useTransition(menuIsActive, {
    from: { opacity: 0 },
    enter: { opacity: 0.5 },
    leave: { opacity: 0 },
  });

  const menuTransitions = useTransition(menuIsActive, {
    from: { display: "absolute", opacity: 0},
    enter: { opacity: 1},
    leave: { display: "hidden", opacity: 0},
  });

  return (
    <div>
      <div className="one-button-header z-10">
        <button
          onClick={() => setMenuIsActive(true)}
          className="rounded-full bg-secondarybg p-2.5 md:hidden h-11"
        >
          <img src={MenuIcon} alt="" className="icon" />
        </button>

        <p className="text-lg font-semibold text m-auto text-center">
          {headerText}
        </p>
      </div>

      {/* <div id="small-menu" className = "md:hidden"> */}
      {maskTransitions(
        (styles, item) =>
          item && (
            <animated.div style={styles}>
              <div
                className="bg-black fixed left-0 right-0 top-0 bottom-0"
                onClick={() => setMenuIsActive(false)}
              >
              </div>
            </animated.div>
          )
      )}

      {menuTransitions(
        (styles, item) =>
          item && (
            <animated.div style={styles}>
              <div className="bg-gray-900 fixed left-0 w-4/5 top-0 bottom-0 pb-17">
                <Menu/>
              </div>
            </animated.div>
          )
      )}
    </div>
  );
}

export default SmallMenu;
