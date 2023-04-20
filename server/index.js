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
const _ = require('lodash');

const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to the Database is successful.')
});

app.use((req, res, next) => {
  setHeaders(req, res, next);

  // console.log(req.body);
  // console.log(req.headers.origin);
  // console.log(res.getHeaders());

  // next();
})


// app.use(cors({origin: process.env.HOST_URI, credentials: true}));
app.use(bodyParser.json());

const handler = express.static('../client/build');
const routes = ['/', '/signin', '/signup', '/authorization', '/userpreferences', '/work', '/editpost', '/viewpost', '/users', '/user', '/userjobs', '/moderation'];
routes.forEach( route => app.use(route, handler) );

const sessionStore = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: 'sessions'
});

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
    sameSite: false,
    secure: false
  }
}));

const { checkEmail, checkPassword, checkGrade, checkBio, checkName, checkRole, userHasEmptyFields } = require('./additional');
const { constants } = require('fs');
const { resolve } = require('path');



// app.use((req, res, next) => {
//   console.log(req.body);
//   next();
// })

const reportSchema = new mongoose.Schema({
  id: String,
  userId: String,
  targetType: String,
  targetId: String,
  status: String
})
const Report = mongoose.model('Report', reportSchema);

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
  banned: String,
  moderator: Boolean,
  accessLevel: Number,
  role: String,
  subjectsNeedHelp: Array,
  subjectsCanHelp: Array,
  postsUserRespondedTo: Array,
  usersRespondedToUser: Array
});
const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
  id: String,
  userId: String,
  title: String,
  description: String,
  deadline: String,
  subjects: Array,
  status: String
});
const Post = mongoose.model('Post', postSchema);

const sessionSchema = new mongoose.Schema({
  id: String,
  userId: String
});
const Session = mongoose.model('Session', sessionSchema);

