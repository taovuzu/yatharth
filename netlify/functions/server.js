// Located at: /netlify/functions/server.js

// Import necessary packages
import express from 'express';
import serverless from 'serverless-http';
import fetch from 'node-fetch';

// --- Main App Logic ---
const app = express();
const router = express.Router(); // Use an Express router

// Get the Gemini API Key from Netlify's environment variables
const { GEMINI_API_KEY } = process.env;

// Middleware to parse incoming JSON from the frontend
app.use(express.json());

// --- API Route ---
// This is the endpoint the frontend will call: /api/convert
router.post('/convert', async (req, res) => {
    // Check if the API key is configured on the server
    if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not configured on the server.');
        return res.status(500).json({ message: 'Server configuration error: API key is missing.' });
    }

    try {
        // Get the C++ code from the request body
        const { cppCode } = req.body;
        if (!cppCode) {
            return res.status(400).json({ message: 'No C++ code was provided in the request.' });
        }

        // --- Gemini API Call Logic (from your provided code) ---
        const prompt = `As an expert JavaScript educator dedicated to making users proficient for technical interviews, perform the following tasks:

1.  Translate the C++ code below into modern, idiomatic ES6+ JavaScript. The translated code MUST NOT contain any comments.
2.  Create a mini-lesson on some interview related node js or javascript topic and selected completely random topic designed for interview preparation.

**Response Structure:**
Your entire response must be a single JSON object with three keys: "javascriptCode", "interviewQuestion", and "interviewAnswer". The JSON object itself must be a single line of text.

**Content Formatting Rules:**
- The content for "interviewQuestion" and "interviewAnswer" should be valid Markdown.
- All special characters within the JSON string values, such as newlines, MUST be properly escaped (e.g., a newline becomes \\n).
- All JavaScript code snippets in the lesson MUST be in Markdown code blocks (\`\`\`javascript ... \`\`\`).

C++ Code:
\`\`\`cpp
${cppCode}
\`\`\`
`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error('Gemini API Error:', errorBody);
            throw new Error(`Gemini API request failed with status ${apiResponse.status}`);
        }

        const result = await apiResponse.json();
        const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error('Received an invalid or empty response from the Gemini API.');
        }

        // Send the successful response back to the frontend
        res.status(200).json(JSON.parse(responseText));

    } catch (error) {
        // This catch block ensures the server doesn't crash
        console.error('Error in /api/convert endpoint:', error);
        res.status(500).json({ message: 'An internal server error occurred during conversion.' });
    }
});

// --- Netlify Configuration ---
// Mount the router on the path Netlify uses for functions
app.use('/.netlify/functions/server', router);

// Export the handler for Netlify to use
export const handler = serverless(app);
