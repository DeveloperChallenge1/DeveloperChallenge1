// process.env

var restify = require('restify');
var mongoose = require('mongoose');
const trueLiteral='true';
var wineDataBaseSchema=null;
var WineModel=null;


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





  function getWineDataBaseSchema()
  {
    if(wineDataBaseSchema==null)
    {
      wineDataBaseSchema = new mongoose.Schema({
      id: Number,
      name:String,
      year:Number,
      country:String,
      type: String,
      description: String
      });

      wineDataBaseSchema.methods.isLegalWineType=function(typeKandidate)
      {
        return(typeKandidate=="rose" || typeKandidate=="red" || typeKandidate=="white")
      };

      wineDataBaseSchema.methods.updateDescription=function(newDescriptionOfWine)
      {
        this.descrption=newDescriptionOfWine;
      };

      wineDataBaseSchema.methods.updateYear=function(updatedYear)
      {
        this.year=updatedYear;
      };

        wineDataBaseSchema.methods.updateCountry=function(updatedCountry)
      {
        this.country=updatedCountry;
      };

      wineDataBaseSchema.methods.updateName=function(updatedName)
      {
        this.name=updatedName;
      }

      wineDataBaseSchema.methods.isLegalParameterSetForCreatingWine=function(name,year,country,type)
      {
        return true;//TODO add checking
      }

      wineDataBaseSchema.methods.getNextFreeWineId=function()
      {
        if(isDebugging()) console.log('highest id of a wine is %s, but a new id is assigned right now.',process.env.lastAssignedWineId);

        return ++process.env.lastAssignedWineId;
      }

      wineDataBaseSchema.methods.callbackForDatabaseOperations=function(wasThereError,modelThatCausedTheError)
      {
        if (wasThereError) return console.error(wasThereError);
        if(isDebugging())  console.log('callback finished.');
      }


      wineDataBaseSchema.methods.addNewWine=function(req,res,next)
      {
      //  if(isLegalParameterSetForCreatingWine(name,year,country,type)) return false;//TODO throw Error
        //if(isDebugging())console.log('creating wine with id %s.',this.id);
        var newWine=new WineModel({id:req.params.id,name:req.params.name,year:req.params.year,country:req.params.country,type:req.params.type});
        newWine.save();
//newWine.save(callbackForDatabaseOperations);
        //TODO add response
      }
    }
    return wineDataBaseSchema;
  }


/*
  constructor(name,year,country,type)
  {
    //put verficitation of parameters here
    this.model=new WineModel({name: name,year:year,country:country,type:type,description:''});

  }*/





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
server.use(restify.plugins.queryParser());

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);


console.log('connecting to MongoDB: $s ...',process.env.URL_to_MongoDB);

mongoose.connect(process.env.URL_to_MongoDB);
var db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
WineModel = mongoose.model('WineModel',getWineDataBaseSchema());
console.log('...connected to database. Adding routes...\n');

//server.post('/wines/:name/:year/:country/:type', WineModel.addNewWine);

server.post('/wines/:name/:year/:country/:type', function(res,req,next)
{
  WineModel.addNewWine(res,req,next);
});

console.log('successfully added routes.\n');

});
console.log('successfull.\n');


console.log('Checking database...');
checkIfDatabaseIsInitialisedAndInitializeIfApplicable();
console.log('finished.\n');


server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
  console.log('db state is %s',process.env.database_initiated);

});
