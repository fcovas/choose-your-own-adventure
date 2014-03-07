var restify = require('restify');
var Database = require('./database');

var	server = restify.createServer({
	name: 'adventure-server'
});

server.use(restify.fullResponse());

server.use(restify.bodyParser());

server.get('/getParagraph/:user', function(req, res, next){

	var userId = req.params.user;

	console.log('Requesting paragraph for user ' + userId);

	Database.getParagraph(userId, function(result){
		res.send(result);
	});
});

server.get('/travelTo/:user/:paragraph', function(req, res, next){

	console.log('User ' + req.params.user + ' is traveling to paragraph ' + req.params.paragraph);

	Database.travelTo(req.params.user, req.params.paragraph, function(result){
		res.send(result);
	})
});

server.listen(8085, function(){

	console.log('%s listening at %s', server.name, server.url);
});