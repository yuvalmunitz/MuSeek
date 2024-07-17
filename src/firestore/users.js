// import{ auth, db, storage } from '../firebase-config';
// import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';  // Add this line
// import { getDoc, doc, setDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection } from 'firebase/firestore';
// import { uploadFile } from '../storage';


// export const getOrCreateUser = async (uid) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         const userSnap = await getDoc(userRef);
        
//         if (userSnap.exists()) {
//             console.log("User already exists, returning user data");
//             return { id: userSnap.id, ...userSnap.data() };
//         } else {
//             console.log("User doesn't exist, creating new user");
//             const currentUser = auth.currentUser;
//             if (!currentUser) {
//                 throw new Error("No authenticated user found");
//             }

//             let photoURL = currentUser.photoURL;

//             // If there's a Google photo URL, download and upload to Firebase Storage
//             if (photoURL && photoURL.includes('googleusercontent.com')) {
//                 try {
//                     console.log("Downloading and uploading Google profile picture");
//                     // Use a CORS proxy to fetch the image
//                     const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
//                     const response = await fetch(corsProxyUrl + photoURL, {
//                         headers: {
//                             'Origin': window.location.origin
//                         }
//                     });
//                     if (!response.ok) {
//                         throw new Error(`HTTP error! status: ${response.status}`);
//                     }
//                     const blob = await response.blob();
//                     const storageRef = ref(storage, `userPhotos/${uid}/profile.jpg`);
//                     await uploadBytes(storageRef, blob);
//                     photoURL = await getDownloadURL(storageRef);
//                 } catch (error) {
//                     console.error("Error processing profile picture:", error);
//                     // If there's an error with the photo, we'll use a default avatar URL
//                     photoURL = 'https://example.com/default-avatar.png'; // Replace with your default avatar URL
//                 }
//             }

//             const newUser = {
//                 displayName: currentUser.displayName || "",
//                 email: currentUser.email || "",
//                 photoURL: photoURL || "",
//                 bio: "",
//                 posts: [],
//                 favorites: [],
//                 genres: [],
//                 userType: "",
//                 performer: "",
//                 recorder: "",
//                 experience: ""
//             };

//             console.log("Setting new user document in Firestore");
//             await setDoc(userRef, newUser);
//             return { id: uid, ...newUser };
//         }
//     } catch (error) {
//         console.error("Error in getOrCreateUser:", error);
//         throw error;
//     }
// };

// export const updateUserGenres = async (uid, genres) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, { genres });
//     } catch (e) {
//         console.error("Error updating genres: ", e);
//         throw new Error(e.message);
//     }
// };

// export const updateUserType = async (uid, userType) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, { userType });
//     } catch (e) {
//         console.error("Error updating user type: ", e);
//         throw new Error(e.message);
//     }
// };

// export const updateUserPerformer = async (uid, performer) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, { performer });
//     } catch (e) {
//         console.error("Error updating performer status: ", e);
//         throw new Error(e.message);
//     }
// };

// export const updateUserRecorder = async (uid, recorder) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, { recorder });
//     } catch (e) {
//         console.error("Error updating recorder status: ", e);
//         throw new Error(e.message);
//     }
// };

// export const updateUserExperience = async (uid, experience) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, { experience });
//     } catch (e) {
//         console.error("Error updating experience: ", e);
//         throw new Error(e.message);
//     }
// };

// export const updateUserDisplayName = async (uid, displayName) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, { displayName });
//     } catch (e) {
//         console.error("Error updating display name: ", e);
//         throw new Error(e.message);
//     }
// };

// export const updateUserPhotoURL = async (uid, photoURL) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, { photoURL });
//     } catch (e) {
//         console.error("Error updating photo URL: ", e);
//         throw new Error(e.message);
//     }
// };

// export const updateUserBio = async (uid, bio) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, { bio });
//     } catch (e) {
//         console.error("Error updating bio: ", e);
//         throw new Error(e.message);
//     }
// };

// export const updateUserPosts = async (uid, posts) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, { posts });
//     } catch (e) {
//         console.error("Error updating posts: ", e);
//         throw new Error(e.message);
//     }
// };

// export const addFavorite = async (uid, favorite) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, {
//             favorites: arrayUnion(favorite)
//         });
//         console.log(`Added ${favorite} to favorites for user ${uid}`);
//     } catch (e) {
//         console.error("Error adding favorite: ", e);
//         throw new Error(e.message);
//     }
// };