function addUserToDB(email, password, role) {
  try {
    let newUser = new User({
      id: uuidv4(),
      email: email,
      password: password,
      role: role,
      verified: false,
      banned: 'false',
      moderator: false
    })

    if (role === 'teacher') {
      newUser.grade = 'teacher';
    }

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
    return 'success'
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
  const data = req.app.locals.data;
  const userId = data[data.length-2];
  const sessionId = data[data.length-1];

  User.findOne({id: userId})
  .then(user => {
    if (user !== null) {
      db.collection('sessions').findOne({ 'id': sessionId })
      .then(session => {
        if (session !== null) {
          if (session.userId === user.id) {
            req.app.locals.user = user;
            next();
          } else {
            res.send('error');
          }
        } else {
          res.send('error');
        }
      })
    } else {
      res.send('error');
    }
  })
}

function checkIfUserIsUnbanned(req, res, next) {
  const user = req.app.locals.user;

  if (user.banned === 'false') {
    next();
  } else {
    res.send({status: 'error'});
  }
}

function checkIfUserBanEnded(userId, banEndDate) {
  if (banEndDate === 'false') {
    return true;
  }

  if (banEndDate === 'forever') {
    return false;
  }

  const curentDate = new Date();
  const expirationDate = new Date(banEndDate);

  if (curentDate > expirationDate) {
    udpateUser(userId, {banned: 'false'});
    return true;
  } else {
    return false;
  }
}

function checkIfUserIsVerified(req, res, next) {
  const user = req.app.locals.user;

  if (user.verified === true) {
    next();
  } else {
    res.send({status: 'error'});
  }
}

function checkIfUserIsModerator(req, res, next) {
  const user = req.app.locals.user;

  if (user.moderator === true) {
    next();
  } else {
    res.send({status: 'error'});
  }
}

function checkReqSize(req, res, next) {
  if (req.socket.bytesRead > 2000000) {
    res.send({status: 'error'});
  } else {
    next();
  }
}

function checkIfUserOwnsPost(req, res, next) {
  const data = req.app.locals.data;
  const userId = data[data.length-2];

  if (data[0] === 'new') {
    next();
  } else {
    Post.findOne({id: data[1]})
    .then(post => {
      if (post !== null) {
        if (post.userId === userId) {
          next();
        } else {
          res.send({status: 'error'});
        }
      } else {
        res.send({status: 'error'});
      }
    })
  }
}

function checkIfPostIsntComplete(req, res, next) {
  const data = req.app.locals.data;

  if (data[0] === 'new') {
    next();
  } else {
    Post.findOne({id: data[1]})
    .then(post => {
      if (post !== null) {
        if (post.status === 'completed') {
          res.send({status: 'error'});
        } else {
          next();
        }
      } else {
        res.send({status: 'error'});
      }
    })
  }
}

function generatePosts(posts, pageNumber) {
  const postsPerPage = parseInt(process.env.POSTS_PER_PAGE);
  const start = pageNumber * postsPerPage;
  const postsAmount = posts.length - 1;
  const fEnd = start + postsPerPage - 1;
  const end = fEnd > postsAmount ? postsAmount : fEnd;

  let newPosts = [];

  for (let i = start; i <= end; i++) {
    const currentPost = posts[i];
    const promise = new Promise((resolve, reject) => {
      if (currentPost !== undefined) {
        User.findOne({id: currentPost.userId})
        .then(usr => {
          let post = JSON.parse(JSON.stringify(currentPost));
    
          post.userName = usr.name;
          post.userSurname = usr.surname;
          post.userGrade = usr.grade;
          post.userPfp = usr.pfp;
          post.userRole = usr.role;
          post.banned = usr.banned;
          
          resolve(post);
        })
      } else {
        reject();
      }
    })

    newPosts.push(promise);
  }

  return new Promise((resolve, reject) => {
    Promise.all(newPosts)
    .then(newPosts => {
      for (let i = newPosts.length - 1; i >= 0; i--) {
        if (checkIfUserBanEnded(newPosts[i].userId, newPosts[i].banned) === false) {
          newPosts.splice(i, 1);
        }
      }

      resolve(newPosts);
    })
  });
}

function setHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
  }

  next();
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
          if (checkIfUserBanEnded(user.id, user.banned) === true) {
            const sid = uuidv4();

            let newSession = new Session({
              id: sid,
              userId: user.id
            });
            newSession.save();
  
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
                moderator: user.moderator,
                banned: user.banned,
                role: user.role,
                subjectsNeedHelp: user.subjectsNeedHelp,
                subjectsCanHelp: user.subjectsCanHelp,
                postsUserRespondedTo: user.postsUserRespondedTo,
                usersRespondedToUser: user.usersRespondedToUser,
                sid: sid
              }
            });
          } else {
            res.send({status: 'banned', endDate: user.banned});
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
  const data = req.app.locals.data;
  const sessionId = data[data.length - 1];

  console.log('delete ' + sessionId)
  db.collection('sessions').deleteOne(
    {id: sessionId}
  )
  
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

app.post('/checksignin', urlencodedParser, parseData, function(req, res) {
  const data = req.app.locals.data;
  const userId = data[data.length-2];
  const sessionId = data[data.length-1];

  Session.findOne({ 'id': sessionId })
  .then(session => {
    res.send(session !== null);
  })
});



app.post('/authorization', urlencodedParser, parseData, checkSignin, checkIfUserIsUnbanned, function(req, res) {
  const data = req.app.locals.data;
  const user = req.app.locals.user;

  const password = data[0];

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
});

app.get('/getuserdata', urlencodedParser, checkSignin, function(req, res) {
    const user = req.app.locals.user;

    if (user !== null) {
      if (checkIfUserBanEnded(user.id, user.banned) === true) {
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
            moderator: user.moderator,
            banned: user.banned,
            role: user.role,
            subjectsNeedHelp: user.subjectsNeedHelp,
            subjectsCanHelp: user.subjectsCanHelp,
            postsUserRespondedTo: user.postsUserRespondedTo,
            usersRespondedToUser: user.usersRespondedToUser
          }
        })
      } else {
        res.send({status: 'banned'});
      }
    } else {
      res.send({status: 'error'});
    }
});

app.post('/updateuserpreferences', urlencodedParser, parseData, checkSignin, checkIfUserIsUnbanned, checkReqSize, function(req, res) {
  const data = req.app.locals.data;
  const user = req.app.locals.user;

  const dataToUpdateName = data[0];

  if (user !== null) {
    new Promise((resolve, reject) => {

      if (dataToUpdateName === 'name') {
        if (checkName(data[1]) === true && checkName(data[2]) === true) {
          resolve({
            name: data[1],
            surname: data[2]
          });
        } else {
          reject('error');
        }
      } else if (dataToUpdateName === 'email') {
        if (checkEmail(data[1]) === true  && checkRole(data[2]) === true) {
          User.find({email: data[1]})
          .then(users => {
            if (users.length === 0) {
              resolve({
                email: data[1],
                role: data[2],
                verified: false,
              });
            } else {
              reject('email_taken');
            }
          })
        } else {
          error = true;
        }
      } else if (dataToUpdateName === 'password') {
        if (checkPassword(data[1]) === true) {
          resolve({
            password: encryptPassword(data[1])
          });
        } else {
          reject('error');
        }
      } else if (dataToUpdateName === 'subjectsNeedHelp' || dataToUpdateName === 'subjectsCanHelp') {
        let temp = {};
        temp[dataToUpdateName] = data[1];
        resolve(temp);
      } else {
        if (data[1].length !== 0) {
          let temp = {};
          temp[dataToUpdateName] = data[1];
          resolve(temp);
        } else {
          reject('error');
        }
      }
    }).then(toUpdate => {
      udpateUser(user.id, toUpdate)
      .then(result => {
        res.send({status: result});
      })
    }).catch(reason => {
      res.send({status: reason});
    });

  } else {
    res.send({status: 'error'});
  }
});



