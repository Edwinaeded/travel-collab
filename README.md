# Travel-Collab

## Introduction
**Travel-Collab** is a web application that allows multiple users to `collaboratively plan` and edit their travel itineraries. It integrates Google Maps to `visualize travel routes`, making trip planning easier and more intuitive.

**✓ Get started with [Travel-Collab](http://travel-collab.ap-northeast-1.elasticbeanstalk.com)**

## Test Accounts
* Account 1 : root
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
* Application server : Runs Express.js (Node.js) on AWS EC2, managed by Elastic Beanstalk
* Database : Uses Sequelize ORM to operate MySQL database on AWS RDS
* Storage : Uploads images in AWS S3
* External API : Uses Google Maps API for geocoding and route planning
<div>
<img width="90%" alt="System Architecture" src="/public/images/system architecture.svg"/>
</div>

## Features
### Co-editing
* Search users by share ID
* Add users as co-editors
* Remove users from co-editors

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


## Installation
### Prerequisites
- Ensure you have **Node.js (v18.15.0)** and **npm** installed.

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

5. Run database migration
```
npx sequelize db:migration
```
6. (Optional) Seed database
```
npx sequelize db:seed:all
```
7. Start the development server
```
npm run dev
```
8. Access the application at http://localhost:3000