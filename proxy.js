const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://ecom-db-json.onrender.com',
    changeOrigin: true
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
