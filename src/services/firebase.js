import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; 

const firebaseConfig = {
    apiKey: "AIzaSyDpHH1IzEK0y-eLEtAJxcYnfoYkCrQ6Fl0",
    authDomain: "edss-mobile.firebaseapp.com",
    projectId: "edss-mobile",
    storageBucket: "edss-mobile.appspot.com",
    messagingSenderId: "12525033600",
    appId: "1:12525033600:web:95fff7adb3d874c139ae65"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
    return signInWithPopup(auth, provider)
      .then((result) => {
        // Handle the result as needed, maybe return user info here
        return { user: result.user };
      })
      .catch((error) => {
        // Handle errors here
        throw error; // Rethrow or handle as needed
      });
  };

export { auth, signInWithGoogle };
