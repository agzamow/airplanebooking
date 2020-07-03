var express = require('express');
const fs = require('fs');
const fetch = require("node-fetch");
var app = express();
var session = require('express-session');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json({ limit: '1mb' }));

app.use(session({
  key: 'user_sid',
  secret: 'poufnehaslo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 10800000
  }
}));

app.get('/', (req, res) => {
  if (req.session.email != null) {
     res.redirect('/booking');
  }
  else {
    res.sendFile(__dirname + "/public/login_page.html");
  }
});
app.get('/booking', (req, res) => {
  if (req.session.email != null)
    res.sendFile(__dirname + "/public/booking.html")
  else {
    res.redirect('/');
  }
});
app.get('/places', (req, res) => {
  var places = placesFetchJson();
  res.send(places);
});
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


app.post('/login', function (req, res) {
  var post = req.body;
  var users = usersFetchJson();
  var isExistUser = validateUser(users, { email: post.email, password: post.password });
  if (isExistUser) {
    console.log("Przekierowanie");
    var user = getSpecificUser(users, post.email, post.password);
    req.session.email = post.email;
    res.send(JSON.stringify({ isExist: true, imie: user.imie, nazwisko: user.nazwisko }))
    //res.redirect('/booking');
  } else {
    res.send(JSON.stringify({ isExist: false }));
    console.log("Wyświetl alert");
  }
});

app.listen(3000, function () {
  console.log('Airplane booking app listening on port 3000!');
});

function placesFetchJson() {
  console.log("Czytanie pliku places.json");
  let rawdata = fs.readFileSync("places.json");
  var places = JSON.parse(rawdata);
  return places;
}
function usersFetchJson() {
  console.log("Czytanie pliku users.json");
  let rawdata = fs.readFileSync("users.json");
  var users = JSON.parse(rawdata);
  return users;
}
function getSpecificUser(allUsers, email, password) {
  for (var i = 0; i < allUsers.length; i++) {
    if (allUsers[i].mail === email && allUsers[i].password === password)
      return allUsers[i];
  }
  return null;
}
function validateUser(allUsers, user) {
  for (var i = 0; i < allUsers.length; i++) {
    if (allUsers[i].mail === user.email && allUsers[i].password === user.password)
      return true;
  }
  return false;
}