import { db } from '../firebase-config';
import { collection, addDoc, getDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDocs } from 'firebase/firestore';
import { uploadFile } from '../storage';

// Function to add a post
export const addPost = async (post, file) => {
    try {
        // Upload file to Firebase Storage if provided
        let fileURL = '';
        if (file) {
            const path = `posts/${post.user.id}/${file.name}`;
            fileURL = await uploadFile(file, path);
        }

        // Add fileURL and timestamp to the post object
        const postWithFileURL = {
            ...post,
            fileURL,
            timestamp: new Date().toISOString(),
        };

        // Add the post to the Firestore 'posts' collection
        const postRef = await addDoc(collection(db, "posts"), postWithFileURL);
        const postId = postRef.id;

        // Update the user's posts array with a reference to the new post
        const userRef = doc(db, "users", post.user.id);
        await updateDoc(userRef, {
            posts: arrayUnion(postRef)
        });

        return postId;
    } catch (e) {
        console.error("Error adding post: ", e);
        throw new Error(e.message);
    }
};

// Function to get a post
export const getPost = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            const post = { id: postSnap.id, ...postSnap.data() };

            const commentsQuery = collection(postRef, "comments");
            const commentsSnap = await getDocs(commentsQuery);
            const comments = commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            return { post, comments };
        } else {
            console.log("No such post!");
            return null;
        }
    } catch (e) {
        console.error("Error getting post: ", e);
        throw new Error(e.message);
    }
};

// Function to delete a post
export const deletePost = async (postId, userId) => {
    try {
        const postRef = doc(db, "posts", postId);
        await deleteDoc(postRef);

        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            posts: arrayRemove(postRef)
        });

        console.log("Post deleted");
    } catch (e) {
        console.error("Error deleting post: ", e);
        throw new Error(e.message);
    }
};