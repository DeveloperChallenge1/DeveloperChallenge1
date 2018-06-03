// process.env

var restify = require('restify');
var mongoose = require('mongoose');
const trueLiteral='true';
var wineDataBaseSchema=null;


function isTrue(environmentVariable)
{
  return(environmentVariable == trueLiteral);
}

function isDebugging()
{
  return isTrue(process.env.isDebugging);
}

function isDataBaseInitialized()
{
    return isTrue(process.env.database_initiated);
}

function broadCastDatabaseInititation()
{
    process.env.database_initiated = trueLiteral;
}





class Wine
{

  static function wineDataBaseModellSchema()
  {
    if(wineDataBaseSchema==null)
    {
    wineDataBaseSchema = new Schema({
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

  constructor(name,year,country,type)
  {
    //put verficitation of parameters here
    this.model=new WineModel({name: name,year:year,country:country,type:type,description:''});

  }

  static function isLegalWineType(typeKandidate)
  {
    return(typeKandidate=="rose" || typeKandidate=="red" || typeKandidate=="white")
  }

  updateDescription(newDescriptionOfWine)
  {
    this.descrption=newDescriptionOfWine;
  }

  updateYear(updatedYear)
  {
    this.year=updatedYear;
  }

  updateCountry(updatedCountry)
  {
    this.country=updatedCountry;
  }

  updateCountry(updatedCountry)
  {
    this.country=updatedCountry;
  }

}


function checkIfDatabaseIsInitialisedAndInitializeIfApplicable()
{
  if(isDataBaseInitialized())
  {
    console.log('initializing DataBase');

  //  Wine.WineModel = mongoose.model('Wine', wineDataBaseModellSchema());

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
Wine.WineModel = mongoose.model('WineModel', Wine.wineDataBaseModellSchema());
console.log('successfull.\n');

console.log('Checking database...');
checkIfDatabaseIsInitialisedAndInitializeIfApplicable();
console.log('finished.\n');



server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
  console.log('db state is %s',process.env.database_initiated);

});
