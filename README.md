<div align="center">

<h1>🚀 Yatharth: JS Interview Code Converter 🚀</h1>
<p>
<strong>A dynamic learning environment to transform your JavaScript interview preparation from a chore into an adventure.</strong>
</p>
<p>
This tool goes beyond simple translation. It converts your C++ code into modern JavaScript and then leverages the Gemini AI to generate a unique, in-depth mini-lesson on a random, high-value interview topic.
</p>
</div>

🎯 What is This?
Yatharth is an interactive tool built for personal growth and as a demonstration of modern AI capabilities. It was created to solve a common problem: understanding the why behind the code, not just the what. Each time you convert a snippet, you're not just getting a translation; you're getting a targeted lesson on a crucial concept you're likely to face in a real-world interview.

✨ Core Features
🤖 AI-Powered Learning Modules: Every conversion comes with a complete, AI-generated lesson on a critical JS topic.

🧠 Massive, Randomized Question Bank: With over 100 specific interview tasks, from core concepts like closures to advanced data structures, you'll get a new, unique question almost every time.

💻 C++ to JavaScript Conversion: Instantly translate C++ code into clean, idiomatic, and modern ES6+ JavaScript.

🔒 Secure by Design: A client-server architecture ensures your API keys remain safe and are never exposed in the browser.

🎨 Clean & Focused UI: A distraction-free, stacked layout that guides you through a simple workflow: paste C++, convert, and learn.

🛠️ Tech Stack & Architecture
This project uses a modern, straightforward stack designed for security and performance.

Category

Technology

Purpose

Frontend

HTML5, Tailwind CSS, JavaScript (ES6+)

Building the user interface and client-side logic.

Syntax

highlight.js, marked.js

Rendering beautiful code blocks and Markdown lessons.

Backend

Node.js, Express.js

Creating a simple, robust API server.

API Calls

node-fetch

Communicating with the Gemini API from the server.

AI Engine

Google Gemini API

Powering code translation and lesson generation.

Architectural Flow
The application is designed to protect your API key:

Client (Browser): You paste C++ code into the UI. The browser sends only this code to the backend.

Server (Node.js): The server receives the code. It securely accesses your GEMINI_API_KEY from its environment, constructs a prompt, and calls the Gemini API.

Response: The server gets the JSON response from Gemini and forwards it back to the client, which then beautifully renders the result.

⚙️ Local Setup and Installation Guide
Follow these steps to get the project running on your local machine.

1. Prerequisites
You must have Node.js installed.

2. Folder Structure
Create the following folder structure for your project:

/yatharth-converter/
├── public/
│   └── index.html
└── server.js

Place the index.html file inside the public folder.

Place the server.js file in the root yatharth-converter folder.

3. Install Dependencies
Open your terminal, navigate into the yatharth-converter folder, and run these commands:

# Initialize a Node.js project (creates package.json)
npm init -y

# Install the required packages for the server
npm install express node-fetch

4. Set Your API Key (Crucial Step!)
Your Gemini API key must be set as an environment variable. Never hard-code it.

In your terminal (while in the yatharth-converter folder), run the command for your OS:

Mac/Linux:

export GEMINI_API_KEY="YOUR_API_KEY_HERE"

Windows (Command Prompt):

set GEMINI_API_KEY="YOUR_API_KEY_HERE"

Windows (PowerShell):

$env:GEMINI_API_KEY="YOUR_API_KEY_HERE"

Note: This variable is temporary and only lasts for your current terminal session. You'll need to set it again if you close and reopen your terminal.

5. Run the Server
You're ready to go! Start the backend server with:

node server.js

You should see a confirmation message: Server is running successfully on http://localhost:3000.

6. View Your Application
Open your favorite web browser and navigate to http://localhost:3000.

💖 The Vibe: 100% AI-Coded
This project stands as a testament to the power of human-AI collaboration. It was entirely "vibe coded"—conceived by a human and brought to life, line by line, through a conversational development process with Google's Gemini AI.

Every feature, bug fix, and UI enhancement was the result of a prompt. This showcases a modern way of building software: not by writing every function manually, but by clearly defining a vision and guiding an AI to realize it. The goal isn't just to build a tool, but to explore the future of software development itself.

Happy coding, and may your next interview be a success!