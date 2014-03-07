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

exports.travelTo = function(userId, paragraphId, callback){
	var condition = { userId: userId };
	var update = { current: paragraphId };
	User.update(condition, update, function(err, numDocs){
		
		console.log('updated :' + numDocs + ' users');

		Paragraph.find({ number: paragraphId }).exec(function(err, paragraph){
			
			console.log('found paragraph: ' + paragraph);
			
			callback(paragraph);
		});
	});
};

exports.getParagraph = function(userId, callback){

	User.findOne({ userId: userId }).exec(function(err, user){
		
		console.log('found user: ' + user);
		
		Paragraph.find({ number: user.current }).exec(function(err, paragraph){
			
			console.log('found paragraph: ' + paragraph);
			
			callback(paragraph);
		});
	});
};