function deletePost(id, res) {
  Post.findOne({id: id})
  .then(post => {
    if (post !== null) {
      Post.deleteOne(
        {id: post.id}
      ).then(result => {
        if (result.deletedCount === 1) {
          User.findOne({id: post.userId})
          .then(postOwner => {
            if (postOwner !== null) {
              let temp = postOwner.usersRespondedToUser;
              let usersToUpdate = [];

              for (let i = temp.length - 1; i >= 0; i--) {
                if (temp[i].postId === post.id) {
                  usersToUpdate.push(temp[i].userId);
                  temp.splice(i, 1);
                }
              }


              udpateUser(postOwner.id, {
                usersRespondedToUser: temp
              }).then(result => {
                if (result === 'success') {
                  let updates = [];

                  for (let i = 0; i <= usersToUpdate.length - 1; i++) {
                    updates.push(new Promise((resolve, reject) => {
                      User.findOne({id: usersToUpdate[i]})
                      .then(user => {
                        if (user !== null) {
                          let temp = user.postsUserRespondedTo;

                          for (let i = temp.length - 1; i >= 0; i--) {
                            if (temp[i].postId === post.id) {
                              temp.splice(i, 1);
                            }
                          }

                          udpateUser(user.id, {
                            postsUserRespondedTo: temp
                          }).then(result1 => {
                            if (result1 === 'success') {
                              resolve();
                            } else {
                              reject('error');
                            }
                          })

                        } else {
                          reject('usr_not_found');
                        }
                      })
                    }))
                  }

                  Promise.all(updates)
                  .then(() => {
                    res.send({ status: 'ok' });
                  }).catch(error => {
                    res.send({ status: 'error' });
                  })


                } else {
                  res.send({ status: 'error' });
                }
              })
            } else {
              res.send({ status: 'error' });
            }
          })
        } else {
          res.send({ status: 'error' });
        }
      })
    } else {
      res.send({ status: 'error' });
    }
  })
}

app.post('/handlepost', urlencodedParser, parseData, checkSignin, checkIfUserIsVerified, checkIfUserIsUnbanned, checkIfUserOwnsPost, checkIfPostIsntComplete, function(req, res) {
  const data = req.app.locals.data;
  const userId = req.app.locals.user.id;

  if (data[0] === 'complete') {
    Post.updateOne(
      {id: data[1]},
      {$set: {status: 'completed'}}
    ).then(result => {
      if (result.modifiedCount === 1) {
        res.send({status: 'ok'});
      } else {
        res.send({status: 'error'});
      }
    })
  }

  if (data[0] === 'new') {
    const newPost = new Post({
      id: uuidv4(),
      userId: userId,
      title: data[2],
      description: data[3],
      deadline: data[4],
      subjects: data[5],
      status: 'pending'
    });
    newPost.save();

    res.send({
      status: 'ok',
      type: 'new'
    });
  }

  if (data[0] === 'update') {
    Post.updateOne(
      {id: data[1]},
      {$set: {
        title: data[2],
        description: data[3],
        deadline: data[4],
        subjects: data[5]
      }}
    ).then(result => {
      if (result.modifiedCount === 1) {
        res.send({
          status: 'ok',
          type: 'update'
        });
      } else {
        res.send({
          status: 'error'
        });
      }
    })
  }

  if (data[0] === 'delete') {
    deletePost(data[1], res);
  }
});

