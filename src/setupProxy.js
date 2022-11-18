const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/auth', {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/posts', {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/board', {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/download', {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }),
  );
};
