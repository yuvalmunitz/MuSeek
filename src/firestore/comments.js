import { db } from '../firebase-config';
import { collection, addDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { uploadFile } from '../storage';

// Function to add a comment to a post
export const addComment = async (postId, comment, file) => {
    try {
        // Upload file to Firebase Storage if provided
        let fileURL = '';
        if (file) {
            const path = `comments/${postId}/${file.name}`;
            fileURL = await uploadFile(file, path);
        }

        // Add fileURL and timestamp to the comment object
        const commentWithFileURL = {
            ...comment,
            fileURL,
            timestamp: new Date().toISOString(),
        };

        // Add the comment to the Firestore 'comments' sub-collection of the post
        const postRef = doc(db, "posts", postId);
        const commentsCollectionRef = collection(postRef, "comments");
        const commentRef = await addDoc(commentsCollectionRef, commentWithFileURL);
        const commentId = commentRef.id;

        return commentId;
    } catch (e) {
        console.error("Error adding comment: ", e);
        throw new Error(e.message);
    }
};

// Function to get comments for a post
export const getComments = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const commentsCollectionRef = collection(postRef, "comments");
        const commentsSnap = await getDocs(commentsCollectionRef);
        const comments = commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return comments;
    } catch (e) {
        console.error("Error getting comments: ", e);
        throw new Error(e.message);
    }
};

// Function to delete a comment
export const deleteComment = async (postId, commentId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const commentRef = doc(postRef, "comments", commentId);
        await deleteDoc(commentRef);
        console.log("Comment deleted");
    } catch (e) {
        console.error("Error deleting comment: ", e);
        throw new Error(e.message);
    }
};