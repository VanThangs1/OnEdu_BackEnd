const http = require("http");
const app = require("./src/app");
// const connectDB = require("./src/config/db"); 

const PORT = process.env.PORT || 3000;

// connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
