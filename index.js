var restify = require('restify'),
	Q = require('q'),
	Database = require('./database');

var	server = restify.createServer({
	name: 'adventure-server'
});

server.use(restify.fullResponse());

server.use(restify.bodyParser());

server.get('/getParagraph/:user', function(req, res, next){

	var userId = req.params.user;

	console.log('Requesting paragraph for user ' + userId);

	getParagraph(userId)
	.then(function(result){
		res.send(result);
	})
	.fail(function(error){
		res.send(error);
	})
	.done();
});

server.get('/travelTo/:user/:paragraph', function(req, res, next){

	console.log('User ' + req.params.user + ' is traveling to paragraph ' + req.params.paragraph);

	travelTo(req.params.user, req.params.paragraph)
	.then(function(result){
		res.send(result);
	})
	.fail(function(error){
		console.log('Travel to exiting with error: ' + error);
		res.send(error);
	})
	.done();
});

server.get('/test', function(req, res, next){

	var error = new restify.InternalError("my error");

	res.send(error);

});

server.listen(8085, function(){

	console.log('%s listening at %s', server.name, server.url);
});

// Helpers

var canTravel = function(fromParagraph, toParagraphId){

	for(var i = 0; i < fromParagraph.next.length; ++i){

        if(toParagraphId == fromParagraph.next[i]){

            return true;
        }
    }

    return false;
}

var travelTo = function(userId, paragraphId){

	return Q.promise(function(resolve, reject){

		Database.getUser(userId)

		.then(function(user){

			return Database.getParagraph(user.current);
		})
		.then(function(paragraph){

			if(canTravel(paragraph, paragraphId)){

				Database.updateUserCurrentParagraph(userId, paragraphId)

				.then(function(){

					return Database.getParagraph(paragraphId);
				})
				.then(function(newParagraph){

					resolve(newParagraph);
				})

			} else {

				reject(new restify.InvalidContentError('Can\'t travel to ' + paragraphId));
			}
		})
		.fail(function(error){
			reject(error);
		});
	});
}

var getParagraph = function(userId, callback){

	return Q.promise(function(resolve, reject){

		Database.getUser(userId)
		.then(function(user){

			return getParagraph(user.current);
		})
		.fail(function(error){
			reject(error);
		});
	});
};
