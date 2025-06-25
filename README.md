# SUP: A Tutor Service Web Application
[![sup_logo_2](https://github.com/user-attachments/assets/0e23d986-37df-40be-bae4-e3c2f41e6d21)](https://supfrn.vercel.app/)

This repository contains the source code and documentation for SUP, a client-server web application designed to connect tutors and students within a high school environment. While developed for a specific gymnasium, the platform is built with scalability in mind and can be adapted for use in other educational institutions, including universities.

SUP is available [here](https://supfrn.vercel.app/).

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Database Architecture](#database-architecture)
- [Application Structure](#application-structure)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Future Plans](#future-plans)
- [Author](#author)
- [License](#License)

## Project Overview
<img width="1680" alt="sup_landing" src="https://github.com/user-attachments/assets/64ce40f2-d791-4b64-bddb-9c862007cf31" />

The primary goal of SUP is to provide a convenient and efficient platform for communication between student tutors and students needing academic assistance. This addresses the long-standing challenge of informal tutor groups lacking a centralized communication system, which often hindered their effectiveness. The application aims to streamline the process of requesting and offering help, making tutoring more accessible and impactful.

## Features

The SUP application includes the following key functionalities:

-   **Multi-language Support:** Available in both Russian and English.
-   **Theme Options:** Supports light and dark UI themes.
-   **Cross-platform Compatibility:** Fully responsive and accessible on all browsers, operating systems, and device sizes (desktop, tablet, smartphone).
-   **User Roles:** Two levels of user access: regular user and moderator.
-   **User Authentication:** Secure user authentication process.
-   **Post Management:** Users can publish, modify, and delete posts requesting or offering help.
-   **Post Viewing and Interaction:** View posts from other users, including a list of all responses to a post.
-   **Responding to Posts:** Ability to respond to other users' posts.
-   **Tutor Selection:** Post owners can select a tutor from the list of users who have responded to their post.
-   **Search Functionality:** Search for posts by title and subject.
-   **User Search:** Search for users by name and class.
-   **Profile Management:** View personal and other user profiles, including mutual responses to posts. Ability to edit personal information (phone number, name, class, etc.).
-   **Reporting and Blocking:** Functionality to report and block user accounts violating application rules.

## Technical Stack

The application is built using a modern JavaScript-centric stack to ensure performance, reliability, and ease of development:

-   **Frontend:** React (for building single-page applications and user interfaces).
-   **Backend:** Node.js (as the server-side runtime environment) with Express.js (for routing and middleware).
-   **Database:** MongoDB (NoSQL database, chosen for its flexibility in handling varied document structures).
-   **Vercel:** Hosted on Vercel.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)


## Database Architecture

The database is designed to be efficient and flexible, leveraging MongoDB's NoSQL capabilities. It is organized into collections, with each collection containing individual documents that can have varying fields and data types.

The core collections and their fields are:

### User
-   `id`: String (Unique identifier for the user)
-   `pfp`: String (Path to profile picture)
-   `name`: String
-   `surname`: String
-   `grade`: String
-   `bio`: String (User's biography)
-   `email`: String (Unique email for login)
-   `password`: String (Hashed password)
-   `phone`: String
-   `verified`: Boolean (Indicates if user is verified)
-   `banned`: String (Timestamp or 'false'/'forever' for ban status)
-   `moderator`: Boolean (Indicates if user has moderator privileges)
-   `accessLevel`: Number
-   `role`: String (e.g., 'student', 'teacher')
-   `subjectsNeedHelp`: Array of Strings
-   `subjectsCanHelp`: Array of Strings
-   `postsUserRespondedTo`: Array (References to posts the user has responded to)
-   `usersRespondedToUser`: Array (References to users who responded to this user's posts)

### Post
-   `id`: String (Unique identifier for the post)
-   `userId`: String (ID of the user who created the post)
-   `title`: String
-   `description`: String
-   `deadline`: String (Date of deadline)
-   `subjects`: Array of Strings
-   `status`: String (e.g., 'pending', 'in_progress', 'completed')

### Report
-   `id`: String (Unique identifier for the report)
-   `userId`: String (ID of the user who filed the report)
-   `targetType`: String ('user' or 'post')
-   `targetId`: String (ID of the user or post being reported)
-   `status`: String (e.g., 'pending', 'dismissed')

### Session
-   `genid`: Function
-   `name`: String
-   `secret`: String
-   `resave`: Boolean
-   `saveUninitialized`: Boolean
-   `rolling`: Boolean
-   `store`: Boolean
-   `cookie`: Object

## Application Structure

The application follows a client-server architecture.

-   **Frontend (Client):** Developed using React, it provides a single-page application experience. It includes a reusable page template with common components (like the menu) and dynamically adjusts content based on screen size, ensuring cross-platform compatibility and multi-language support. Key pages include:
    -   Landing Page
    -   Sign In / Sign Up
    -   Authorization
    -   User Preferences
    -   Work Page (for viewing/creating posts)
    -   Edit Post
    -   View Post
    -   Users Page (for browsing other users)
    -   View User Profile
    -   User Jobs (user's posts and responses)
    -   Moderation Page

-   **Backend (Server):** Built with Node.js and Express.js, it handles all business logic and API requests from the frontend. This includes user authentication, data management (posts, users, reports), and session handling.

## Installation and Setup

To set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd sup-project
    ```
2.  **Install dependencies:**
    Navigate to both the client and server directories and install the necessary packages.
    ```bash
    # In the server directory (e.g., `server/`)
    npm install

    # In the client directory (e.g., `client/`)
    npm install
    ```
3.  **Configure environment variables:**
    Create a `.env` file in the server directory and add the following:
    ```
    DB_URI=your_mongodb_connection_string
    SESSION_NAME=your_session_name
    SESSION_SECRET=your_session_secret_key
    POSTS_PER_PAGE=10
    PORT=3001 # Or any preferred port
    ```
    Replace `your_mongodb_connection_string`, `your_session_name`, and `your_session_secret_key` with your actual values.

4.  **Start the development servers:**
    ```bash
    # In the server directory
    npm start

    # In the client directory (usually 'npm start' for React apps)
    npm start
    ```

The application should now be accessible in your browser, typically at `http://localhost:3000` for the client and `http://localhost:3001` for the server.

## Usage

-   **Registration and Login:** New users can sign up and create an account.
-   **Profile Setup:** Users can fill in their profile details, including subjects they need help with and subjects they can help with.
-   **Creating Posts:** Verified users can create new posts, specifying a title, description, deadline, and relevant subjects.
-   **Browsing Posts:** Users can view existing posts, filter them by subject, and search by title.
-   **Responding to Posts:** Students can respond to posts where they can offer help, and tutors can accept or decline these responses.
-   **User Profiles:** View detailed profiles of other users, including their contact information if a mutual "help" relationship is established.
-   **Moderation:** Moderators have additional privileges to verify users, manage reports, and ban users.

## Future Plans

Planned updates for the SUP application include:

-   Implementation of new features based on user feedback.
-   Further optimization for improved performance and responsiveness.
-   Ongoing bug fixes and maintenance.

## Author

-   Timofei Polivanov

## License

[SUP](https://github.com/plomitt/SUP) © 2022 by [Timofei Polivanov](https://github.com/plomitt) is licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).

[![CC](https://mirrors.creativecommons.org/presskit/icons/cc.svg)](https://creativecommons.org/)
[![BY](https://mirrors.creativecommons.org/presskit/icons/by.svg)](https://creativecommons.org/licenses/by/4.0/)
[![NC](https://mirrors.creativecommons.org/presskit/icons/nc.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
[![ND](https://mirrors.creativecommons.org/presskit/icons/nd.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
