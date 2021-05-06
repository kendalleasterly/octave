import firebase from "firebase/app"
import "firebase/firestore"

if (!firebase.apps.length) {
	firebase.initializeApp({
		apiKey: "AIzaSyCzfsKbHeb3tNTadMgjU66NGihjZCDTOq0",
		authDomain: "open-music-1.firebaseapp.com",
		projectId: "open-music-1",
		storageBucket: "open-music-1.appspot.com",
		messagingSenderId: "704125264337",
		appId: "1:704125264337:web:ec56d824342a57a6bc80f0",
		measurementId: "G-49F3MFNKYD",
	})
}

export const firestore = firebase.firestore()
export const fb = firebase