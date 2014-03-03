exports.users = [
	{ userId: 1, current: 1},
	{ userId: 2, current: 1},
	{ userId: 3, current: 1},
	{ userId: 4, current: 1}
];

exports.paragraphs = [
    { 
		number: 1,
		body: 'paragraph 1',
		next: [2, 3]
	},
	{ 
		number: 2,
		body: 'paragraph 2',
		next: [1]
	},
	{ 
		number: 3,
		body: 'paragraph 3',
		next: [4]
	},
	{ 
		number: 4,
		body: 'paragraph 4',
		next: [1]
	}
];