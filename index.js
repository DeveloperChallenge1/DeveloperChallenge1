// process.env

var restify = require('restify');
var mongoose = requiere('mongoose/');

function respond(req, res, next) {
  //res.send('hello ' + req.params.name);
  res.contentType= 'json';
  res.header('content-type', 'json');
  res.send({name: 'tester2',id: '7'});
    console.log('responding: hello + %s \n', req.params.name);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

mongoose.connect('mongodb://heroku_frbg5gzs:mgrdlv5rqdnbin1l7vupiig9iv@ds255588.mlab.com:55588/heroku_frbg5gzs');

server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
