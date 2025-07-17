// Located at: /netlify/functions/server.js

import express from 'express';
import serverless from 'serverless-http';
import fetch from 'node-fetch';

// --- Main App Logic ---
const app = express();
// Create a router that will handle all requests to /api
const router = express.Router();

const { GEMINI_API_KEY } = process.env;

app.use(express.json());

// --- API Route ---
// This route now correctly listens for POST requests to the path /convert
// The full path will be /api/convert because of how the router is mounted below.
router.post('/convert', async (req, res) => {
    if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not configured on the server.');
        return res.status(500).json({ message: 'Server configuration error: API key is missing.' });
    }

    try {
        const { cppCode } = req.body;
        if (!cppCode) {
            return res.status(400).json({ message: 'No C++ code was provided in the request.' });
        }

        const interviewTopics = [
            // --- JavaScript Core & Advanced ---
            "The modern mode, \"use strict\"",
            "Logical operators and short-circuiting",
            "Nullish coalescing operator '??' vs. Logical OR '||'",
            "Functions, Function Expressions, and Arrow Functions",
            "Object references: shallow vs. deep copying",
            "Garbage collection and memory management in V8",
            "The 'this' keyword: all 5 binding rules",
            "Constructor functions and the 'new' keyword",
            "Optional chaining '?.' and its use cases",
            "Symbol type: purpose and implementation",
            "Object to primitive conversion rules",
            "Advanced Array methods: map, filter, reduce, some, every",
            "Iterables and Iterators: creating your own",
            "Map vs. Object: when to use each",
            "WeakMap and WeakSet: use cases for memory management",
            "Destructuring assignment: advanced patterns",
            "Recursion, the call stack, and tail call optimization",
            "Rest parameters vs. spread syntax",
            "Variable scope, closure, and the lexical environment",
            "The 'var' keyword, function scope, and hoisting",
            "The global object in browsers vs. Node.js",
            "call/apply/bind: explicit function binding",
            "Currying and partial application",
            "Property flags and descriptors (Object.defineProperty)",
            "Prototypal inheritance and the prototype chain",
            "Classes: syntax, inheritance, static/private members",
            "Mixins for class composition",
            "Class checking: 'instanceof' vs. other methods",
            "Error handling: try/catch/finally and custom errors",
            "Callbacks and the problem of 'Callback Hell'",
            "Promises: chaining, error handling, and Promise.all()/race()/any()/allSettled()",
            "Promisification: converting callback APIs to Promises",
            "The Event Loop: macrotasks, microtasks, and rendering",
            "async/await: syntax, error handling, and comparison to promises",
            "Generators and their role in async operations",
            "Modules: ESM (import/export) vs. CJS (require/module.exports)",
            "Dynamic imports for code splitting",
            "Proxy and Reflect APIs for metaprogramming",
            "eval (understanding its use and security risks)",
            "Reference Type vs. Primitive Type",
            "WeakRef and FinalizationRegistry",
            "BigInt for arbitrary-precision integers",

            // --- Browser, Web APIs, and Frontend ---
            "Event bubbling, capturing, and delegation",
            "Scripts: async vs. defer attributes",
            "Web Storage: localStorage vs. sessionStorage vs. Cookies",
            "ArrayBuffer, Blobs, and handling binary data",
            "Network requests: Fetch API vs. XMLHttpRequest (XHR)",
            "Fetch API: AbortController for aborting requests",
            "Cross-Origin Requests (CORS): preflight requests and headers",
            "WebSockets vs. Server-Sent Events (SSE) vs. Long Polling",
            "Regular Expressions: lookaheads, lookbehinds, and performance",
            "Web Workers for background processing",
            "Service Workers, caching strategies, and offline availability",
            "Web Performance: Core Web Vitals (LCP, FID, CLS)",
            "Browser rendering optimization: minimizing reflow and repaint",
            "Web Security: XSS, CSRF, and Content Security Policy (CSP)",
            "Authentication: JWTs, OAuth2, and session management",
            "Polyfills and transpilers (e.g., Babel)",
            "Frontend testing strategies (Unit, Integration, E2E)",
            "Automated testing with Mocha, Jest, or Cypress",

            // --- Node.js, Backend, and System Design ---
            "Node.js: Event Emitter pattern",
            "Node.js: Buffers and handling binary data",
            "Node.js: Child processes (spawn, fork, exec)",
            "Node.js: Cluster module for multi-core scaling",
            "Node.js: File system (fs) module (sync vs. async, streams)",
            "Node.js: Streams (Readable, Writable, Duplex, Transform)",
            "Node.js: Timers and their interaction with the event loop",
            "Node.js: Async hooks for context tracking",
            "HTTP/HTTPS/HTTP/2 servers in Node.js",
            "API Design: RESTful principles and best practices",
            "API Design: GraphQL vs. REST",
            "System Design: Monolith vs. Microservices",
            "System Design: Load Balancers and scaling strategies",
            "System Design: Caching strategies (client, CDN, server-side with Redis)",
            "System Design: CAP Theorem and its implications",
            "System Design: Database Sharding and Replication",
            "System Design: Message Queues (e.g., RabbitMQ, Kafka)",
            "Databases: SQL vs. NoSQL (e.g., PostgreSQL vs. MongoDB)",
            "Databases: Indexing, transactions, and ACID properties",
            "DevOps: CI/CD pipelines and their purpose",
            "DevOps: Containerization with Docker and orchestration with Kubernetes",
            "V8 Engine concepts and optimization tricks",
            "WebAssembly (WASI) and its use in Node.js",
            "C++ addons with Node-API",
            "Crypto module for hashing and encryption",
            "DNS module in Node.js",
            "Net (TCP servers) and UDP/datagram modules",
            "OS, Path, and Process modules",
            "Performance hooks in Node.js",
            "Permissions model in Node.js",
            "TLS/SSL configuration in Node.js",
            "URL parsing and manipulation",
            "VM (virtual machine) module in Node.js",
            "Zlib for data compression"
        ];

        const randomIndex = Math.floor(Math.random() * interviewTopics.length);
        const topic = interviewTopics[randomIndex];

//         const prompt = `As an expert JavaScript educator dedicated to making users proficient for technical interviews, perform the following tasks:

// 1.  Translate the C++ code below into modern, idiomatic ES6+ JavaScript. The translated code MUST NOT contain any comments.
// 2.  Create a mini-lesson on some interview related node js or javascript topic and selected completely random topic designed for interview preparation.

// **Response Structure:**
// Your entire response must be a single JSON object with three keys: "javascriptCode", "interviewQuestion", and "interviewAnswer". The JSON object itself must be a single line of text.

// **Content Formatting Rules:**
// - The content for "interviewQuestion" and "interviewAnswer" should be valid Markdown.
// - All special characters within the JSON string values, such as newlines, MUST be properly escaped (e.g., a newline becomes \\n).
// - All JavaScript code snippets in the lesson MUST be in Markdown code blocks (\`\`\`javascript ... \`\`\`).

// C++ Code:
// \`\`\`cpp
// ${cppCode}
// \`\`\`
// `;

const prompt = `You are an elite AI educator, renowned for your ability to make complex software engineering topics accessible and deeply understood. Your teaching method is based on building a strong mental model, starting with a simple core idea and progressively adding layers of technical depth and practical context.

You will be given a C++ code snippet and a specific JavaScript-related interview topic.

**Your Tasks:**

1.  **Translate Code:** Convert the provided C++ code into modern, idiomatic, and efficient ES6+ JavaScript. The resulting JavaScript code must be clean and contain NO comments.
2.  **Create a Multi-Layered Lesson:** Generate a comprehensive mini-lesson on the topic: **${topic}**. The lesson must be structured to guide a learner from a foundational understanding to a level of expertise expected in senior-level interviews at top-tier companies.

**JSON Output Specification:**

Your entire response MUST be a single, minified line of JSON. It must conform to the following structure:

{
  "javascriptCode": "...",
  "lesson": {
    "topic": "${topic}",
    "coreIdea": "...",
    "howItWorks": "...",
    "tradeoffsAndScenarios": "...",
    "codeExample": "...",
    "interviewQuestions": {
      "foundational": { "question": "...", "answer": "..." },
      "deepDive": { "question": "...", "answer": "..." },
      "scenarioBased": { "question": "...", "answer": "..." }
    }
  }
}

**Content Guidelines for the 'lesson' object:**

-   **"coreIdea"**: Start with a simple, powerful analogy or a one-sentence explanation. This should establish the 'what' and 'why' in the simplest possible terms.
-   **"howItWorks"**: Explain the underlying mechanics. How does the JavaScript engine execute this? What happens in memory or on the call stack? This section builds the technical foundation.
-   **"tradeoffsAndScenarios"**: Discuss what a senior engineer needs to know. Cover performance implications, common pitfalls, edge cases, and when to use (or not use) this concept in real-world application architecture.
-   **"codeExample"**: Provide a single, practical JavaScript code example that clearly demonstrates the topic. The code should be well-commented to explain the implementation.
-   **"interviewQuestions"**: An object containing three distinct types of question-answer pairs:
    -   **"foundational"**: A question to confirm a solid grasp of the basic definition and purpose.
    -   **"deepDive"**: A question that requires explaining the internal mechanics or comparing the concept to alternatives.
    -   **"scenarioBased"**: A challenging, open-ended question that places the concept within a real-world problem, often involving trade-offs or system design.

**Formatting Rules:**

-   All content within the JSON values must be valid Markdown.
-   All special characters, especially newlines and quotes, MUST be properly escaped for a valid single-line JSON string (e.g., newline becomes \\n, double quote becomes \\").
-   All JavaScript code snippets must be inside Markdown code blocks (\`\`\`javascript ... \`\`\`).

**C++ Code to Translate:**
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

        res.status(200).json(JSON.parse(responseText));

    } catch (error) {
        console.error('Error in /api/convert endpoint:', error);
        res.status(500).json({ message: 'An internal server error occurred during conversion.' });
    }
});

// --- Netlify Configuration ---
// **FIX:** Mount the router on the /api path. The serverless-http wrapper
// and netlify.toml will handle the rest of the routing.
app.use('/api', router);

// Export the handler for Netlify to use
export const handler = serverless(app);