// export const removeFavorite = async (uid, favorite) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         await updateDoc(userRef, {
//             favorites: arrayRemove(favorite)
//         });
//         console.log(`Removed ${favorite} from favorites for user ${uid}`);
//     } catch (e) {
//         console.error("Error removing favorite: ", e);
//         throw new Error(e.message);
//     }
// };

// export const getUser = async (uid) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//             return { id: userSnap.id, ...userSnap.data() };
//         } else {
//             console.log("No such user!");
//             return null;
//         }
//     } catch (e) {
//         console.error("Error getting user: ", e);
//         throw new Error(e.message);
//     }
// };


// export const addPostToUser = async (uid, postData) => {
//     try {
//         const userRef = doc(db, "users", uid);
//         let audioURL = null;
//         let pdfURL = null;

//         // Upload audio file if present
//         if (postData.audio) {
//             const audioPath = `posts/${uid}/audio_${Date.now()}.mp3`;
//             audioURL = await uploadFile(postData.audio, audioPath);
//             console.log("Uploaded audio URL:", audioURL);
//         }

//         // Upload PDF file if present
//         if (postData.pdf) {
//             const pdfPath = `posts/${uid}/pdf_${Date.now()}.pdf`;
//             pdfURL = await uploadFile(postData.pdf, pdfPath);
//             console.log("Uploaded PDF URL:", pdfURL);
//         }

//         // Create post object with file URLs
//         const newPost = {
//             ...postData,
//             audio: audioURL,
//             pdf: pdfURL,
//             createdAt: new Date().toISOString(),
//             userId: uid
//         };

//         // Add post to Firestore
//         const postRef = await addDoc(collection(db, "posts"), newPost);
//         const postId = postRef.id;

//         // Add post ID to user's posts array
//         await updateDoc(userRef, {
//             posts: arrayUnion(postId)
//         });

//         console.log(`Added post ${postId} to user ${uid}`);
//         return postId;
//     } catch (e) {
//         console.error("Error adding post to user: ", e);
//         throw new Error(e.message);
//     }
// };


import { auth, db, storage } from '../firebase-config';
import { 
    getDoc, 
    doc, 
    setDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
const DEFAULT_AVATAR_URL = "https://example.com/default-avatar.png";

export const getOrCreateUser = async (uid) => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            return { 
                id: userSnap.id, 
                ...userData,
                photoURL: userData.photoURL === DEFAULT_AVATAR_URL ? null : userData.photoURL
            };
        } else {
            console.log("User doesn't exist, creating new user");
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error("No authenticated user found");
            }

            let photoURL = currentUser.photoURL;

            if (photoURL && photoURL.includes('googleusercontent.com')) {
                try {
                    console.log("Downloading and uploading Google profile picture");
                    const response = await fetch(photoURL);
                    const blob = await response.blob();
                    const storageRef = ref(storage, `userPhotos/${uid}/profile.jpg`);
                    await uploadBytes(storageRef, blob);
                    photoURL = await getDownloadURL(storageRef);
                } catch (error) {
                    console.error("Error processing profile picture:", error);
                    photoURL = null;
                }
            } else if (photoURL === DEFAULT_AVATAR_URL) {
                photoURL = null;
            }

            const newUser = {
                displayName: currentUser.displayName || "",
                email: currentUser.email || "",
                photoURL: photoURL,
                bio: "",
                posts: [],
                favorites: [],
                genres: [],
                userType: "",
                performer: "",
                recorder: "",
                experience: ""
            };

            console.log("Setting new user document in Firestore");
            await setDoc(userRef, newUser);
            return { id: uid, ...newUser };
        }
    } catch (error) {
        console.error("Error in getOrCreateUser:", error);
        throw error;
    }
};

export const updateUserDisplayName = async (uid, displayName) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { displayName });
    } catch (e) {
        console.error("Error updating display name: ", e);
        throw new Error(e.message);
    }
};

export const updateUserPhotoURL = async (uid, photoURL) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { 
            photoURL: photoURL === DEFAULT_AVATAR_URL ? null : photoURL 
        });
    } catch (e) {
        console.error("Error updating photo URL: ", e);
        throw new Error(e.message);
    }
};

export const updateUserBio = async (uid, bio) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { bio });
    } catch (e) {
        console.error("Error updating bio: ", e);
        throw new Error(e.message);
    }
};

