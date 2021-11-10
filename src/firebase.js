import firebase from "firebase/compat";

const firebaseConfig = {
    apiKey: "AIzaSyByTnxk98TRAuu9CD0Ea1nHVR5WyJ0WtaQ",
    authDomain: "store-managing-29686.firebaseapp.com",
    projectId: "store-managing-29686",
    storageBucket: "store-managing-29686.appspot.com",
    messagingSenderId: "367427230566",
    appId: "1:367427230566:web:43cbdc674162c886a546a7"
};

let instance;

export default function getFirebase() {
    if (typeof window !== "undefined") {
        if (instance) return instance;
        instance = firebase.initializeApp(firebaseConfig);
        return instance;
    }

    return null;
}