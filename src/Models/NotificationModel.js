import {atom, useRecoilState} from "recoil"

export const notificationsAtom = atom({
    key: "notifications",
    default: []
})

export function useNotificationModel() {
    const [notifications, setNotifications] = useRecoilState(notificationsAtom)
    
    function add(notification) {
        
        setNotifications([...notifications, notification])

    }

    return {add}
}

export class NotificationObject {
    constructor(title, description, iconType) {
        this.title = title
        this.description = description
        this.iconType = iconType
    }
}