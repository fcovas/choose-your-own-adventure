var mongoose = require('mongoose'),
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

exports.getUser = function(userId){

	User.findOne({ userId: userId }).populate('current').exec(function(err, user){

		if(err){
			console.log("Error: " + error);
			return err;
		} else if(!user){

			console.log("User doesn't exist");

			return "User doesn't exist";
		}

		console.log("Found user: " + user);

		return user;
	})
};

exports.getParagraph = function(paragraphNumber){
};

exports.getChapter = function(userId){

	User.find({ userId: userId })
	.then(function(user){
		Paragraph.find({ number: user.current});
	})
	.then(function(paragraph){
		return paragraph;
	})
};