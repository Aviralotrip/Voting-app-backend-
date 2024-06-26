# Voting System API

The Voting System API is a Node.js application that facilitates voting operations with user authentication and candidate management capabilities. This project utilizes Express.js for routing, MongoDB for data storage, and JWT for authentication tokens.

## Features

- **User Management:**
  - **Signup:** Register new users with Aadhar card validation.
  - **Login:** Authenticate users and generate JWT tokens.
  - **Profile:** View and update user profiles, including password changes.

- **Candidate Management:**
  - **List Candidates:** Retrieve all candidates.
  - **Add Candidate:** Admin-only route to add new candidates.
  - **Update Candidate:** Modify existing candidate information.

- **Voting Operations:**
  - **Vote for Candidate:** Allow users to cast votes for candidates.
  - **Vote Count:** Track and display total votes received by each candidate.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Candidate Routes](#candidate-routes)
- [Models](#models)
- [Testing](#testing)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)

## Prerequisites

Ensure you have the following installed:

- Node.js
- MongoDB
- npm or yarn

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/voting-system.git
   cd voting-system
