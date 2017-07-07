// User Information App - Web Server

// Create a Node.js application that is the beginning of a user management system. Your users are all saved in a "users.json" file, and you can currently do the following:
// - search for users
// - add new users to your users file.
// - get your starter file here: users.jsonView in a new window

// Part 0
// Create one route:
// - route 1: renders a page that displays all your users.

// Part 1
// Create two more routes:
// - route 2: renders a page that displays a form which is your search bar.
// - route 3: takes in the post request from your form, then displays matching users on a new page. Users should be matched based on whether either their first or last name contains the input string.

// Part 2
// Create two more routes:
// - route 4: renders a page with three forms on it (first name, last name, and email) that allows you to add new users to the users.json file.
// - route 5: takes in the post request from the 'create user' form, then adds the user to the users.json file. Once that is complete, redirects to the route that displays all your users (from part 0).

const express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'css')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
	res.render('form')
});

app.get('/users', function (req, res) {
	var obj;	

	fs.readFile("../users.json", 'utf8', function (err, data) {		
		if (err) {
			throw err;					
		} 
		var obj = JSON.parse(data);
	
		res.render('users', {
			title: 'List of Users',
			users: obj,
		});	
	});

});

app.post('/searchresult', function (req,res){
	console.log(req.body)
	var name = req.body.name
	var obj;

	fs.readFile("../users.json", 'utf8', function (err, data) {		
		if (err) {
			throw err;					
		} 
		var obj = JSON.parse(data);

		for (var i=0; i<obj.length; i++) {
			if ((name === obj[i].firstname) || (name === obj[i].lastname)) {
				var result = "I found you! " + '\n' + obj[i].firstname + '\n' + obj[i].lastname + '\n' + obj[i].email;
				res.render('searchresult', {match: result})
				
			} else {
				var noMatch = "No matches found";
				res.render('searchresult', {match: noMatch});
			};
		}; 
		
	});
});

app.listen(3003, function () {
  console.log('Example app listening on port 3003!')
});