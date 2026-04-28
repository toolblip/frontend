FROM node:22-alpine
WORKDIR /app
RUN echo "const http = require('http'); const s = http.createServer((req,res) => res.end('ok')); s.listen(3000, '0.0.0.0', () => console.log('Listening on 3000'));" > server.js
EXPOSE 3000
CMD ["node", "server.js"]
