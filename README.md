# Travel-Collab

## Introduction
**Travel-Collab** is a web application that allows multiple users to `collaboratively plan` and edit their travel itineraries.<br>
It integrates Google Maps for `intuitive route visualization` and OpenAI as a `smart trip assistant`, enabling a more personalized and efficient planning experience.

**✓ Get started with [Travel-Collab](http://travel-collab.ap-northeast-1.elasticbeanstalk.com)**

## Test Accounts
* Account 1 (admin) : root
  ```
  email: root@example.com
  password: 1234
  ```
* Account 2 : user1
  ```
  email: user1@example.com
  password: 1111
  ```

## System Architecture
- **Application Server**  
   Runs Express.js (Node.js) on AWS EC2, managed by Elastic Beanstalk
- **Database** 
   - **MySQL (AWS RDS):** Main relational database, accessed via Sequelize ORM
   - **Redis**  
  Used for two main purposes:  
      1. **Chat context storage**: Temporarily stores each user's recent conversation history (1 hour) to support context-aware replies from the AI assistant, while reducing OpenAI API token usage
      2. **Idempotency key caching**: Prevents duplicate processing of API requests by caching idempotency keys for 5 minutes
   - **SQLite:** Used as a lightweight file-based database for CI/CD (GitHub Actions) testing to ensure isolated and repeatable test cases
- **Storage**  
   - **AWS S3:** Uploads images to AWS S3
- **External API**   
   - **Google Maps API**: Supports geocoding (address-to-coordinates) and route visualization
   - **OpenAI API**: Supports an AI-based trip assistant that provides destination suggestions
<div>
<img width="90%" alt="System Architecture" src="/public/images/system-architecture-v2.svg"/>
</div>

## Features
### Co-editing
* Search users by share ID
* Add users as co-editors
* Remove users from co-editors

### AI smart assistant
* Chat with an AI assistant to get travel suggestions
* Conversation history will be stored in Redis for 1 hour to enable context-aware replies

### Itinerary
* Overview personal and shared trips
* CRUD operations on trips and destinations (create / read / update / delete)
* Convert destination address to latitude and longitude
* Calculate travel duration between destinations
* Display travel routes on Google Maps
* Add and delete comments on each destination

### User account
* Sign up, sign in, and log out
* Edit personal profile details (name / avatar / Share ID)

## Demo
### 1. User authentication 
   * Sign up, sign in, and log out
<video src="https://github.com/user-attachments/assets/b80a417f-09b2-4592-8490-2d44de3f0b1d" controls width="700"></video>

### 2. Trip and destination management
   * Perform CRUD operations on trips and destinations
   * Upload images to AWS S3
   * Automatically geocode destination addresses using the Google Geocoding API
<video src="https://github.com/user-attachments/assets/63eaf58c-2691-4cb2-b48e-16c27f11a815" controls width="700"></video>

### 3. Itinerary visualization
   * Display itinerary routes and calculate travel duration with Google Maps API
   * Allow users to toggle Google Maps visibility
<video src="https://github.com/user-attachments/assets/b372df7b-8b77-4312-b983-0b445476c8f2" controls width="700"></video>

### 4. Chat with AI smart assistant
   * Interact with an AI travel assistant powered by the OpenAI API to receive personalized travel suggestions
   * Conversation history will be temporarily stored in Redis (1 hour) to enable context-aware replies while optimizing API token usage
<video src="https://github.com/user-attachments/assets/54e200d8-3941-4ad8-a7a3-aa737121b172" controls width="700"></video>

### 5. Co-editing
   * Add, remove, and search for co-editors
<video src="https://github.com/user-attachments/assets/2ce065ce-6f11-436e-a650-05fc3a11f199" controls width="700"></video>

### 6. Concurrency control
   * Implement optimistic locking to prevent data conflicts
   * Display an error message when a concurrency conflict occurs
<video src="https://github.com/user-attachments/assets/eb4f6653-12f0-4f78-b5cf-4fc80ef4b4fb" controls width="700"></video>

### 7. Commenting feature
   * Enable users to discuss and share feedback on destinations
<video src="https://github.com/user-attachments/assets/937db808-6137-42ed-9514-a7295c77d168" controls width="700"></video>

## Quick start with Docker
### Prerequisites
- Ensure you have [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/) installed.

### Steps
1. Clone the repository
```
git clone https://github.com/Edwinaeded/travel-collab.git 
```
2. Navigate to the project directory
```
cd travel-collab
```
3. Set up environment variables in a `.env` file (see `.env.example` for reference)

4. Start the application using Docker
```
docker-compose up --build
```
5. Run database migrations and seed data
```
docker-compose exec app npx sequelize db:migrate
docker-compose exec app npx sequelize db:seed:all
```
6. Access the application at http://localhost:3000

## Installation
### Prerequisites
- Ensure you have **Node.js (v18.15.0)** and **npm** installed.
- Ensure you have **Redis** installed and running. 

### Steps
1. Clone the repository
```
git clone https://github.com/Edwinaeded/travel-collab.git 
```
2. Navigate to the project directory
```
cd travel-collab
```
3. Install dependencies
```
npm install
```
4. Set up environment variables in a `.env` file (see `.env.example` for reference)

5. Create database  
   Ensure your database server (e.g., MySQL) is running, then create a new database.  
   If using Sequelize, you can run:
```
npx sequelize db:create
``` 

6. Run migrations to set up the database schema
```
npx sequelize db:migrate
```
7. (Optional) Seed database
```
npx sequelize db:seed:all
```
8. Make sure Redis server is running
```
redis-server
```
9. Start the development server
```
npm run dev
```
10. Access the application at http://localhost:3000