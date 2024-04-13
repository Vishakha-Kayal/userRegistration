var express = require('express');
var router = express.Router();
const User = require('./users');
const bcrypt = require('bcryptjs');
const upload = require('./multer')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register',upload.single('uploadd'), async (req, res) => {
  const { fullname, username, password } = req.body;

  const imageelem = req.file.filename;
  console.log(imageelem);
  try {
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: fullname,
      username: username,
      password: hashedPassword,
      uimage:imageelem
    });

    const savedUser = await newUser.save();
    req.session.username = newUser.username;

    console.log('User saved successfully:', savedUser);
    res.render('success',{ newUser : newUser});
  } catch (error) {
    console.error('Error saving user:', error);
    // Handle errors appropriately
    res.status(500).send('Error registering user');
  }
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username: username })

  if (!user) {
    return res.status(400).send('User not found');
  }
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(400).send('Invalid password');
  }
  
  req.session.username = user.username;
  res.redirect('/profile');

  // res.render({user})
  // res.send('User authenticated and logged in successfully')
  // res.redirect('/')
})

router.get('/profile', async (req, res) => {
  const username = req.session.username;

  if (!username) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const user = await User.findOne({ username: username });

    const loggedinn = await isLoggedIn(req);

    // console.log(user);
    res.render('profile', { loggedIn: loggedinn ,assosciatedUser:user});
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Error fetching user details');
  }
});

router.get('/check', isAuthenticated, async (req, res) => {
  res.render('success')
})

async function isLoggedIn(req) {
  const username = req.session.username;
  if (!username) {
    return false;
  }

  try {
    const user = await User.findOne({ username: username });
    if (user) {
      console.log("hey");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return false;
  }
}


function isAuthenticated(req, res, next) {
  if (req.session.username) {
    return next();
  } else {
    res.redirect('/')
  }
}













// router.get('/profile', function(req, res) {
//   const username = req.session.username;
//   if (!username) {
//     return res.status(401).send('Unauthorized');
//   }

//   User.findOne({ username: username }, (err, user) => {
//     if (err || !user) {
//       return res.status(500).send('Error fetching user details');
//     }

//     res.render('profile', { username: user.username, fullname: user.name });
//   });
//   // res.render('profile', { username });
// });


module.exports = router;
