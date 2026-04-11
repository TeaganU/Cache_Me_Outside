COSC360 - Project Proposal
Owen Strolle - 68489996, Teagan Urquhart - 21161880

## Quick Start

### 1. Install Dependencies:

Install packages for the root, client, and server:

```bash
npm install
```

This command:

- Installs root-level dependencies
- Installs dependencies in `client/` folder
- Installs dependencies in `server/` folder

### 2. Start the Server

From the root directory:

```bash
npm start
```

## Docker

### Docker Services

- mongo for the database
- server for the Express API
- client for the Vite frontend

### Start With Docker

Make sure you are in the root directory   

```
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000 (not much going on here)

### Stop Docker

```
docker compose down -v
```

## Project Proposal

Duties of each team member:
Owen Strolle - will work on the frontend of the website, such as html layout and the style using CSS. This will include all the pages on the website, including the admin dashboard.
Teagan Urquhart - will work on the backend of the website, such as setting up the database, ensuring proper security of data, handling navigation errors, and analytics.

Project description:
For our project, we chose option one, which was the community skill sharing platform. Outdoor sports require a multitude of unique skills necessary for staying safe and these skills can be challenging to acquire. Our website will allow users to connect with each other to share skills and expand their knowledge on a variety of outdoor skills, such as climbing, mountaineering, skiing, and much more. This skill sharing could be a message to answer a simple question or an in person adventure with other users, creating a strong community of like minded people.

Requirements:

The site will have three kinds of users:

Unregistered users, which are only able to explore community questions and their correlated answers, see user profiles, and browse the website using a search bar.

Registered users, which can create listings, have a username/password/profile picture, sign up for sessions, message other users, and comment on listings.

Admin users, which have access to an analytics dashboard for users, are able to monitor the activities of users on the site, and can provide punishment for users who do not follow the site rules.

Non-users should be able to browse the site

Non-users should be able to search items on the site

Users should be able to interact with all threads/items

Users should be able to stay logged in throughout site navigation

Users should be able to create a post with a question

Users should be able to respond to a question post with an answer

Users should be able to message each other privately through the messaging section of the site

Users should be able to create an account, or log into an existing account

Users should be able to view and edit their user profile

Users should be able to view other users’ profiles

Users should be able to see updates to the page in real-time without having to refresh

Users should be able to see hot/trending items

Users should be able to filter posts by date and type

Users should be able to report posts and replies if they break community guidelines

Users should be able to leave a review for other users after a training session

Users should be able to view the reviews of another user on that user’s profile

Admins should be able to search for user using the user id, the user’s email, or one of the user’s posts

Admins should be able to disable and re-enable user’s accounts

Admins should be able to edit or remove posts if they do not follow the community guidelines

The site will have a search bar allowing users to browse the site using keywords

The site will have a navigation tab that allows users to browse specific categories of content, such skill categories, posts, and user profiles

The site will have discussion threads for users to comment on various topics, with threads path indicated at the top

The site should work in all browsers with responsive layouts for mobile devices


Link to our proposed design on Figma:
https://www.figma.com/design/lSrssBYxDJEZIBw0CfxiZZ/Client-Side-Experience?node-id=15-304&t=Z4DyMs10LKGvURjp-1

