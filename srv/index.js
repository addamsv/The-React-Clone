import sets from './sets.js';
import express from 'express';
import cors from 'cors';
import getTableData, { getQueryData } from './drivers.js';

const app = express();
const port = 3001;

app.use(cors());

// Error handling Middleware function for logging the error message
const errorLogger = (error, request, response, next) => {
  console.log( `error ${error.message}`) ;
  next(error); // calling next middleware
}

// Error handling Middleware function reads the error message and sends back a response in JSON format
const errorResponder = (error, request, response, next) => {
  response.header("Content-Type", 'application/json');
  const status = error.status || 400;
  response.status(status).send(error.message);
}

// 404 error for undefined paths
const invalidPathHandler = (request, response, next) => {
  response.status(404);
  response.send('invalid path. 404 - Custom error landing page.');
}

app.get('/sets', (req, res) => {
  res.setHeader('Content-Type', 'application/json');  // application/json application/x-javascript text/javascript text/x-javascript text/x-json text/plain
  res.statusCode = 200;
  res.send(JSON.stringify(sets));
  // res.statusCode = 404;
  // res.send('{"detail": "Not found"}');
});

// Route with a handler function which throws an error
app.get('/productswitherror', (request, response) => {
  let error = new Error(`processing error in request at ${request.url}`);
  error.statusCode = 400;
  throw error;
});

app.get('/get_table_data', (req, res) => {
  getTableData(req.query.system, req.query.table)
    .then(response=>{res.send(response)})
    .catch((err) => console.log(err));
});

app.get('/get_query_data', (req, res) => {
  getQueryData(req.query.query)
    .then(response=>{res.send(response)})
    .catch((err) => console.log(err));
});

app.get('/error', (req, res) => res.send("404 - Custom error landing page."));
// Attach the first Error handling Middleware function defined above (which logs the error)
app.use(errorLogger);
// Attach the second Error handling Middleware function defined above (which sends back the response)
app.use(errorResponder);
// Attach the fallback Middleware function which sends back the response for invalid paths)
app.use(invalidPathHandler);
app.listen(port, () => {
  console.log(`
  http://localhost:${port}/sets
  http://localhost:${port}/productswitherror
  http://localhost:${port}/get_table_data?system=ABD&table=/BIC/TSBXXEB021`);
});
