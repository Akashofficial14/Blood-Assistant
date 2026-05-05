# Blood Assistant 🩸

Blood Assistant is a full-stack web application designed to connect blood donors, recipients, and blood banks in real time. The platform aims to reduce the delay in finding blood during emergencies by providing instant access to donors and blood bank availability.

---

## Overview

Blood Assistant provides a centralized system where users can:

* Register as blood donors
* Request blood during emergencies
* Find nearby blood banks
* Check real-time availability of blood units
* Interact with an intelligent chatbot for guidance

The system focuses on accessibility, speed, and reliability to ensure that users can get help when it matters the most.

---

## Key Features

### User Management

* User registration and login
* Role-based access (User, Hospital, Blood Bank)
* Secure authentication using tokens
* Profile management and updates

### Blood Donation System

* Register as a donor with details (blood group, availability, location)
* Toggle availability status
* Donor discovery by recipients and hospitals

### Blood Request System

* Request blood with urgency levels
* Provide patient and hospital details
* Match requests with nearby donors

### Blood Bank Locator

* Find nearby blood banks using location
* View contact details and available blood types
* Real-time availability updates

### Emergency Support

* Emergency request system without login
* Instant alerts to nearby donors and blood banks
* Priority handling for critical cases

### AI Chatbot (RAG-Based)

* Context-aware chatbot integrated into the platform
* Answers queries related to platform usage
* Guides users step-by-step (login, donation, request process)
* Uses Retrieval-Augmented Generation (RAG) approach:

  * Retrieves relevant data from a custom knowledge base
  * Generates responses using an LLM
* Supports predefined questions and natural language queries

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios for API communication

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI Integration

* Gemini API (LLM)
* Custom RAG pipeline using keyword-based retrieval

---

## System Architecture

The application follows a modular full-stack architecture:

### Client (Frontend)

* Handles UI and user interactions
* Includes chatbot interface and dashboards

### Server (Backend)

* Handles API requests
* Implements authentication and business logic
* Manages RAG pipeline for chatbot

### Database

* Stores user data, donor details, requests, and system data

---

## RAG Chatbot Flow

The chatbot follows a structured pipeline:

1. User sends a query
2. Query is processed and matched against the knowledge base
3. Relevant documents are retrieved
4. Context is constructed from retrieved data
5. Context + query is sent to the LLM
6. Final response is generated and returned

This ensures accurate, context-aware, and reliable responses.

---

## Project Structure

```
frontend/
  ├── components/
  ├── pages/
  ├── api/
  └── config/

backend/
  ├── controllers/
  ├── routes/
  ├── models/
  ├── config/
  ├── utills/
  └── app.js
```

---

## Installation & Setup

### Prerequisites

* Node.js installed
* MongoDB running locally or via cloud
* API key for LLM (Gemini)

---

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd blood-assistant
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=3000
MONGO_URI=your_mongodb_connection
GEMINI_API_KEY=your_api_key
JWT_SECRET=your_secret
```

Run backend:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

---

## API Endpoints (Basic)

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/profile`

### Blood

* POST `/api/blood/request`
* GET `/api/blood/availability`

### Chatbot

* POST `/api/chat`

---

## User Profile

* View personal details
* Edit profile information
* Update password
* Manage donor availability

---

## Design Principles

* Clean and minimal UI
* Consistent red-white theme
* Responsive across devices
* Accessibility-focused

---

## Future Improvements

* Vector database integration for advanced RAG
* Embeddings-based semantic search
* Real-time notifications
* Chat history persistence
* Advanced analytics dashboard
* Mobile application support

---

## Learning Outcomes

* Practical implementation of RAG systems
* Building full-stack applications with AI integration
* Designing scalable backend systems
* Managing state and API communication in React
* Creating user-centric UI/UX

---

## Contribution

Contributions are welcome. You can:

* Report issues
* Suggest improvements
* Submit pull requests

---

## License

This project is for educational and development purposes.

---

## Conclusion

Blood Assistant 🩸 is a step towards leveraging technology to solve real-world problems in healthcare. By combining real-time data, user interaction, and AI assistance, the platform aims to make blood accessibility faster and more reliable.
