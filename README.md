# 📰 Personalized News Aggregator RESTful API

## 💡 Overview

This project is a robust, personalized news aggregation service built using **Node.js**, **Express.js**, and **MongoDB**. It features secure **JWT-based authentication**, allows users to manage their news preferences, and integrates with external news providers (e.g., NewsAPI.ai) to deliver tailored content. A caching layer is implemented to manage external API usage limits and improve response times.

---

## 🚀 Features

### Core Functionality
* **Secure Authentication:** User registration and login protected by **bcrypt** password hashing and **JWT (JSON Web Tokens)**.
* **API Versioning:** All endpoints are versioned under `/api/v1`.
* **User Preferences:** Users can save their preferred categories and sources (e.g., `technology`, `business`).
* **Personalized News Feed:** Fetches news from an external API, filtered specifically by the authenticated user's saved preferences.
* **Caching Strategy:** Implements an **in-memory cache** to minimize repeated external API calls and respect rate limits.

---

## 🛠️ Technology Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via **Mongoose** ODM)
* **Security:** `bcryptjs` (Password Hashing), `jsonwebtoken` (JWTs)
* **External Integration:** `axios` (HTTP client), NewsAPI.ai
* **Utilities:** `dotenv` (Environment Variables)

---

## 📦 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB (Local instance or Atlas connection string)
* External API Key (NewsAPI.ai, GNews, etc.)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd news-aggregator-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create `.env` file:**
    Create a file named **`.env`** in the project root and populate it with your environment variables:
    ```
    # Server Configuration
    PORT=3000
    
    # MongoDB Connection (Replace with your URI)
    MONGODB_URI="YOUR ATLAS URL"
    
    # Security Secrets
    JWT_SECRET="YOUR_VERY_STRONG_JWT_SECRET_KEY"
    
    # External News API Configuration
    NEWSAPI_AI_KEY="YOUR_API_KEY_HERE"
    NEWSAPI_AI_BASE_URL="[https://newsapi.ai/api/v1/article/](https://newsapi.ai/api/v1/article/)"
    ```

4.  **Run the application:**
    ```bash
    # For development (if using nodemon)
    npm run dev 
    
    # Or, for production
    node index.js
    ```
    The server will start on `http://localhost:3000`.

---

## 🗺️ API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Create a new user account (returns JWT). | Public |
| `POST` | `/auth/login` | Authenticate using email and password, receive a JWT token. | Public |

### User Preferences (Requires JWT)

| Method | Endpoint | Description | Body Example |
| :--- | :--- | :--- | :--- |
| `GET` | `/user/preferences` | Retrieve current user preferences. | None |
| `PUT` | `/user/preferences` | Update categories and sources. | `{"category": "tech", lang: ["eng"]}` |

### News & Tracking (Requires JWT)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/news` | **Fetch personalized news feed.** Filters by user preferences. |
| `POST` | `/news/:articleUri` | Fetch a specific article |

---

## 📝 Testing with Postman

To test **protected routes**, you must include the **JWT token** received from the login or registration response in the request header:

| Header Key | Header Value |
| :--- | :--- |
| `Authorization` | `Bearer [YOUR_JWT_TOKEN]` |

---

## 🤝 Contribution

Feel free to submit issues or pull requests to improve this project.