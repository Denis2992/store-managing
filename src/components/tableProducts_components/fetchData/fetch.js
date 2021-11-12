import getFirebase from "../../../firebase";

const firebase = getFirebase();

export const fetchData = async (collectionName, setState) => {
    try {
        if (!firebase) return;
        const db = firebase.firestore();
        const ref = db.collection(`${collectionName}`);
        await ref.get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    setState(prevState => [...prevState, doc.data()])
                })
            })
    } catch (error) {
        console.log("error", error);
    }
};