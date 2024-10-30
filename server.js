const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to handle HTTP requests
const requestHandler = (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // Serve CSS file
    if (pathname === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fs.createReadStream(path.join(__dirname, 'style.css')).pipe(res);
        return;
    }

    // Serve the main page
    if (pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
            <html>
            <head>
                <title>Node.js File Server</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to the Node.js File Server</h1>
                    <form action="/read" method="get">
                        <button type="submit">Read File</button>
                    </form>
                    <form action="/write" method="get">
                        <input type="text" name="data" placeholder="Enter text to write" required>
                        <button type="submit">Write to File</button>
                    </form>
                </div>
            </body>
            </html>
        `);
        res.end();
        return;
    }

    // Handle reading from a file
    if (pathname === '/read') {
        fs.readFile('example.txt', 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<div class="container"><h2>File Contents</h2><p>${err ? 'Error reading file.' : data}</p></div>`);
            res.end();
        });
        return;
    }

    // Handle writing to a file
    if (pathname === '/write') {
        const data = parsedUrl.searchParams.get('data');
        fs.writeFile('example.txt', data, (err) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<div class="container"><h2>${err ? 'Error writing to file.' : 'Data written successfully!'}</h2></div>`);
            res.end();
        });
        return;
    }

    // Handle 404
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write(`<div class="container"><h2>404 - Not Found</h2></div>`);
    res.end();
};

// Create server and listen on port 3001
const server = http.createServer(requestHandler);
server.listen(3001, () => {
    console.log('Server running at http://localhost:3001/');
});
