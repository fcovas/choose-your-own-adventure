var restify = require('restify');
var Database = require('./database');

var	server = restify.createServer({
	name: 'adventure-server'
});

server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.get('/getChapter/:user', function(req, res, next){

	var userId = req.params.user;

	console.log('Requesting paragraph for user ' + userId);

	var paragraph = Database.getChapter(userId);

	res.send(paragraph);
});

server.get('/travelTo/:user/:paragraph', function(req, res, next){

	res.send("User " + req.params.user + " is traveling to paragraph " + req.params.paragraph);
});

server.listen(8085, function(){

	console.log('%s listening at %s', server.name, server.url);
});