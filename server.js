// Import necessary packages
import express from 'express';
import fetch from 'node-fetch';
import dotenv from "dotenv";

// --- Configuration ---
dotenv.config({
  path: './.env'
});
const app = express();
const PORT = process.env.PORT || 3000;
// IMPORTANT: Your API key must be stored as an environment variable, not in the code.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- Middleware ---
// This allows the server to understand incoming JSON data from the frontend
app.use(express.json());
// This serves the frontend files (e.g., your index.html) from a 'public' folder
app.use(express.static('public'));

// --- API Route ---
// This is the endpoint the frontend will call
app.post('/api/convert', async (req, res) => {
  // Check if the API key is configured on the server
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not configured on the server.');
    return res.status(500).json({ message: 'Server configuration error: API key is missing.' });
  }

  try {
    const { cppCode } = req.body;
    if (!cppCode) {
      return res.status(400).json({ message: 'No C++ code was provided in the request.' });
    }

    // --- Gemini API Call Logic ---
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

    // Send the successful response (which is already a JSON string) back to the frontend
    res.status(200).json(JSON.parse(responseText));

  } catch (error) {
    // This catch block ensures the server doesn't crash and provides a helpful error.
    console.error('Error in /api/convert endpoint:', error);
    res.status(500).json({ message: 'An internal server error occurred during conversion.' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});
