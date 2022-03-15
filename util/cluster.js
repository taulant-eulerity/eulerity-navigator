const cluster = require('cluster');
const http = require('http');
const {app} = require('../server/api/server')
const PORT = 8080
if (cluster.isMaster) {

  // Keep track of http requests
  let numReqs = 0;

  // Count requests

  // Start workers and listen for messages containing notifyRequest
  const numCPUs = require('os').cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

} else {
    app.listen(PORT, () => {
    process.send({ cmd: 'notifyRequest' });
    console.log(`server is running on port ${PORT}`)
})
//   // Worker processes have a http server.
//   http.Server((req, res) => {
//     res.writeHead(200);
//     res.end('hello world\n');

//     // Notify master about the request
//     process.send({ cmd: 'notifyRequest' });
//   }).listen(8000);
}