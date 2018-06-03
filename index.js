// process.env

var restify = require('restify');
var mongoose = require('mongoose');
const String trueLiteral='true';

var Schema wineDataBaseSchema=null;


boolean funtion isTrue(String environmentVariable)
{
  return(environmentVariable== trueLiteral);
}

function boolean isDebugging()
{
  return isTrue(process.env.isDebugging);
}

function boolean isDataBaseInitialized()
{
    return isTrue(process.env.database_initiated);
}

function broadCastDatabaseInititation()
{
    process.env.database_initiated = trueLiteral;
}


function Schema wineDataBaseModellSchema()
{
  if(wineDataBaseSchema==null)
  {
  var wineDataBaseSchema = new Schema({
    id: Number,
    name:String,
    year:Number,
    country:String,
    type: String,
    description: String
  });
  }
return wineDataBaseSchema;
}


function checkIfDatabaseIsInitialisedAndInitializeIfApplicable()
{
  if(isDataBaseInitialized())
  {
    console.log('initializing DataBase');

    // create table schmea here
    broadCastDatabaseInititation();
    console.log('db is initialized');
  }
  else
  {
    console.log('db is not initialized');
  }
}



function respond(req, res, next) {
  //res.send('hello ' + req.params.name);
  res.contentType= 'json';
  res.header('content-type', 'json');
  res.send({name: 'tester2',id: '7'});
  if(isDebugging())console.log('responding: hello + %s \n', req.params.name);
  next();
}

console.log('VirtualWineCellar started.\n');

var server = restify.createServer({
  acceptable: 'application/json',
});
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);


console.log('connecting to MongoDB: process.env.URL_to_MongoDB...');
db=mongoose.connect(process.env.URL_to_MongoDB);
//Schema=mongoose.Schema;
console.log('successfull.\n');

console.log('Checking database...');
checkIfDatabaseIsInitialisedAndInitializeIfApplicable();
console.log('finished.\n');



server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
  console.log('db state is %s',process.env.database_initiated);

});
