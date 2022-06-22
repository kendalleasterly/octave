import axios from "axios"
import { atom, useRecoilState } from "recoil"
import { auth, fb, firestore } from "../Global/firebase"
import { NotificationObject, useNotificationModel } from "./NotificationModel"
import { useTrackModel } from "./TrackModel"

class Account {
    constructor(isSignedIn, name, email, uid, simplePlaylists, savedTracks) {
        this.isSignedIn = isSignedIn
        this.name = name
        this.email = email
        this.uid = uid
        this.simplePlaylists = simplePlaylists
        this.savedTracks = savedTracks
    }
}

export const accountAtom = atom({
    key: "account",
    default: new Account(false, "", "", "", [], {})
})

export function useAccountModel() {

    const notificationModel = useNotificationModel()
    const trackModel = useTrackModel()
    const [account, setAccount] = useRecoilState(accountAtom)

    function signIn() {
		var provider = new fb.auth.GoogleAuthProvider()

		auth.signInWithRedirect(provider)
	}

    function getAccount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                if (!account.isSignedIn) {
                    firestore.collection("users").doc(user.uid).onSnapshot(doc => {

                        if (doc.exists) {

                            const simplePlaylists = doc.data().simplePlaylists
                            let savedTracks = {}

                            Object.values(doc.data().savedTracks).map((track) => {
                                if (track.id && track.dateAdded) {
                                    savedTracks[track.id] = {
                                        id: track.id,
                                        dateAdded: track.dateAdded.toDate()
                                    }
                                }
                            })
    
                            setAccount(new Account(true, user.displayName, user.email, user.uid, simplePlaylists, savedTracks))
                        } else {
                            doc.ref.set({
                                name: user.displayName,
                                email: user.email,
                                simplePlaylists: [],
                                savedTracks: {}
                            })

                            setAccount(new Account(true, user.displayName, user.email, user.uid, [], {}))

                        }
                    })
                }
            } else {
                console.log("there is no user")
                setAccount(new Account(false, "", "", "", [], {}))
            }
        })
    }

    function signOut() {
        auth.signOut()
        .then(() => {

            notificationModel.add(new NotificationObject("Signed Out", "You were successfully signed out of your account", "success"))

        })
        .catch(error => {
            console.log("error signing out user", error)

            notificationModel.add(new NotificationObject("Couldn't sign you out", "Sorry, there was an error signing you out.", "error"))
        })
    }

    function checkForGoogleRedirect() {
        auth.getRedirectResult()
        .then(result => {

            if (result.user) { //only runs when there was a redirect

                console.log("there was a redirect")

                const user = result.user
                notificationModel.add(new NotificationObject("We've signed you in", `You've been signed in as ${user.displayName}. View the settings page to log out at any time.`, "success"))

                //get or set their data

                firestore.collection("users").doc(user.uid).get()
                .then(doc => {

                    console.log("got data from redirect result")

                    if (!doc.exists) { //we need to set the data in firebase because it's not there yet
                        doc.ref.set({
                            name: user.displayName,
                            email: user.email,
                            simplePlaylists: [],
                            savedTracks: []
                        })
                    }
                })
            }
        })
        .catch(error => {
            console.log("error getting redirect result", error)

            notificationModel.add(new NotificationObject("Couldn't sign you in", "Sorry, there was an error signing you in.", "error"))
        })
    }

    function saveTrack(track) {

        let accountRef = firestore.collection("users").doc(account.uid)

        let updatedData = {}
        updatedData["savedTracks." + track.id] = {
            id: track.id,
            dateAdded: fb.firestore.FieldValue.serverTimestamp()
        }

        console.log({updatedData})

        accountRef.update(updatedData)
        .then(() => {

            trackModel.addTrackToDatabase(track)

            notificationModel.add(new NotificationObject(`Saved ${track.title}`, `${track.title} was successfully saved to your library.`, "success"))
        })
        .catch(error => {
            console.log("error adding track to library", error)
            notificationModel.add(new NotificationObject(`Couldn't Save ${track.title}`, `${track.title} couldn't be saved to your library.`, "error"))
        })
    }

    function removeTrack(track) {
 
        let accountRef = firestore.collection("users").doc(account.uid)

        let updatedData = {}
        updatedData["savedTracks." + track.id] = fb.firestore.FieldValue.delete()

        accountRef.update(updatedData)
        .then(() => {
            notificationModel.add(new NotificationObject(`Removed ${track.title}`, `${track.title} was successfully removed from your library.`, "success"))
        })
        .catch(error => {
            console.log("error removing track from library", error)

            notificationModel.add(new NotificationObject(`Couldn't Remove ${track.title}`, `${track.title} couldn't be removed from your library.`, "error"))
        })
    }

    return {signIn, checkForGoogleRedirect, getAccount, signOut, saveTrack, removeTrack}
}