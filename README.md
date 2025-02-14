# Table of Contents

- [Table of Contents](#table-of-contents)
- [**STAC – The Ultimate Creative Platform for Artists** 🎨✨](#stac--the-ultimate-creative-platform-for-artists-)
  - [**Introduction**](#introduction)
  - [**Key Pages \& Structure**](#key-pages--structure)
    - [**1️⃣ Landing Page (For Unregistered/Unlogged Users)**](#1️⃣-landing-page-for-unregisteredunlogged-users)
      - [**Features:**](#features)
    - [**2️⃣ Art Works Page (For Logged-in Users)**](#2️⃣-art-works-page-for-logged-in-users)
      - [**Features:**](#features-1)
    - [**3️⃣ Sponsor Challenge Page (For All Logged-in Users)**](#3️⃣-sponsor-challenge-page-for-all-logged-in-users)
      - [**Features:**](#features-2)
    - [**4️⃣ User Profile Page (For Both Free and Pro Users)**](#4️⃣-user-profile-page-for-both-free-and-pro-users)
      - [**Features:**](#features-3)
    - [**5️⃣ Admin Dashboard (For Admins Only)**](#5️⃣-admin-dashboard-for-admins-only)
      - [**Features:**](#features-4)
  - [\*\* Tech Stack\*\*](#-tech-stack)
    - [Development Tools:](#development-tools)
    - [Optional Libraries \& Plugins:](#optional-libraries--plugins)
  - [\*\* Features \*\*](#-features-)
  - [\*\* Installation \& Setup \*\*](#-installation--setup-)
    - [Prerequisites](#prerequisites)
    - [Step-by-Step Installation](#step-by-step-installation)
    - [Additional Notes](#additional-notes)
  - [Usage Guide](#usage-guide)
  - [API Functions](#api-functions)
    - [1. Authentication \& Security](#1-authentication--security)
      - [1.1 CSRF Protection](#11-csrf-protection)
      - [1.2 Registration \& Login](#12-registration--login)
      - [1.3 Logout \& Account Management](#13-logout--account-management)
    - [2. User Management](#2-user-management)
      - [2.1 Fetching User Data](#21-fetching-user-data)
      - [2.2 Updating User Profile](#22-updating-user-profile)
      - [2.3 Avatar Management](#23-avatar-management)
    - [3. Artwork Management](#3-artwork-management)
      - [3.1 Fetching Artworks](#31-fetching-artworks)
      - [3.2 Current Theme](#32-current-theme)
      - [3.3 Submitting Artwork](#33-submitting-artwork)
      - [3.4 Fetching Artworks](#34-fetching-artworks)
      - [3.5 Fetching Post by ID](#35-fetching-post-by-id)
      - [3.6 Deleting Artwork Post](#36-deleting-artwork-post)
    - [4. Comments Management](#4-comments-management)
      - [4.1 Fetching Comments](#41-fetching-comments)
      - [4.2 Creating a Comment](#42-creating-a-comment)
      - [4.3 Deleting a Comment](#43-deleting-a-comment)
    - [5. Likes Management](#5-likes-management)
      - [5.1 Liking a Post](#51-liking-a-post)
      - [5.2 Unliking a Post](#52-unliking-a-post)
      - [5.3 Fetching Likes](#53-fetching-likes)
      - [5.4 Check if User Liked a Post](#54-check-if-user-liked-a-post)
    - [6. Challenge Management](#6-challenge-management)
      - [6.1 Fetching Challenges](#61-fetching-challenges)
      - [6.2 Fetching Challenge Details](#62-fetching-challenge-details)
      - [6.3 Submitting Work to a Challenge](#63-submitting-work-to-a-challenge)
      - [6.4 Fetching Submissions](#64-fetching-submissions)
      - [6.5 Deleting Submission](#65-deleting-submission)
      - [6.6 Voting on Submissions](#66-voting-on-submissions)
      - [6.7 Removing Vote](#67-removing-vote)
      - [6.8 Checking User Vote](#68-checking-user-vote)
    - [7.Admin Management API Calls](#7admin-management-api-calls)
      - [7.1 Users Management](#71-users-management)
      - [7.2 Sponsor Challenges Management](#72-sponsor-challenges-management)
      - [7.3 Theme Management](#73-theme-management)
  - [Troubleshooting \& Common Issues](#troubleshooting--common-issues)
    - [1. **API Call Failures**](#1-api-call-failures)
    - [2. **CSRF Token Errors**](#2-csrf-token-errors)
    - [3. **Authentication Errors**](#3-authentication-errors)
    - [4. **State Management Issues**](#4-state-management-issues)
    - [5. **UI/UX Issues**](#5-uiux-issues)
    - [6. **Component Errors (e.g., `FullScreenPost` or `CommentSection`)**](#6-component-errors-eg-fullscreenpost-or-commentsection)
    - [7. **File Upload Issues**](#7-file-upload-issues)
    - [8. **Authentication with Sanctum**](#8-authentication-with-sanctum)
  - [Contribution](#contribution)
  - [License](#license)
  - [Contact \& Support](#contact--support)

# **STAC – The Ultimate Creative Platform for Artists** 🎨✨  

## **Introduction**  
**STAC** is an exclusive platform for artists, designed to foster creativity through themed challenges and sponsor collaborations.  
Similar to platforms like **Behance**, **Dribbble**, or **Pinterest**, STAC enables users to **post, share, and showcase their work** within a creative community.  

However, the core distinction lies in the unique **monthly theme requirement**:  
> Every month, a new **specific theme** is introduced, and users must submit artwork related to that theme to be featured and published.  

Additionally, **pro users** gain access to **sponsor challenges**, where winning artwork is guaranteed to be featured in **collaborations with world-renowned brands**.  

---

## **Key Pages & Structure**  

### **1️⃣ Landing Page (For Unregistered/Unlogged Users)**  
This page aims to inspire and motivate unregistered users to **sign up** or **subscribe to a pro account**.  

#### **Features:**  
- **Hero Section** – A banner with motivational content and a preview of featured artworks.  
- **Call to Action (CTA)** – Buttons encouraging **sign-up, log-in, or subscription**.  
- **Monthly Theme Preview** – Display of the **current theme** and a slider showcasing artworks from **last month**.  
- **How It Works** – Explanation of how users can submit their work following the monthly theme, and the **benefits of pro accounts**.  
- **Subscription Teaser** – A side-by-side comparison of **free vs. pro** accounts, highlighting benefits like sponsor challenges and portfolio promotion.  
- **Footer** – Links to **social media, terms of service, and contact info**.  

---

### **2️⃣ Art Works Page (For Logged-in Users)**  
The main space where users can **view and interact** with monthly themed artworks.  

#### **Features:**  
- **Current Theme Display** – The top of the page showcases the **current monthly theme** with relevant details.  
- **Art Grid** – Thumbnails of **submitted artworks** focused on the **monthly theme**.  
- **Like & Comment** – Users can **like and comment** on artworks.  
- **Last Month’s Preview** – A horizontal slider displays **top artworks from the previous month**.    

---

### **3️⃣ Sponsor Challenge Page (For All Logged-in Users)**  
This page showcases **brand-sponsored challenges**, giving **pro users** the opportunity to submit their work for potential **brand collaborations**.  

#### **Features:**  
   - **Challenge List** – A display of ongoing sponsor challenges, including:  
     - ***Brand Logo & Name***  
     - ***Challenge Brief*** (artwork requirements)  
     - ***Submission Deadline***  


- **Submitted Works** – All logged-in users can view **artworks submitted by pro users**.  
- **Voting System** – Logged-in users can vote for their favorite work (**one vote per challenge**).  
- **Leaderboard** – **Top-voted submissions** are prominently displayed.  
- **Submit Work Button** – Available **only to pro users** for submitting their work to challenges.  

---

### **4️⃣ User Profile Page (For Both Free and Pro Users)**  
This page allows users to manage their accounts and **pro users** can manage external portfolio links.  

#### **Features:**  
- **Profile Header** – Displays **user avatar, bio**, and (for **pro users**) links to **external portfolios**.  
- **Subscription Status** – Free users will see an **"Upgrade to Pro"** option.  
- **Artwor List** – Displays the user’s **submitted artworks**.  
- **Challenge Submissions** – Pro users can track **their submissions and voting status**.  

---

### **5️⃣ Admin Dashboard (For Admins Only)**  
Admins manage **platform content, user submissions, and sponsor challenges**.  

#### **Features:**  
- **Pending Submissions List** – Admins can **approve or reject submitted submission**.  
- **PPending Artworks List** –  Admins can **approve or reject submitted artworks**.  
- **Manage Challenges** – Create and manage **sponsor challenges**.  
- **User Management** – Manage registered users, including **deleting accounts** or **upgrading users to pro status**.  

---

## ** Tech Stack**  

The project is built using the following major technologies:

- **Vite** – A fast build tool and development server for modern web projects, used for bundling and optimizing the production build.
- **React** – A JavaScript library for building user interfaces with a component-based architecture using JSX.
- **TypeScript** – A superset of JavaScript that adds static types, enhancing code quality and developer experience.
- **Vanilla CSS** – Custom styles without any CSS framework, written directly using traditional CSS for styling.
- **React Router DOM** – A declarative routing library for managing navigation within the React app.
- **Lucide React** – A set of customizable, open-source icons used for UI elements.
- **Swiper** – A modern touch slider for building interactive carousels and image galleries.
- **React Hook Form** – A library for managing form validation and submission in React applications.

### Development Tools:

- **Vitest** – A testing framework for running unit and integration tests in the development environment.
- **ESLint** – A static code analysis tool to identify and fix problems in the JavaScript/TypeScript codebase.
- **React Testing Library** – A testing library for React, focused on testing component behavior from a user interaction perspective.
- **MSW (Mock Service Worker)** – An API mocking library for simulating network requests in testing environments.

### Optional Libraries & Plugins:

- **@Apollo Client** – A GraphQL client for interacting with GraphQL APIs.
- **@vitejs/plugin-react** – Vite plugin for React JSX support.
- **@vitejs/plugin-react-swc** – An alternative Vite plugin for faster React development using the SWC compiler.
- **ESLint Plugins** – Plugins for React Hooks and React Refresh for linting rules related to React development.

## ** Features **

**STAC** offers the following core features:

- **User Authentication**  
  - Sign up and log in functionality for users with **role-based access** (Free and Pro users).
  
- **Artwork Submissions**  
  - Users can submit artworks based on a **monthly theme**.
  - Pro users have enhanced submission options, including participation in **sponsor challenges**.

- **Sponsor Challenges**  
  - Exclusive challenges for **Pro users**, offering a chance to collaborate with well-known brands.
  - Voting system for users to vote for their favorite challenge submissions.

- **User Interaction**  
  - Like and comment on submitted artworks.
  - View artworks by others and interact with the creative community.

- **Profile Management**  
  - Users can manage their profile details, including avatars, bios, and external portfolio links (for Pro users).
  - View and manage submitted artworks and submissions for sponsor challenges.

- **Admin Management**  
  - Admins can approve/reject artwork submissions and manage sponsor challenges.

## ** Installation & Setup **

### Prerequisites  
Before starting, ensure you have the following installed:
- **Node.js**: Version 18 or higher is recommended. You can check if you have Node.js installed by running:  
`node -v`  
If you don't have it installed, you can download it from the [Node.js official website](https://nodejs.org/).

- **npm**: Node package manager should be installed automatically with Node.js. To check npm version:  
`npm -v`

### Step-by-Step Installation

1. **Clone the repository**  
Begin by cloning the repository from GitHub:  
`git clone https://github.com/aNastjaa/stac-frontend.git`

2. **Navigate to the project directory**  
Change your working directory to the cloned repository:  
`cd stac-frontend`

3. **Install dependencies**  
Install the required dependencies using npm:  
`npm install`

4. **Run the development server**  
Start the development server to view the project in your browser:  
`npm run dev`  
This will start the Vite development server, and you should be able to access the project at [http://localhost:5173](http://localhost:5173).

5. **Testing**  
To run tests, you can use the following command:  
`npm run test`

### Additional Notes

- **Environment Variables**  
Make sure to configure any environment variables if required for your project (e.g., API endpoints). These can be placed in the `.env` file.

Example `.env`:  
`VITE_API_URL=http://localhost:8000`

- **Supported Browsers**  
The application is compatible with the following browsers:
  - **Chrome** (Fully supported)
  - **Safari** may have issues with CSRF tokens, so it's not recommended for use with this application.

- **Node Modules**  
Ensure that `node_modules/` is included in `.gitignore` to avoid committing dependencies.

- **Admin Credentials**  
To log in as an admin, use the following credentials:  
  - **Email**: admin@gmail.com  
  - **Password**: AdminPassword2024

## Usage Guide

Simply start the application and explore its features:

- **Register/Login** to access user-specific functionalities.  
- **Submit artworks** and participate in sponsor challenges.  
- **Vote** on submissions to support your favorite entries.  
- **Navigate** through different sections using the menu.  

The app is designed to be user-friendly—just launch and explore!

## API Functions

### 1. Authentication & Security

#### 1.1 CSRF Protection
- `setCsrfCookie()` → Sends a GET request to `/sanctum/csrf-cookie` to set the CSRF cookie.
- `getCsrfTokenFromCookie()` → Extracts the CSRF token from cookies.
- `getAuthToken()` → Retrieves the auth token from localStorage.

#### 1.2 Registration & Login
- `register(formData: FormData)` → Sends a registration request with user data.
- `login(email, password, rememberMe, csrfToken)` → Authenticates a user and stores the token in localStorage.

#### 1.3 Logout & Account Management
- `logout(csrfToken)` → Logs the user out and removes the auth token.
- `deleteUserAccount()` → Deletes the user account.

### 2. User Management

#### 2.1 Fetching User Data
- `getUserIdFromLocalStorage()` → Retrieves the user ID from localStorage.
- `getUserProfileByProfileId(profileId)` → Fetches a user profile by its profile ID.
- `getProfileIdByUserId(userId)` → Gets the profile ID of a user by their user ID.

#### 2.2 Updating User Profile
- `createUserProfile(profileData)` → Creates a new user profile.
- `updateUserProfile(profileData)` → Updates an existing user profile.

#### 2.3 Avatar Management
- `uploadAvatar(file)` → Uploads a user avatar.
- `fetchAvatarUrl(avatarId)` → Fetches the avatar URL by avatarId.

### 3. Artwork Management

#### 3.1 Fetching Artworks
- `fetchUserArtworks(userId)` → Fetches all artworks associated with a user.

#### 3.2 Current Theme
- `fetchCurrentTheme()` → Fetches the current theme for the artwork.

#### 3.3 Submitting Artwork
- `submitArtwork(formData: FormData, csrfToken: string)` → Submits artwork to the backend.

#### 3.4 Fetching Artworks
- `fetchArtworks()` → Retrieves all artworks.

#### 3.5 Fetching Post by ID
- `fetchPostById(postId: string)` → Fetches a specific artwork post by its ID.

#### 3.6 Deleting Artwork Post
- `deletePost(postId: string)` → Deletes an artwork post by its ID.

### 4. Comments Management

#### 4.1 Fetching Comments
- `fetchComments(postId: string)` → Fetches all comments associated with a specific post.

#### 4.2 Creating a Comment
- `createComment(postId: string, commentText: string)` → Creates a comment on a specific post.

#### 4.3 Deleting a Comment
- `deleteComment(postId: string, commentId: string)` → Deletes a comment on a specific post.

### 5. Likes Management

#### 5.1 Liking a Post
- `likePost(postId: string)` → Likes a specific post.

#### 5.2 Unliking a Post
- `unlikePost(postId: string, likeId: string)` → Unlikes a specific post.

#### 5.3 Fetching Likes
- `fetchLikes(postId: string)` → Fetches all likes on a specific post.

#### 5.4 Check if User Liked a Post
- `checkIfUserLiked(postId: string)` → Checks if the current user has liked a specific post.

### 6. Challenge Management

#### 6.1 Fetching Challenges
- `getChallenges()` → Retrieves all sponsor challenges.

#### 6.2 Fetching Challenge Details
- `getChallengeDetails(challengeId: string)` → Fetches detailed information about a specific challenge.

#### 6.3 Submitting Work to a Challenge
- `submitWork(challengeId: string, formData: FormData, csrfToken: string)` → Submits a work to a specific challenge.

#### 6.4 Fetching Submissions
- `getSubmissions(challengeId: string)` → Retrieves all submissions for a specific challenge.

#### 6.5 Deleting Submission
- `deleteSubmission(submissionId: string, challengeId: string)` → Deletes a submission for a specific challenge.

#### 6.6 Voting on Submissions
- `voteForSubmission(challengeId: string, submissionId: string)` → Votes for a submission in a challenge.

#### 6.7 Removing Vote
- `removeVote(challengeId: string, submissionId: string)` → Removes a vote from a submission in a challenge.

#### 6.8 Checking User Vote
- `checkUserVote(challengeId: string, submissionId: string)` → Checks if the current user has voted for a specific submission.

### 7.Admin Management API Calls

#### 7.1 Users Management  
- `7.1.1 fetchUsers()` → Retrieves all users.  
- `7.1.2 createUser(userData: Omit<User, "id">)` → Creates a new user.  
- `7.1.3 updateUserRole(userId: string, role: "admin" | "pro" | "basic")` → Updates a user's role.  
- `7.1.4 deleteUser(userId: string))` → Deletes a user.  

#### 7.2 Sponsor Challenges Management  
- `7.2.1 fetchSponsorChallenges()` → Retrieves all sponsor challenges.  
- `7.2.2 createSponsorChallenge(data: Omit<SponsorChallenge, "id">)` → Creates a new sponsor challenge.  
- `7.2.3 uploadBrandLogo(file: File)` → Uploads a brand logo.  
- `7.2.4 fetchBrandLogoUrl(logoId: string))` → Fetches the URL of a brand logo by ID.  
- `7.2.5 deleteSponsorChallenge(challengeId: string)` → Deletes a sponsor challenge.  

#### 7.3 Theme Management  
- `7.3.1 fetchAllThemes()` → Retrieves all themes.  
- `7.3.2 createTheme(data: Omit<Theme, "id">)` → Creates a new theme.  
- `7.3.3 updateTheme(themeId: string, data: Partial<Theme>)` → Updates an existing theme.  


## Troubleshooting & Common Issues

### 1. **API Call Failures**
   - **Issue**: Your React app is unable to make successful API requests to the Laravel backend.
   - **Possible Causes**:
     - Incorrect API URL or endpoint.
     - Missing or incorrect CSRF token.
     - Network issues or server not responding.
   - **Solutions**:
     - Ensure that the correct API URL is set in your `.env` file (`VITE_API_URL=http://localhost:8000`).
     - Verify that the backend is running and the API endpoint is correct.
     - Check the browser console for error messages related to CORS or network errors. If you see CORS errors, ensure the backend is properly configured for cross-origin requests.
     - Use the `setCsrfCookie` function to ensure the CSRF token is set before making requests.

### 2. **CSRF Token Errors**
   - **Issue**: Receiving a `403 Forbidden` or similar error due to CSRF token issues.
   - **Possible Causes**:
     - CSRF token is not properly set or retrieved from cookies.
     - The token is not included in the request headers.
   - **Solutions**:
     - Make sure to call `setCsrfCookie` on page load to set the CSRF token before making any authenticated API requests.
     - Use the `getCsrfTokenFromCookie` function to retrieve and attach the CSRF token to your requests in headers.

### 3. **Authentication Errors**
   - **Issue**: Authentication is not working, and users are unable to log in or remain logged in.
   - **Possible Causes**:
     - Authentication token is not properly stored or retrieved from `localStorage`.
     - The token is expired or invalid.
   - **Solutions**:
     - Check if the authentication token is properly stored in `localStorage` and is retrieved correctly using `getAuthToken`.
     - Ensure the backend returns a valid token and that your frontend is sending the correct token with each request.

### 4. **State Management Issues**
   - **Issue**: React components are not updating or rendering as expected.
   - **Possible Causes**:
     - Incorrect usage of `useState`, `useEffect`, or `context` leading to stale or missing state updates.
     - Props not passed correctly, or state not being updated when expected.
   - **Solutions**:
     - Ensure that state updates are done correctly in your components, particularly when interacting with APIs. Use the proper state setter function to update the component state after an API response.
     - Double-check that props passed to components are correctly set and that your components properly handle changes in state.

### 5. **UI/UX Issues**
   - **Issue**: Layout or UI components not displaying correctly.
   - **Possible Causes**:
     - CSS styles not applied correctly or conflicting styles causing issues.
     - Missing dependencies for UI libraries (e.g., Lucide icons, styled-components).
   - **Solutions**:
     - Inspect the layout and styles using browser dev tools to check for missing or conflicting CSS styles.
     - Make sure all necessary dependencies are installed and correctly imported in your project.
     - Test the app in different browsers to ensure compatibility.

### 6. **Component Errors (e.g., `FullScreenPost` or `CommentSection`)**
   - **Issue**: Components are rendering blank, throwing errors, or failing to function as expected.
   - **Possible Causes**:
     - Missing or incorrect props.
     - Errors in API calls made inside components.
   - **Solutions**:
     - Ensure that all required props are passed down to your components, especially for components like `FullScreenPost` or `CommentSection`.
     - Add error handling to API requests to prevent the UI from breaking when there’s a failed request.
     - If your component uses external data, ensure that the data is properly fetched and passed to the component before it renders.

### 7. **File Upload Issues**
   - **Issue**: Files (e.g., images or submissions) are not uploading correctly to the backend.
   - **Possible Causes**:
     - Incorrect API endpoint for file uploads.
     - Missing or incorrect headers in the file upload request.
   - **Solutions**:
     - Double-check the file upload endpoint and ensure it matches the Laravel backend configuration.
     - Verify that the correct `Content-Type` and other necessary headers are set in the request when uploading files.
     - Ensure that the backend properly handles the file upload and returns the correct response.

### 8. **Authentication with Sanctum**
   - **Issue**: The application is not maintaining the authenticated state across page reloads or after logging out.
   - **Possible Causes**:
     - Auth token is not stored or cleared correctly in `localStorage` or cookies.
     - Backend session or token handling issues.
   - **Solutions**:
     - Ensure that after logging in, the authentication token is saved in `localStorage` and correctly retrieved during subsequent API calls.
     - When logging out, make sure to remove the token from `localStorage` to prevent unauthorized access.

---

If you encounter issues not covered above, try checking the browser console for any errors and review network requests to identify potential problems. If the issue persists, feel free to seek assistance from the development team or open an issue on the repository.

## Contribution

This is a study project created for learning purposes. It is not intended for live deployment and is running only on a local host. Contributions are not expected at this time, but feel free to fork the project if you'd like to explore or experiment with the code.

## License

This project is a study project and is not licensed for public use. All rights reserved. Please do not use or distribute the code for commercial purposes.

## Contact & Support

If you have any questions or need support, you can reach out through the following channels:

- **Email**: [caramelevaa@gmail.com](mailto:caramelevaa@gmail.com)
- **GitHub**: [https://github.com/aNastjaa](https://github.com/aNastjaa)

 I'm happy to assist you!

