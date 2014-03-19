var mongoose = require('mongoose'),
	Q = require('q'),
	restify = require('restify'),
	MockData = require('./mockdata'),

	db = mongoose.connect('mongodb://localhost/adventure-db'),

	UserSchema = mongoose.Schema({
		userId: { type: Number, index: true },
		current: Number
	}),

	ParagraphSchema = mongoose.Schema({
		number: { type: Number, index: true },
		body: String,
		next: [Number]
	}),

	User = mongoose.model(
		'User',
		UserSchema
	),

	Paragraph = mongoose.model(
		'Paragraph',
		ParagraphSchema
	);

User.find(function(err, users){

	if(err){
		console.log('Error getting users: ' + err);
	}

	console.log('Found users: ' + users);
	if(users.length == 0){

		populateUsers();
	}
});

Paragraph.find(function(err, paragraphs){

	if(err){
		console.log('Error getting paragraphs: ' + err);
	}

	console.log('Found paragraphs: ' + paragraphs);
	if(paragraphs.length == 0){

		populateParagraphs();
	}
})

var populateUsers = function(){

	console.log('Populating users');

	User.create(MockData.users)
	.error(function(err){
		console.log("Error populating user collection: " + err);
	});
};

var populateParagraphs = function(){

	console.log('Populating paragraphs');

	Paragraph.create(MockData.paragraphs)
	.error(function(err){
		console.log("Error populating paragraphs collection: " + err);
	});
};

var getServerError = function(errorMessage){

	return new restify.InternalError(errorMessage);
}

// var getEntityNotFound = function(errorMessage){
//
// 	return new restify.InvalidArgumentError(errorMessage);
// }

var getError = function(errorMessage){

	return new restify.InvalidArgumentError(errorMessage);
}

exports.getUser = function(userId){

	return Q.promise(function(resolve, reject){

		User.findOne({ userId: userId }).exec(function(err, user){

			if(err){

				reject(getServerError(err));
			}
			else if(!user){

				reject(getError('User with id ' + userId + ' not found'));

			} else {

				resolve(user);
			}
		});
	});
}

exports.getParagraph = function(paragraphId){

	return Q.promise(function(resolve, reject){

		Paragraph.findOne({ number: paragraphId }).exec(function(err, paragraph){

			if(err){

				reject(getServerError(err));

			} else if(!paragraph){

				reject(getServerError('Paragraph with id ' + paragraphId + 'not found'));

			} else {

				resolve(paragraph);
			}
		});
	});
}

exports.updateUserCurrentParagraph = function(userId, paragraphId){

	return Q.promise(function(resolve, reject){

		User.update({ 'userId': userId }, { $set: { 'current' : paragraphId } }, function(err, numDocs){

			if(err || numDocs == 0){

				reject(getServerError('Error updating user current paragraph'));

			} else {

				resolve();
			}
		});
	});
}
