import React, { useEffect, useState } from "react"
import { useSpring, animated, useTransition } from "@react-spring/web"
import { useRecoilState, useRecoilValue } from "recoil"
import { notificationsAtom } from "../Models/NotificationModel"

function Notification({ notificationObject, isSmall }) {
	const [isShowing, setIsShowing] = useState(true)
	const [notifications, setNotifications] = useRecoilState(notificationsAtom)

	useEffect(() => {

		setTimeout(() => {
			setIsShowing(false)
		}, 3000)
	})

	const transitions = useTransition(isShowing, {
		from: { opacity: 0.25, transform: isSmall ? "translatey(-100)": "translatex(100%)" },
		enter: { opacity: 1, transform: isSmall ? "translatey(0%)": "translatex(0%)"  },
		leave: { opacity: 0, transform: isSmall ? "translatey(-100)": "translatex(100%)"  },
		onDestroyed: () => {
			const index = notifications.indexOf(notificationObject)

			// if (index > -1) {
			let newNotifications = [...notifications]

			newNotifications.splice(index, 1)
			setNotifications(newNotifications)
			// }
		},
	})

	return transitions(
		(styles, item) =>
			item && (
				<animated.div style={styles}>
					<div className="flex bg-tertiarybg px-6 py-2 rounded-lg space-x-4 ">
						<img src={notificationObject.icon} alt="" />

						<div>
							<p className="text-sm text-white md:text-base">{notificationObject.title}</p>
							<p className="text-xs md:text-sm text-gray-400">
								{notificationObject.description}
							</p>
						</div>
					</div>
				</animated.div>
			)
	)
}

export default Notification
