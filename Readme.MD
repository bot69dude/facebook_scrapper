# Facebook Scraper API

## Overview

The Facebook Scraper API allows you to scrape public Facebook page data, including page details (like name, profile picture, followers, etc.) and recent posts. The API offers various filtering capabilities based on follower count, category, and name, along with features to fetch followers and posts associated with specific Facebook pages.

## Features

- Scrape public Facebook pages by username.
- Fetch page details including name, profile picture, followers count, likes, etc.
- Retrieve recent posts from a page.
- Retrieve a list of followers for a specific page.
- Filter pages based on minimum and maximum follower counts, category, and page name.

## Prerequisites

Ensure you have the following installed or configured:

- **Node.js** (version 14 or higher is recommended).
- **MongoDB** (local or remote MongoDB URI).
- **Cloudinary** account for image management.
- **Redis** instance for caching purposes.
- **Facebook Account** for scraping Facebook pages.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/bot69dude/facebook_scrapper.git
cd facebook-scraper-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a .env file in the root directory with the following environment variables:

```bash
PORT=5000
MONGODB_URI="mongodb+srv://your_mongodb_connection_string"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
REDIS_URL="your_redis_url"
FACEBOOK_EMAIL="your_facebook_email"
FACEBOOK_PASSWORD="your_facebook_password"
```

### 4. Start the API

```bash
npm start
```
Your server will run on `http://localhost:5000`.