const express = require('express');
const app = express();
const session = require('express-session');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '2mb' })

const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const imageToBase64 = require('image-to-base64');
const dotenv = require('dotenv').config();

const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to the Database is successful.')
});

const { checkEmail, checkPassword, checkGrade, checkBio, checkName, checkRole } = require('./additional');


const sessionStore = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: 'sessions'
});

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(bodyParser.json());

const handler = express.static('../client/build');
const routes = ['/', '/signin', '/signup', '/authorization', '/userpreferences', '/work'];
routes.forEach( route => app.use(route, handler) );



app.use(session({
  genid: (req) => {
    return uuidv4();
  },
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    sameSite: true,
    secure: false
  }
}));

// app.use((req, res, next) => {
//   console.log(req.session);
//   next();
// })

const userSchema = new mongoose.Schema({
  id: String,
  pfp: String,
  name: String,
  surname: String,
  grade: String,
  bio: String,
  email: String,
  password: String,
  phone: String,
  verified: Boolean,
  accessLevel: Number,
  role: String,
  subjectsNeedHelp: Array,
  subjectsCanHelp: Array
});
const User = mongoose.model('User', userSchema);

async function findUserInDB(id) {
  return await User.find({});
}

function addUserToDB(email, password, role) {
  try {
    const newUser = new User({
      id: uuidv4(),
      email: email,
      password: password,
      verified: false,
      role: role
    })

    newUser.save();
    return true;
  } catch (error) {
    return false;
  }
}

/*function deleteEntities(entitiesIds) {
  for (let i = 0; i < entitiesIds.length; i++) {
    db.collection('nest_entities').deleteOne({id: entitiesIds[i]})
  }
}*/

function encryptPassword(password) {
  const saltRounds = 13;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

function comparePasswords(password, hash) {
  return bcrypt.compareSync(password, hash)
}

function udpateUser(id, toUpdate) {
  return User.updateOne(
    {id: id},
    {$set: toUpdate}
  ).then(res => {
    if (res.ok === 1) {
      return 'success'
    } else {
      return 'error'
    }
  })
}

function parseData(req, res, next) {
  try {
    req.app.locals.data = JSON.parse(req.body.data);
    next();
  } catch (error) {
    res.send({status: 'error'});
  }
}

function checkSignin(req, res, next) {
  db.collection('sessions').findOne({ 'session.sessionId': req.session.sessionId })
  .then(session => {
    if (session !== null) {
      next();
    } else {
      res.send('error');
    }
  })
}

function checkReqSize(req, res, next) {
  if (req.socket.bytesRead > 2000000) {
    res.send({status: 'error'});
  } else {
    next();
  }
}


app.post('/signin', urlencodedParser, parseData, function(req, res) {
  const data = req.app.locals.data;

  const email = data[0];
  const password = data[1];
  const role = data[2];
  
  if (checkEmail(email) && checkPassword(password) && checkRole(role) === true) {
    User.findOne({email: email, role: role})
    .then(user => {
      if (user === null) {
        res.send({status: 'wrong'});
      } else {
        if (comparePasswords(password, user.password)) {
  
          req.session.sessionId = uuidv4();
          req.session.userId = user.id;

          res.send({
            status: 'ok',
            user: {
              id: user.id,
              pfp: user.pfp,
              name: user.name,
              surname: user.surname,
              grade: user.grade,
              bio: user.bio,
              email: user.email,
              phone: user.phone,
              verified: user.verified,
              role: user.role,
              subjectsNeedHelp: user.subjectsNeedHelp,
              subjectsCanHelp: user.subjectsCanHelp
            }
          });
        } else {
          res.send({status: 'wrong'});
        }
      }
    })
  } else {
    res.send({status: 'error'});
  }

});

app.get('/signout', urlencodedParser, function(req, res) {
  req.session.destroy();
  res.clearCookie(process.env.SESSION_NAME);
  res.sendStatus(200);
});

app.post('/signup', urlencodedParser, parseData, function(req, res) {
  const data = req.app.locals.data;

  User.findOne({email: data[0], role: data[2]})
  .then(user => {
    if (user === null) {
      if (checkEmail(data[0]) && checkPassword(data[1]) && checkRole(data[2]) === true) {
        const encryptedPassword = encryptPassword(data[1]);
        if (addUserToDB(data[0], encryptedPassword, data[2]) === true) {
          res.send('ok');
        } else {
          res.send('error');
        }
      } else {
        res.send('error');
      }
    } else {
      res.send('email_taken');
    }
  })
});

app.get('/checksignin', urlencodedParser, function(req, res) {
  db.collection('sessions').findOne({ 'session.sessionId': req.session.sessionId })
  .then(session => {
    res.send(session !== null);
  })
});

app.post('/authorization', urlencodedParser, parseData, checkSignin, function(req, res) {
  const data = req.app.locals.data;

  const password = data[0];

  User.findOne({id: req.session.userId})
  .then(user => {
    if (user !== null) {
      const check = comparePasswords(password, user.password);
      if (check === true) {
        res.send('ok');
      } else {
        res.send('wrong');
      }
    } else {
      res.send('error');
    }
  })
});

app.get('/getuserdata', urlencodedParser, checkSignin, function(req, res) {
  User.findOne({id: req.session.userId})
  .then(user => {
    if (user !== null) {
      res.send({
        status: 'ok',
        user: {
          id: user.id,
          pfp: user.pfp,
          name: user.name,
          surname: user.surname,
          grade: user.grade,
          bio: user.bio,
          email: user.email,
          phone: user.phone,
          verified: user.verified,
          role: user.role,
          subjectsNeedHelp: user.subjectsNeedHelp,
          subjectsCanHelp: user.subjectsCanHelp
        }
      })
    } else {
      res.send({status: 'error'});
    }
  })
});

app.post('/updateuserpreferences', urlencodedParser, parseData, checkSignin, checkReqSize, function(req, res) {
  const data = req.app.locals.data;

  const dataToUpdateName = data[0];

  User.findOne({id: req.session.userId})
  .then(user => {
    if (user !== null) {
      let toUpdate = {};

      if (dataToUpdateName === 'name') {
        toUpdate = {
          name: data[1],
          surname: data[2]
        }
      } else if (dataToUpdateName === 'email') {
        toUpdate = {
          email: data[1],
          role: data[2],
          verified: false,
        }
      } else if (dataToUpdateName === 'password') {
        toUpdate[dataToUpdateName] = encryptPassword(data[1]);
      } else {
        toUpdate[dataToUpdateName] = data[1];
      }

      udpateUser(user.id, toUpdate)
      .then(result => {
        res.send({status: result});
      })
    } else {
      res.send({status: 'error'});
    }
  })
});

var server = app.listen(8888, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at localhost:%s', port);
});