export const updateUserGenres = async (uid, genres) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { genres });
    } catch (e) {
        console.error("Error updating genres: ", e);
        throw new Error(e.message);
    }
};

export const updateUserType = async (uid, userType) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { userType });
    } catch (e) {
        console.error("Error updating user type: ", e);
        throw new Error(e.message);
    }
};

export const updateUserPerformer = async (uid, performer) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { performer });
    } catch (e) {
        console.error("Error updating performer status: ", e);
        throw new Error(e.message);
    }
};

export const updateUserRecorder = async (uid, recorder) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { recorder });
    } catch (e) {
        console.error("Error updating recorder status: ", e);
        throw new Error(e.message);
    }
};

export const updateUserExperience = async (uid, experience) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { experience });
    } catch (e) {
        console.error("Error updating experience: ", e);
        throw new Error(e.message);
    }
};
export const addFavorite = async (uid, postId) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            favorites: arrayUnion(postId)
        });
        console.log(`Added post ${postId} to favorites for user ${uid}`);
    } catch (e) {
        console.error("Error adding favorite: ", e);
        throw new Error(e.message);
    }
};

export const removeFavorite = async (uid, postId) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            favorites: arrayRemove(postId)
        });
        console.log(`Removed post ${postId} from favorites for user ${uid}`);
    } catch (e) {
        console.error("Error removing favorite: ", e);
        throw new Error(e.message);
    }
};

export const getUserFavorites = async (uid) => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            return userData.favorites || [];
        } else {
            console.log("No such user!");
            return [];
        }
    } catch (e) {
        console.error("Error getting user favorites: ", e);
        throw new Error(e.message);
    }
};


export const getUser = async (uid) => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            return { 
                id: userSnap.id, 
                ...userData,
                photoURL: userData.photoURL === DEFAULT_AVATAR_URL ? null : userData.photoURL
            };
        } else {
            console.log("No such user!");
            return null;
        }
    } catch (e) {
        console.error("Error getting user: ", e);
        throw new Error(e.message);
    }
};

export const addPostToUser = async (uid, postData) => {
    try {
        const userRef = doc(db, "users", uid);
        let audioURL = null;
        let pdfURL = null;

        if (postData.audio) {
            const audioPath = `posts/${uid}/audio_${Date.now()}.mp3`;
            audioURL = await uploadFile(postData.audio, audioPath);
            console.log("Uploaded audio URL:", audioURL);
        }

        if (postData.pdf) {
            const pdfPath = `posts/${uid}/pdf_${Date.now()}.pdf`;
            pdfURL = await uploadFile(postData.pdf, pdfPath);
            console.log("Uploaded PDF URL:", pdfURL);
        }

        const newPost = {
            ...postData,
            audio: audioURL,
            pdf: pdfURL,
            createdAt: new Date().toISOString(),
            userId: uid,
            userPhotoURL: postData.userPhotoURL === DEFAULT_AVATAR_URL ? null : postData.userPhotoURL
        };

        const postRef = await addDoc(collection(db, "posts"), newPost);
        const postId = postRef.id;

        await updateDoc(userRef, {
            posts: arrayUnion(postId)
        });

        console.log(`Added post ${postId} to user ${uid}`);
        return postId;
    } catch (e) {
        console.error("Error adding post to user: ", e);
        throw new Error(e.message);
    }
};

export const deletePost = async (uid, postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            const postData = postSnap.data();

            // Delete associated files
            if (postData.audio) {
                await deleteObject(ref(storage, postData.audio));
            }
            if (postData.pdf) {
                await deleteObject(ref(storage, postData.pdf));
            }

            // Delete the post document
            await deleteDoc(postRef);

            // Remove post ID from user's posts array
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                posts: arrayRemove(postId)
            });

            console.log(`Deleted post ${postId} for user ${uid}`);
        } else {
            console.log(`Post ${postId} not found`);
        }
    } catch (e) {
        console.error("Error deleting post: ", e);
        throw new Error(e.message);
    }
};

const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

export const getUserPosts = async (uid) => {
    try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("userId", "==", uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            userPhotoURL: doc.data().userPhotoURL === DEFAULT_AVATAR_URL ? null : doc.data().userPhotoURL
        }));
    } catch (e) {
        console.error("Error getting user posts: ", e);
        throw new Error(e.message);
    }
};