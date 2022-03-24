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
const routes = ['/', '/signin', '/signup', '/authorization', '/userpreferences', '/work', '/editpost', '/viewpost'];
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

const reportSchema = new mongoose.Schema({
  id: String,
  userId: String,
  targetType: String,
  targetId: String
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
  User.findOne({id: req.session.userId})
  .then(user => {
    if (user !== null) {
      db.collection('sessions').findOne({ 'session.sessionId': req.session.sessionId })
      .then(session => {
        if (session !== null) {
          if (session.session.userId === user.id) {
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

function checkReqSize(req, res, next) {
  if (req.socket.bytesRead > 2000000) {
    res.send({status: 'error'});
  } else {
    next();
  }
}

function checkIfUserOwnsPost(req, res, next) {
  const data = req.app.locals.data;

  if (data[0] === 'new') {
    next();
  } else {
    Post.findOne({id: data[1]})
    .then(post => {
      if (post !== null) {
        if (post.userId === req.session.userId) {
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
    
          resolve(post);
        })
      } else {
        reject();
      }
    })

    newPosts.push(promise);
  }

  return newPosts;
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
              subjectsCanHelp: user.subjectsCanHelp,
              postsUserRespondedTo: user.postsUserRespondedTo,
              usersRespondedToUser: user.usersRespondedToUser
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
          subjectsCanHelp: user.subjectsCanHelp,
          postsUserRespondedTo: user.postsUserRespondedTo,
          usersRespondedToUser: user.usersRespondedToUser
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
  })
});


app.post('/handlepost', urlencodedParser, parseData, checkSignin, checkIfUserOwnsPost, function(req, res) {
  const data = req.app.locals.data;

  if (data[0] === 'new') {
    const newPost = new Post({
      id: uuidv4(),
      userId: req.session.userId,
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
      if (result.nModified === 1) {
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
    Post.findOne({id: data[1]})
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
                      console.log(error);
                      res.send({ status: 'error' });
                    })


                  } else {
                    res.send({ status: 'error' });
                  }
                })
              } else {
                res.send({ status: 'ok' });
              }
            })
          } else {
            res.send({ status: 'error'  });
          }
        })
      } else {
        res.send({ status: 'error' });
      }
    })
  }
});

app.post('/getposts', urlencodedParser, parseData, checkSignin, function(req, res) {
  const data = req.app.locals.data;
  const reqSource = data[0];
  const pageNumber = data[1] - 1;
  const postsPerPage = parseInt(process.env.POSTS_PER_PAGE);

  if (reqSource === 'workpage_list') {
    let query = {};
    if (data[2] !== null && data[2] !== '') {
      query = {$text: {$search: data[2]}};
    }

    Post.find(query)
    .then(posts => {
      Promise.all(generatePosts(posts, pageNumber))
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
        if (post.userId === req.session.userId) {
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
    User.findOne({id: req.session.userId})
    .then(user => {
      if (user !== null) {
        Post.findOne({id: data[1]})
        .then(post => {
          if (post !== null) {
            User.findOne({id: post.userId})
            .then(postOwner => {
              if (postOwner !== null) {
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

app.post('/respond', urlencodedParser, parseData, checkSignin, function(req, res) {
  const data = req.app.locals.data;

  if (data[0] === 'add') {
    User.findOne({id: req.session.userId})
    .then(user => {
      Post.findOne({id: data[1]})
      .then(post => {
        if (post !== null) {
          User.findOne({id: post.userId})
          .then(postOwner => {
            if (postOwner !== null) {
              if (user.id !== postOwner.id) {
                if (data[0] === 'add') {
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
    })
  }

  if (data[0] === 'accept') {
    User.findOne({id: req.session.userId})
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
    User.findOne({id: req.session.userId})
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
    User.findOne({id: req.session.userId})
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

app.post('/report', urlencodedParser, parseData, checkSignin, function(req, res) {
  const data = req.app.locals.data;

  User.findOne({id: req.session.userId})
  .then(user => {
    if (data[1] === 'post') {
      Post.findOne({id: data[2]})
      .then(post => {
        if (post !== null) {
          if (post.userId !== user.id) {
            if (data[0] === 'add') {
              const newReport = new Report({
                id: uuidv4(),
                userId: req.session.userId,
                targetType: data[1],
                targetId: post.id
              });
              newReport.save();
            }

            res.send({
              status: 'ok'
            });
          } else {
            res.send({
              status: 'error'
            });
          }
        } else {
          res.send({
            status: 'error'
          });
        }
      })
    }
  })

});

app.post('/getresponsestouser', urlencodedParser, parseData, checkSignin, function(req, res) {
  const data = req.app.locals.data;

  if (data[0] === 'viewpost_page') {
    const postId = data[1];
    let responses = [];

    User.findOne({id: req.session.userId})
    .then(postOwner => {
      
      postOwner.usersRespondedToUser.forEach(e => {
        if (e.postId === postId) {
          const promise = new Promise((resolve, reject) => {
            User.findOne({id: e.userId})
            .then(user => {
              
              resolve({
                userId: user.id,
                userName: user.name,
                userSurname: user.surname,
                userGrade: user.grade,
                userPfp: user.pfp,
                status: e.status
              })
            })
          })

          responses.push(promise);
        }
      })

      Promise.all(responses)
      .then(responses => {
        res.send({
          status: 'ok',
          responses: responses
        })
      }).catch(error => {
        res.send({ status: 'error' });
      })
    })


  }
});

var server = app.listen(8888, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at localhost:%s', port);
});