import { auth, db } from '../firebase-config';
import { getDoc, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const getOrCreateUser = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
    } else {
        const newUser = {
            displayName: auth.currentUser?.displayName || "",
            email: auth.currentUser?.email || "",
            photoURL: auth.currentUser?.photoURL || "",
            bio: "",
            posts: [],
            favorites: [],
            genres: [],
            userType: ""
            // TODO : optional to add comments array with references (pid, cid)
        };

        // Add user to Firestore
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, userObj);

        return userObj;
    } catch (e) {
        console.error("Error updating experience: ", e);
        throw new Error(e.message);
    }
};

// Function to update user's display name
export const updateUserDisplayName = async (uid, displayName) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { displayName });
    } catch (e) {
        console.error("Error updating display name: ", e);
        throw new Error(e.message);
    }
};

// Function to update user's photo URL
export const updateUserPhotoURL = async (uid, photoURL) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { photoURL });
    } catch (e) {
        console.error("Error updating photo URL: ", e);
        throw new Error(e.message);
    }
};

// Function to update user's bio
export const updateUserBio = async (uid, bio) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { bio });
    } catch (e) {
        console.error("Error updating bio: ", e);
        throw new Error(e.message);
    }
};

// Function to update user's posts
// TODO : split to add and remove
export const updateUserPosts = async (uid, posts) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { posts });
    } catch (e) {
        console.error("Error updating posts: ", e);
        throw new Error(e.message);
    }
};

// Function to add a favorite to user's favorites
export const addFavorite = async (uid, favorite) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            favorites: arrayUnion(favorite)
        });
        console.log(`Added ${favorite} to favorites for user ${uid}`);
    } catch (e) {
        console.error("Error adding favorite: ", e);
        throw new Error(e.message);
    }
};

// Function to remove a favorite from user's favorites
export const removeFavorite = async (uid, favorite) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            favorites: arrayRemove(favorite)
        });
        console.log(`Removed ${favorite} from favorites for user ${uid}`);
    } catch (e) {
        console.error("Error removing favorite: ", e);
        throw new Error(e.message);
    }
};
// Function to update user's genres
export const updateUserGenres = async (uid, genres) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { genres });
    } catch (e) {
        console.error("Error updating genres: ", e);
        throw new Error(e.message);
    }
};

// Function to update user's user type
export const updateUserUserType = async (uid, userType) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { userType });
    } catch (e) {
        console.error("Error updating user type: ", e);
        throw new Error(e.message);
    }
};

// Function to get user details
export const getUser = async (uid) => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        } else {
            console.log("No such user!");
            return null;
        }
    } catch (e) {
        console.error("Error getting user: ", e);
        throw new Error(e.message);
    }
};


// // Function to delete a user from Firestore and Authentication
// export const deleteUser = async (uid) => {
//     try {
//         // Delete user from Firestore
//         const userRef = doc(db, "users", uid);
//         await deleteDoc(userRef);

//         // Delete user from Firebase Authentication
//         const user = auth.currentUser;
//         if (user && user.uid === uid) {
//             await deleteAuthUser(user);
//         } else {
//             console.error("Error: No user is currently signed in or UID does not match.");
//             throw new Error("No user is currently signed in or UID does not match.");
//         }

        // TODO : delete all posts created

        console.log("User deleted");
    } catch (e) {
        console.error("Error deleting user: ", e);
        throw new Error(e.message);
    }
};