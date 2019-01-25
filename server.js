const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Cloudant = require('@cloudant/cloudant');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// home page
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// submit the user to cloudant to kick off the trigger
app.post('/submit_user', function(request, response) {
  var doc = {};
  var cloudant = new Cloudant({ url: process.env.URL});
  
  if(request.body.user_email) {
    doc.user_email = request.body.user_email;
  }
  
  if(request.body.user_phone) {
    doc.user_phone = request.body.user_phone;
  }
  
  //insert this new document
  const dbName = process.env.dbname;
  const testdb = cloudant.db.use(dbName);
  testdb.insert(doc, function(){
    console.log('doc inserted');
  });
  
  response.redirect("/");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
