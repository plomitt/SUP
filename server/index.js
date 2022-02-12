const express = require('express');
const app = express();
const session = require('express-session');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '2mb' })

const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const imageToBase64 = require('image-to-base64');

const React = require('react');
const ReactDOM = require('react-dom');

const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sup', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to the Database is successful.')
});

const { checkEmail, checkPassword, checkGrade, checkBio, checkName, checkRole } = require('./additional');


const sessionStore = new MongoDBStore({
  uri: 'mongodb://localhost:27017/sup',
  collection: 'sessionstest'
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
  name: 'sid',
  secret: '123',
  resave: false,
  saveUninitialized: false,
  rolling: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    sameSite: true,
    secure: false
  }
}));

app.get('/test', function(req, res) {
  req.session.test = 'bruh';

  res.render('./index.html');
})

app.use((req, res, next) => {
  console.log(req.session);
  next();
})

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

const sessionSchema = new mongoose.Schema({
  id: String,
  userId: String
});
const Session = mongoose.model('Session', sessionSchema);

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

function addSessionToDB(userId) {
  try {
    const sid = uuidv4();
  
    const newSession = new Session({
      id: sid,
      userId: userId
    })
    newSession.save()
  
    return sid;
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


app.post('/signin', urlencodedParser, parseData, function(req, res) {
  const data = req.app.locals.data;

  const email = data[0];
  const password = data[1];
  const role = data[2];

  req.session.test = 'bruh';

  console.log(req.session);
  
  if (checkEmail(email) && checkPassword(password) && checkRole(role) === true) {
    User.findOne({email: email, role: role})
    .then(user => {
      if (user === null) {
        res.send({status: 'wrong'});
      } else {
        if (comparePasswords(password, user.password)) {
          const sid = addSessionToDB(user.id);
  
          if (sid !== false) {
            // req.session.userId = user.id;
            // req.session.userAccessLevel = user.accessLevel;

            res.send({
              status: 'ok',
              session: {id: sid, userId: user.id},
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
            res.send({status: 'error'});
          }
  
        } else {
          res.send({status: 'wrong'});
        }
      }
    })
  } else {
    res.send({status: 'error'});
  }

});

app.post('/signout', urlencodedParser, parseData, function(req, res) {
  const session = req.app.locals.data;

  Session.deleteOne({id: session.id})
  .then(result => {
    if (result.ok === 1) {
      res.send('ok');
    } else {
      res.send('error');
    }
  })
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

app.post('/checksignin', urlencodedParser, parseData, function(req, res) {
  const session = req.app.locals.data;

  Session.findOne({id: session.id})
  .then(session => {
    res.send(session !== null);
  })
});

app.post('/authorization', urlencodedParser, parseData, function(req, res) {
  const data = req.app.locals.data;

  const session = data[0];
  const password = data[1];

  Session.findOne({id: session.id})
  .then(session => {
    if (session !== null) {
      User.findOne({id: session.userId})
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
    } else {
      res.send('error');
    }
  })
});

app.post('/getuserdata', urlencodedParser, parseData, function(req, res) {
  const session = req.app.locals.data;

  Session.findOne({id: session.id})
  .then(session => {
    if (session !== null) {
      User.findOne({id: session.userId})
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
    } else {
      res.send({status: 'error'});
    }
  })
});

app.post('/updateuserpreferences', urlencodedParser, parseData, function(req, res) {
  // console.log(req.socket.bytesRead)

  const data = req.app.locals.data;

  const dataSession = data[0];
  const dataToUpdateName = data[1];

  Session.findOne({id: dataSession.id})
  .then(session => {
    if (session !== null) {
      User.findOne({id: session.userId})
      .then(user => {
        if (user !== null) {
          let toUpdate = {};

          if (dataToUpdateName === 'name') {
            toUpdate = {
              name: data[2],
              surname: data[3]
            }
          } else if (dataToUpdateName === 'email') {
            toUpdate = {
              email: data[2],
              role: data[3],
              verified: false,
            }
          } else if (dataToUpdateName === 'password') {
            toUpdate[dataToUpdateName] = encryptPassword(data[2]);
          } else {
            toUpdate[dataToUpdateName] = data[2];
          }
    
          udpateUser(user.id, toUpdate)
          .then(result => {
            res.send({status: result});
          })
        } else {
          res.send({status: 'error'});
        }
      })
    } else {
      res.send({status: 'error'})
    }
  })
});

var server = app.listen(8888, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at localhost:%s', port);
});