app.post('/getposts', urlencodedParser, parseData, checkSignin, checkIfUserIsUnbanned, function(req, res) {
  const data = req.app.locals.data;
  const reqSource = data[0];
  const pageNumber = data[1] - 1;
  const postsPerPage = parseInt(process.env.POSTS_PER_PAGE);
  const userId = req.app.locals.user.id;


  if (reqSource === 'workpage_list') {
    let query = {};
    if (data[2] !== null && data[2] !== '' && data[3] !== null && data[3].length !== 0) {
      query = {
        $text: {$search: data[2]},
        subjects: { $all: data[3] }
      };
    } else if (data[2] !== null && data[2] !== '' && (data[3] === null || data[3].length === 0)) {
      query = {
        $text: {$search: data[2]}
      };
    } else if ((data[2] === null || data[2] === '') && data[3] !== null && data[3].length !== 0) {
      query = {
        subjects: { $all: data[3] }
      };
    }

    Post.find(query)
    .then(posts => {
      generatePosts(posts, pageNumber)
      .then(newPosts => {
        res.send({
          status: 'ok',
          posts: newPosts,
          amountOfPages: Math.ceil(posts.length/postsPerPage)
        })
      }).catch(() => {
        res.send({
          status: 'error',
          posts: [],
          amountOfPages: 1
        })
      })
    })
  }

  if (reqSource === 'editpost_page') {
    Post.findOne({ id: data[1] })
    .then(post => {
      if (post !== null) {
        if (post.userId === userId) {
          res.send({
            status: 'ok',
            post: post
          })
        } else {
          res.send({status: 'error'});
        }
      } else {
        res.send({status: 'error'});
      }
    })
  }

  if (reqSource === 'viewpost_page') {
    User.findOne({id: userId})
    .then(user => {
      if (user !== null) {
        Post.findOne({id: data[1]})
        .then(post => {
          if (post !== null) {
            User.findOne({id: post.userId})
            .then(postOwner => {
              if (postOwner !== null && checkIfUserBanEnded(postOwner.id, postOwner.banned) === true) {
                let responseStatus;
                const postsUserRespondedTo = user.postsUserRespondedTo;
                for (let i = 0; i < postsUserRespondedTo.length; i++) {
                  if (postsUserRespondedTo[i].postId === post.id) {
                    responseStatus = postsUserRespondedTo[i].status;
                    break;
                  }
                }

                let postOwnerPhone = '';

                if (responseStatus === 'accepted') {
                  postOwnerPhone = postOwner.phone;
                }

                res.send({
                  status: 'ok',
                  post: post,
                  userName: postOwner.name,
                  userSurname: postOwner.surname,
                  userGrade: postOwner.grade,
                  userPfp: postOwner.pfp,
                  userPhone: postOwnerPhone,
                  responseStatus: responseStatus
                })
              } else {
                res.send({status: 'error'});
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
  }
});



function generateResponses(requestUser, user) {
  let responses = [];
  requestUser.usersRespondedToUser.forEach(e => {
    if (e.userId === user.id) {
      responses.push(e);
    }
  })

  const newResponses = responses.map(response => {
    return new Promise((resolve, reject) => {
      Post.findOne({id: response.postId})
      .then(post => {
        if (post !== null) {
          resolve({
            title: post.title,
            postId: post.id,
            postStatus: post.status,
            status: response.status
          })
        } else {
          reject();
        }
      })
    })
  });

  return newResponses;
}

app.post('/respond', urlencodedParser, parseData, checkSignin, checkIfUserIsVerified, checkIfUserIsUnbanned, checkIfPostIsntComplete, function(req, res) {
  const data = req.app.locals.data;
  const user = req.app.locals.user;

  if (data[0] === 'add') {
    Post.findOne({id: data[1]})
    .then(post => {
      if (post !== null) {
        User.findOne({id: post.userId})
        .then(postOwner => {
          if (postOwner !== null && checkIfUserBanEnded(postOwner.id, postOwner.banned) === true) {
            if (user.id !== postOwner.id) {
              let arr1 = user.postsUserRespondedTo;
              let arr2 = postOwner.usersRespondedToUser;

              const check1 = arr1.some(e => e.postId === post.id);
              const check2 = arr2.some(e => e.postId === post.id && e.userId === user.id);

              
              if (check1 && check2) {
                res.send({
                  status: 'already_responded'
                });
              } else if ((!check1 && check2) || (check1 && !check2)) {
                res.send({
                  status: 'error'
                });
              } else {
                arr1.push({
                  postId: post.id,
                  status: 'pending'
                })
    
                udpateUser(user.id, {
                  postsUserRespondedTo: arr1
                })
    
                arr2.push({
                  userId: user.id,
                  postId: post.id,
                  status: 'pending'
                })

                udpateUser(postOwner.id, {
                  usersRespondedToUser: arr2
                })

                res.send({ status: 'ok' });
              }
            } else {
              res.send({ status: 'error' });
            }
          } else {
            res.send({ status: 'error' });
          }
        })
      } else {
        res.send({ status: 'error' });
      }
    })
  }

  if (data[0] === 'accept') {
    User.findOne({id: user.id})
    .then(postOwner => {
      Post.findOne({id: data[1]})
      .then(post => {
        if (post !== null) {
          let temp = postOwner.usersRespondedToUser;
          let indexToShift;
          let usersToUpdate = [];

          for (let i = temp.length - 1; i >= 0; i--) {
            if (temp[i].postId === post.id && temp[i].userId === data[2]) {
              temp[i].status = 'accepted';
              usersToUpdate.push(temp[i].userId);
              indexToShift = i;
            } else if (temp[i].postId === post.id && temp[i].userId !== data[2]) {
              temp[i].status = 'declined';
              usersToUpdate.push(temp[i].userId);
            }
          }

          temp.unshift(temp.splice(indexToShift, 1)[0]);

          udpateUser(postOwner.id, {
            usersRespondedToUser: temp
          }).then(result => {
            if (result === 'success') {
              let updates = [];

              for (let i = 0; i < usersToUpdate.length; i++) {
                updates.push(new Promise((resolve, reject) => {
                  User.findOne({id: usersToUpdate[i]})
                  .then(user => {
                    if (user !== null) {
                      let temp = user.postsUserRespondedTo;

                      for (let i = 0; i < temp.length; i++) {
                        if (temp[i].postId === post.id) {
                          if (user.id === data[2]) {
                            temp[i].status = 'accepted';
                          } else {
                            temp[i].status = 'declined';
                          }
                          break;
                        }
                      }



                      udpateUser(user.id, {
                        postsUserRespondedTo: temp
                      }).then(result1 => {
                        if (result1 === 'success') {
                          resolve();
                        } else {
                          reject('error');
                        }
                      })
                    } else {
                      reject('usr_not_found');
                    }
                  })
                }))
              }

              updates.push(Post.updateOne({id: post.id}, {$set: {
                status: 'in_progress'
              }}))

              Promise.all(updates)
              .then(() => {
                res.send({ status: 'ok' });
              }).catch(error => {
                res.send({ status: 'error' });
              })

            } else {
              res.send({ status: 'error' });
            }
          })

        } else {
          res.send({ status: 'error' });
        }
      })
    })
  }

  if (data[0] === 'decline') {
    User.findOne({id: user.id})
    .then(postOwner => {
      Post.findOne({id: data[1]})
      .then(post => {
        if (post !== null) {
          let temp = postOwner.usersRespondedToUser;
          let indexToShift;
          let userToUpdate;

          for (let i = temp.length - 1; i >= 0; i--) {
            if (temp[i].postId === post.id && temp[i].userId === data[2]) {
              temp[i].status = 'declined';
              userToUpdate = temp[i].userId;
              indexToShift = i;
              break;
            }
          }

          temp.push(temp.splice(indexToShift, 1)[0]);

          udpateUser(postOwner.id, {
            usersRespondedToUser: temp
          }).then(result => {
            if (result === 'success') {
              User.findOne({id: userToUpdate})
              .then(user => {
                if (user !== null) {
                  let temp = user.postsUserRespondedTo;

                  for (let i = 0; i < temp.length; i++) {
                    if (temp[i].postId === post.id) {
                      temp[i].status = 'declined';
                      break;
                    }
                  }

                  udpateUser(user.id, {
                    postsUserRespondedTo: temp
                  }).then(result1 => {
                    if (result1 === 'success') {
                      res.send({ status: 'ok' });
                    } else {
                      res.send({ status: 'error' });
                    }
                  })
                } else {
                  res.send({ status: 'error' });
                }
              })

            } else {
              res.send({ status: 'error' });
            }
          })

        } else {
          res.send({ status: 'error' });
        }
      })
    })
  }

  if (data[0] === 'cancel') {
    User.findOne({id: user.id})
    .then(postOwner => {
      Post.findOne({id: data[1]})
      .then(post => {
        if (post !== null) {
          let temp = postOwner.usersRespondedToUser;
          let usersToUpdate = [];

          for (let i = temp.length - 1; i >= 0; i--) {
            if (temp[i].postId === post.id) {
              temp[i].status = 'pending';
              usersToUpdate.push(temp[i].userId);
            }
          }

          udpateUser(postOwner.id, {
            usersRespondedToUser: temp
          }).then(result => {
            if (result === 'success') {
              let updates = [];

              for (let i = 0; i < usersToUpdate.length; i++) {
                updates.push(new Promise((resolve, reject) => {
                  User.findOne({id: usersToUpdate[i]})
                  .then(user => {
                    if (user !== null) {
                      let temp = user.postsUserRespondedTo;

                      for (let i = 0; i < temp.length; i++) {
                        if (temp[i].postId === post.id) {
                          temp[i].status = 'pending';
                          break;
                        }
                      }


                      udpateUser(user.id, {
                        postsUserRespondedTo: temp
                      }).then(result1 => {
                        if (result1 === 'success') {
                          resolve();
                        } else {
                          reject('error');
                        }
                      })
                    } else {
                      reject('usr_not_found');
                    }
                  })
                }))
              }

              updates.push(Post.updateOne({id: post.id}, {$set: {
                status: 'pending'
              }}))

              Promise.all(updates)
              .then(() => {
                res.send({ status: 'ok' });
              }).catch(error => {
                res.send({ status: 'error' });
              })

            } else {
              res.send({ status: 'error' });
            }
          })

        } else {
          res.send({ status: 'error' });
        }
      })
    })
  }
});

app.post('/getresponsestouser', urlencodedParser, parseData, checkSignin, checkIfUserIsUnbanned, function(req, res) {
  const data = req.app.locals.data;

  if (data[0] === 'viewpost_page') {
    const postOwner = req.app.locals.user;
    const postId = data[1];
    let responses = [];

    postOwner.usersRespondedToUser.map(e => {
      if (e.postId === postId) {
        const promise = new Promise((resolve, reject) => {
          User.findOne({id: e.userId})
          .then(user => {
            
            resolve({
              userId: user.id,
              userName: user.name,
              userSurname: user.surname,
              userGrade: user.grade,
              userRole: user.role,
              userPfp: user.pfp,
              status: e.status,
              banned: user.banned
            })
          })
        })

        responses.push(promise);
      }
    })

    Promise.all(responses)
    .then(responses => {
      for (let i = responses.length - 1; i >= 0; i--) {
        if (checkIfUserBanEnded(responses[i].userId,responses[i].banned) === false) {
          responses.splice(i, 1)
        }
      }

      res.send({
        status: 'ok',
        responses: responses
      })
    }).catch(error => {
      res.send({ status: 'error' });
    })
  }

  if (data[0] === 'view_user_page') {
    const requestUser = req.app.locals.user;

      User.findOne({id: data[1]})
      .then(user => {
        if (user !== null && checkIfUserBanEnded(user.id, user.banned) === true) {
          Promise.all(generateResponses(requestUser, user))
          .then(userReponsesToLoggedin => {
            Promise.all(generateResponses(user, requestUser))
            .then(loggedinResponsesToUser => {
              const sorted1 = _.orderBy(userReponsesToLoggedin, ['postStatus', 'status'], ['desc', 'asc']);
              const sorted2 = _.orderBy(loggedinResponsesToUser, ['postStatus', 'status'], ['desc', 'asc']);

              res.send({
                status: 'ok',
                userReponsesToLoggedin: sorted1,
                loggedinResponsesToUser: sorted2
              })
            }).catch(err => {
              res.send({status: 'error'})
            })
          }).catch(err => {
            res.send({status: 'error'})
          })
        } else {
          res.send({
            status: 'error'
          })
        }
      })
  }
});



function saveReport(target, type, action, userId) {
  return new Promise((resolve) => {
    if (target !== null) {
      const targetUserId = type === 'post' ? target.userId : target.id;
      if (targetUserId !== userId) {
        if (action === 'add') {
          const newReport = new Report({
            id: uuidv4(),
            userId: userId,
            targetType: type,
            targetId: target.id,
            status: 'pending'
          });
          newReport.save();
        }
  
        resolve({
          status: 'ok'
        });
      } else {
        resolve({
          status: 'error'
        });
      }
    } else {
      resolve({
        status: 'error'
      });
    }
  })
}

app.post('/report', urlencodedParser, parseData, checkSignin, checkIfUserIsVerified, checkIfUserIsUnbanned, function(req, res) {
  const data = req.app.locals.data;
  const user = req.app.locals.user;

  if (data[1] === 'post') {
    Post.findOne({id: data[2]})
    .then(post => {
      saveReport(post, 'post', data[0], user.id)
      .then(result => res.send(result));
    })
  }

  if (data[1] === 'user') {
    User.findOne({id: data[2], verified: true})
    .then(user1 => {
      if (checkIfUserBanEnded(user1.id, user1.banned) === true) {
        saveReport(user1, 'user', data[0], user.id)
        .then(result => res.send(result));
      }
    })
  }

  if (data[0] === 'dismiss') {
    Report.deleteOne({id: data[1]})
    .then(result => {
      if (result.deletedCount === 1) {
        res.send({status: 'ok'});
      } else {
        res.send({status: 'error'});
      }
    })
  }
});

app.post('/deletepost', urlencodedParser, parseData, checkSignin, checkIfUserIsVerified, checkIfUserIsUnbanned, checkIfUserIsModerator, function(req, res) {
  const data = req.app.locals.data;

  deletePost(data[0], res);
});



function generateUsers(users, pageNumber) {
  const postsPerPage = parseInt(process.env.POSTS_PER_PAGE);
  const start = pageNumber * postsPerPage;
  const usersAmount = users.length - 1;
  const fEnd = start + postsPerPage - 1;
  let end = fEnd > usersAmount ? usersAmount : fEnd;

  let newUsers = [];

  for (let i = start; i <= end; i++) {
    const currentUser = users[i];

    if (userHasEmptyFields(currentUser) === false && currentUser.verified === true && checkIfUserBanEnded(currentUser.id, currentUser.banned) === true) {
      const newUser = {
        id: currentUser.id,
        pfp: currentUser.pfp,
        name: currentUser.name,
        surname: currentUser.surname,
        grade: currentUser.grade,
        role: currentUser.role,
        bio: currentUser.bio,
        subjectsCanHelp: currentUser.subjectsCanHelp,
        subjectsNeedHelp: currentUser.subjectsNeedHelp,
      };
  
      newUsers.push(newUser);
    } else {
      const newEnd = end + 1;
      if (newEnd < usersAmount) {
        end = newEnd;
      }
    }
    
  }

  return newUsers;
}

app.post('/getusers', urlencodedParser, parseData, checkSignin, checkIfUserIsUnbanned, function(req, res) {
  const data = req.app.locals.data;

  if (data[0] === 'users_page') {
    const pageNumber = data[1] - 1;
    const postsPerPage = parseInt(process.env.POSTS_PER_PAGE);
  
    let query = {
      verified: true
    };
    if (data[2] !== null && data[2] !== '') {
      query = {
        verified: true,
        $text: {$search: data[2]}
      };
    }
  
    User.find(query)
    .then(users => {
      const newUsers = generateUsers(users, pageNumber);
  
      if (newUsers !== 'error') {
        res.send({
          status: 'ok',
          users: generateUsers(users, pageNumber),
          amountOfPages: Math.ceil(users.length/postsPerPage)
        })
      } else {
        res.send({
          status: 'error',
          users: [],
          amountOfPages: 1
        })
      }
    })
  }

  if (data[0] === 'view_user_page') {
    const requestUser = req.app.locals.user;

    User.findOne({id: data[1]})
    .then(user => {
      if (user !== null && checkIfUserBanEnded(user.id, user.banned) === true) {
        let phoneNumber = undefined;
        const check1 = user.usersRespondedToUser.some(e => e.userId === requestUser.id && e.status === 'accepted');
        const check2 = requestUser.usersRespondedToUser.some(e => e.userId === user.id && e.status === 'accepted');
        if (check1 || check2) {
          phoneNumber = user.phone;
        }

        const newUser = {
          id: user.id,
          pfp: user.pfp,
          name: user.name,
          surname: user.surname,
          grade: user.grade,
          role: user.role,
          bio: user.bio,
          phone: phoneNumber,
          subjectsCanHelp: user.subjectsCanHelp,
          subjectsNeedHelp: user.subjectsNeedHelp
        }
        
        res.send({
          status: 'ok',
          user: newUser
        })
      } else {
        res.send({
          status: 'error'
        })
      }
    })
  }
});



function generateJobsPosts(user, posts) {
  let responsesAmounts = {};
  user.usersRespondedToUser.forEach(response => {
    const currentId = response.postId;
    if (isNaN(responsesAmounts[currentId])) {
      responsesAmounts[currentId] = 1;
    } else {
      responsesAmounts[currentId] += 1;
    }
  })


  const newPosts = posts.map(post => {
    const responsesAmount = responsesAmounts[post.id] === undefined ? 0 : responsesAmounts[post.id];
    return {
      id: post.id,
      title: post.title,
      status: post.status,
      responsesAmount: responsesAmount
    }
  })

  return newPosts;
}

function generateJobsResponses(user) {
  const responses = user.postsUserRespondedTo.map(response => {
    return new Promise((resolve, resject) => {
      Post.findOne({id: response.postId})
      .then(post => {
        User.findOne({id: post.userId})
        .then(postOwner => {
          const newResponse = {
            post: {
              id: post.id,
              title: post.title,
              status: post.status
            },
            user: {
              id: postOwner.id,
              pfp: postOwner.pfp,
              name: postOwner.name,
              surname: postOwner.surname,
              grade: postOwner.grade,
              role: postOwner.role,
              banned: postOwner.banned
            },
            status: response.status
          };

          resolve(newResponse);
        })
      })
    })
  });

  return new Promise((resolve, reject) => {
    Promise.all(responses)
    .then(newResponses => {
      for (let i = responses.length - 1; i >= 0; i--) {
        if (checkIfUserBanEnded(newResponses[i].user.id, newResponses[i].user.banned) === false) {
          newResponses.splice(i, 1);
        }
      }

      resolve(newResponses);
    })
  });
}

app.get('/getuserjobs', urlencodedParser, checkSignin, checkIfUserIsUnbanned, function(req, res) {
  const user = req.app.locals.user;

  Post.find({userId: user.id})
  .then(posts => {
    generateJobsResponses(user)
    .then(newResponses => {
      const newPosts = generateJobsPosts(user, posts);
      const sortedPosts = _.orderBy(newPosts, ['status'], ['desc']);

      const sortedResponses = _.orderBy(newResponses, ['post.status', 'status'], ['desc', 'asc']);

      res.send({
        status: 'ok',
        userPosts: sortedPosts,
        userResponses: sortedResponses
      })
    })
  })
});



function generateUnverifiedUsers(users) {
  let newUsers = [];
  
  users.forEach(user => {
    if (checkIfUserBanEnded(user.id, user.banned) === true) {
      newUsers.push({
        id: user.id,
        name: user.name,
        surname: user.surname,
        grade: user.grade,
        pfp: user.pfp,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        role: user.role
      })
    }
  })

  return newUsers;
}

function generateReports(reports) {
  const newReports = reports.map(report => {
    return new Promise((resolve, reject) => {
      User.findOne({id: report.userId})
      .then(reportOwner => {
        const newReportOwner = {
          id: reportOwner.id,
          pfp: reportOwner.pfp,
          name: reportOwner.name,
          surname: reportOwner.surname,
          grade: reportOwner.grade,
          role: reportOwner.role,
          banned: reportOwner.banned
        };

        if (report.targetType === 'user') {
          User.findOne({id: report.targetId})
          .then(user => {
            resolve({
              id: report.id,
              type: 'user',
              reportOwner: newReportOwner,
              user: {
                id: user.id,
                pfp: user.pfp,
                name: user.name,
                surname: user.surname,
                grade: user.grade,
                role: user.role,
                banned: user.banned
              }
            })
          })
        }

        if (report.targetType === 'post') {
          Post.findOne({id: report.targetId})
          .then(post => {
            resolve({
              id: report.id,
              type: 'post',
              reportOwner: newReportOwner,
              post: {
                id: post.id,
                title: post.title,
                userId: post.userId
              }
            })
          })
        }
      })
    }) 
  })

  return new Promise((resolve, reject) => {
    Promise.all(newReports)
    .then(newReports => {
      for (let i = newReports.length - 1; i >= 0; i--) {
        const reportOwner = newReports[i].reportOwner;
        
        if (newReports[i].type === 'post') {
          if (checkIfUserBanEnded(reportOwner.id, reportOwner.banned) === false) {
            newReports.splice(i, 1);
          }
        } else {
          const targetUser = newReports[i].user;
          if (checkIfUserBanEnded(reportOwner.id, reportOwner.banned) === false || checkIfUserBanEnded(targetUser.id, targetUser.banned) === false) {
            newReports.splice(i, 1);
          }
        }
      }

      resolve(newReports)
    })
  });
}

app.get('/getusersandreports', urlencodedParser, checkSignin, checkIfUserIsModerator, checkIfUserIsUnbanned, function(req, res) {
  User.find({
    verified: false,
    pfp: {$ne: undefined},
    name: {$ne: undefined},
    surname: {$ne: undefined},
    bio: {$ne: undefined},
    phone: {$ne: undefined},
    grade: {$ne: undefined}
  })
  .then(users => {
    Report.find()
    .then(reports => {
      const newUsers = generateUnverifiedUsers(users);
      const newReports = generateReports(reports);

      newReports
      .then(newReports => {
        res.send({
          status: 'ok',
          users: newUsers,
          reports: newReports
        })
      })
    })
  })
});

app.post('/verifyuser', urlencodedParser, checkSignin, checkIfUserIsModerator, checkIfUserIsUnbanned, parseData, function(req, res) {
  const data = req.app.locals.data;

  udpateUser(data[0], {verified: true})
  .then(result => {
    if (result === 'success') {
      res.send({status: 'ok'});
    } else {
      res.send({status: 'error'});
    }
  })
});

app.post('/banuser', urlencodedParser, checkSignin, checkIfUserIsModerator, checkIfUserIsUnbanned, parseData, function(req, res) {
  const data = req.app.locals.data;
  const duration = data[1];

  let expirationDate = new Date();
  if (duration === 'day') {
    expirationDate.setDate(expirationDate.getDate() + 1);
  }

  if (duration === 'week') {
    expirationDate.setDate(expirationDate.getDate() + 7);
  }

  if (duration === 'forever') {
    expirationDate = 'forever'
  }

  udpateUser(data[0], {banned: expirationDate})
  .then(result => {
    if (result === 'success') {
      res.send({status: 'ok'});
    } else {
      res.send({status: 'error'});
    }
  })
});

// console.log(encryptPassword('123456'))

var server = app.listen(process.env.PORT, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at localhost:%s', port);
});