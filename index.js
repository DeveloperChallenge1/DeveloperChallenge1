// process.env

var restify = require('restify');
var mongoose = require('mongoose');

/*
function checkIfDatabaseIsInitialisedAndInitializeIfApplicable()
{
  if(process.env.database_initiated)
  {
    console.log('db is initialized');
  }
  else
  {
    console.log('db is not initialized');
  }
}

*/

function respond(req, res, next) {
  //res.send('hello ' + req.params.name);
  res.contentType= 'json';
  res.header('content-type', 'json');
  res.send({name: 'tester2',id: '7'});
    console.log('responding: hello + %s \n', req.params.name);
  next();
}

console.log('VirtualWineCellar started.\n');

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);


console.log('connecting to MongoDB: process.env.URL_to_MongoDB...');

db=mongoose.connect(process.env.URL_to_MongoDB);
//Schema=mongoose.Schema;
console.log('successfull.\n');



server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
  console.log('db state is %s',process.env.database_initiated);

});
