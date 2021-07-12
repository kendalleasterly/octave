import { useSetRecoilState } from "recoil"
import { isDarkAtom } from "./atoms"


export function getLSSetting(setting) {

    const isDark = localStorage.getItem(setting)

    if (isDark) {
        return isDark
    } else {
        return false
    }
}