# Database Structure

The Firestore database structure is illustrated in the diagram below:
```
Firestore Database
|
|-- users (collection)
|   |-- {uid} (document)
|       |-- displayName: string
|       |-- email: string
|       |-- photoURL: string
|       |-- bio: string
|       |-- posts: array of references to posts
|       |-- favorites: array of references to posts
|       |-- genres: array of strings
|       |-- userType: string
|
|-- posts (collection)
|   |-- {pid} (document)
|       |-- user: reference to a user
|       |-- content: string
|       |-- timestamp: string (date and time)
|       |-- fileURL: string
|       |-- postType: string
|       |
|       |-- comments (sub-collection)
|           |-- {cid} (document)
|               |-- user: reference to a user
|               |-- content: string
|               |-- timestamp: string (date and time)
|               |-- fileURL: string
|               |-- fileType: string

```

## Explanation

1. **Users Collection:**
    - Each user document uses the `uid` as the document ID.
    - It contains the user's profile information and references to posts and favorites.
    - **Fields:**
        - `displayName`: string
        - `email`: string
        - `photoURL`: string
        - `bio`: string
        - `posts`: array of references to posts
        - `favorites`: array of references to posts
        - `genres`: array of strings
        - `userType`: string

2. **Posts Collection:**
    - Each post document contains references to the user who created it and includes post-specific details.
    - The `pid` is used as the document ID.
    - **Fields:**
        - `user`: reference to a user
        - `content`: string
        - `timestamp`: string (date and time)
        - `fileURL`: string
        - `postType`: string
    - **Comments Sub-collection:**
        - Each comment document within a post's comments sub-collection includes references to the user who created the comment and comment-specific details.
        - The `cid` is used as the document ID.
        - **Fields:**
            - `user`: reference to a user
            - `content`: string
            - `timestamp`: string (date and time)
            - `fileURL`: string
            - `fileType`: string

## Database Operations Files

The project directory structure includes the following files for managing Firestore operations:


```
museek/
│
├── src/
│   └── firestore/
│       ├── comments.js
│       ├── posts.js
│       └── users.js
│
├── firebase-config.js
│
└── storage.js       
```

- **comments.js:** Contains functions to manage comments in the Firestore database, such as adding, retrieving, and deleting comments.
- **posts.js:** Contains functions to manage posts in the Firestore database, such as adding, retrieving, and deleting posts.
- **users.js:** Contains functions to manage users in the Firestore database, such as adding, retrieving, and deleting users, as well as updating user details.

- **firebase-config.js:** Configuration file for initializing Firebase in the project.
- **storage.js:** Contains functions to manage file uploads to Firebase Storage.

## Usage

### User operations
- **adding User:** Use the `signUpWithGoogle` function in `users.js` to sign up a user with Google authentication and create their profile in Firestore.
- **updating User Details:** Use specific functions in `users.js` to update user details, such as `updateUserDisplayName`, `updateUserPhotoURL`, `updateUserBio`, etc.
- **Deleting a User:** Use the deleteUser function in `users.js` to delete a user from Firestore and Firebase Authentication.
### Post operations
- **Adding a Post:** Use the `addPost` function in `posts.js` to add a new post to the Firestore database.
- **Deleting a Post:** Use the deletePost function in posts.js to delete a post from the Firestore database.

### Comment operations
- **Adding a Comment:** Use the `addComment` function in `comments.js` to add a new comment to a post's comments sub-collection.
- **Deleting a Comment:** Use the deleteComment function in comments.js to delete a comment from a post's comments sub-collection.