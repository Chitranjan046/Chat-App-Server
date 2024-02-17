const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if a user with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

    // Create a new user
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });

    // Generate JWT token
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
        id: createdUser._id,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare passwords
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (!passOk) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: 'none', secure: true }).json({
        id: foundUser._id,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Clear the JWT token cookie
    res.cookie('token', '', { sameSite: 'none', secure: true }).json('Logged out successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
