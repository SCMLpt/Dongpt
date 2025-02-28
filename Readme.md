# Dongpt AI

Dongpt AI is a plugin-based, flexible AI agent framework designed to be easily expandable. It includes a backend and frontend, offering a simple demo where you can input text and see the results.

## Folder Structure
- **backend/**: Server-side code built with Node.js
- **frontend/**: Web interface that runs in the browser
- 
Dongpt_ai/
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── core.js
│       └── plugins/
│           └── text-processor.js
├── frontend/
│   ├── index.html
│   └── script.js
└── README.md


## How to Run
1. **Set Up the Backend**:
   - Open a terminal and type `cd Dongpt_ai/backend`
   - Run `npm install` to install dependencies
   - Start the server with `npm start`

2. **Run the Frontend**:
   - Open `Dongpt_ai/frontend/index.html` in a web browser

3. **Test It**:
   - Enter text and click the "Process" button to see the result

**Note**: This works locally for now. To deploy it, host the backend on a server and update the URL in `script.js`.

## What's Included?
- **Backend**: Uses Node.js and Express to run an API server, processing data with plugins
- **Frontend**: A simple web page to input text and view results
