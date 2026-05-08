require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database Configuration
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '123456',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'abc',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Initialize database connection pool
let pool;
sql.connect(dbConfig).then(p => {
  pool = p;
  console.log('Connected to SQL Server');
}).catch(err => {
  console.error('Database connection failed:', err);
});

// Helper function to execute queries
async function executeQuery(query, params = []) {
  try {
    const request = pool.request();
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('SQL error:', err);
    throw err;
  }
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ====================== DONATION ROUTES ====================== //

// Get donation options
app.get('/api/donation-options', async (req, res) => {
  try {
    const options = await executeQuery(`
      SELECT 
        title, amount, description, 
        popular, active, created_at, updated_at
      FROM donation_options
      WHERE active = 1
      ORDER BY amount ASC
    `);

    // Parse features from JSON string if stored that way
    const formattedOptions = options.map(option => ({
      ...option,
      features: option.features ? JSON.parse(option.features) : []
    }));

    res.json(formattedOptions);
  } catch (error) {
    console.error('Error fetching donation options:', error);
    res.status(500).json({ 
      message: 'Server error fetching donation options',
      error: error.message 
    });
  }
});

// Process donation
app.post('/api/donations', authenticateToken, async (req, res) => {
  try {
    const { 
      amount, 
      isRecurring, 
      paymentMethod, 
      donorName, 
      donorEmail, 
      donorMessage 
    } = req.body;

    // Validate input
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid donation amount' });
    }

    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) {
      return res.status(400).json({ message: 'Donation amount must be positive' });
    }

    // Save donation to database
    const newDonation = await executeQuery(
      `INSERT INTO donations (
        amount, is_recurring, payment_method, 
        donor_name, donor_email, donor_message, 
        status
      )
      OUTPUT INSERTED.id, INSERTED.amount, INSERTED.created_at
      VALUES (
        @amount, @isRecurring, @paymentMethod,
        @donorName, @donorEmail, @donorMessage,
        'pending'
      )`,
      [
        { name: 'amount', type: sql.Decimal(10, 2), value: numericAmount },
        { name: 'isRecurring', type: sql.Bit, value: isRecurring || 0 },
        { name: 'paymentMethod', type: sql.NVarChar, value: paymentMethod },
        { name: 'donorName', type: sql.NVarChar, value: donorName || null },
        { name: 'donorEmail', type: sql.NVarChar, value: donorEmail || null },
        { name: 'donorMessage', type: sql.NVarChar, value: donorMessage || null }
      ]
    );

    // Simulate successful payment
    await executeQuery(
      `UPDATE donations SET status = 'completed' WHERE id = @donationId`,
      [{ name: 'donationId', type: sql.Int, value: newDonation[0].id }]
    );

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully',
      donation: newDonation[0]
    });
  } catch (error) {
    console.error('Donation processing error:', error);
    res.status(500).json({ 
      message: 'Server error processing donation',
      error: error.message 
    });
  }
});

// Get user donation history (filtered by donor email)
app.get('/api/donations/history', authenticateToken, async (req, res) => {
  try {
    // Get user's email first
    const user = await executeQuery(
      'SELECT email FROM users WHERE id = @userId',
      [{ name: 'userId', type: sql.Int, value: req.user.userId }]
    );
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const donations = await executeQuery(
      `SELECT 
        id, amount, is_recurring as isRecurring, payment_method as paymentMethod, 
        created_at as createdAt, status 
       FROM donations 
       WHERE donor_email = @email
       ORDER BY created_at DESC`,
      [{ name: 'email', type: sql.NVarChar, value: user[0].email }]
    );

    res.json({ donations });
  } catch (error) {
    console.error('Error fetching donation history:', error);
    res.status(500).json({ 
      message: 'Server error fetching donation history',
      error: error.message 
    });
  }
});

// ====================== AUTHENTICATION ROUTES ====================== //

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await executeQuery(
      'SELECT * FROM users WHERE email = @email',
      [{ name: 'email', type: sql.NVarChar, value: email }]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await executeQuery(
      `INSERT INTO users (name, email, password) 
       OUTPUT INSERTED.id, INSERTED.name, INSERTED.email
       VALUES (@name, @email, @password)`,
      [
        { name: 'name', type: sql.NVarChar, value: name },
        { name: 'email', type: sql.NVarChar, value: email },
        { name: 'password', type: sql.NVarChar, value: hashedPassword }
      ]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser[0].id, email: newUser[0].email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await executeQuery(
      'SELECT * FROM users WHERE email = @email',
      [{ name: 'email', type: sql.NVarChar, value: email }]
    );

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await executeQuery(
      'SELECT id, name, email FROM users WHERE id = @userId',
      [{ name: 'userId', type: sql.Int, value: req.user.userId }]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// ====================== STORIES & LESSONS ROUTES ====================== //

// Get all content with filtering
app.get('/api/stories', async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = `
      SELECT 
        id, title, type, summary, tags,
        CONVERT(VARCHAR, created_at, 100) AS formatted_date
      FROM ContentItems
      WHERE 1=1
    `;
    
    const params = [];
    
    if (type && type !== 'all') {
      query += ` AND type = @type`;
      params.push({ name: 'type', type: sql.NVarChar, value: type });
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const content = await executeQuery(query, params);
    
    res.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      message: 'Server error fetching content',
      error: error.message 
    });
  }
});

// Get single content item
app.get('/api/content/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Invalid content ID' });
    }

    const content = await executeQuery(
      `SELECT 
        id, title, type, summary, content_text, tags, 
        CONVERT(VARCHAR, created_at, 100) AS formatted_date
       FROM ContentItems
       WHERE id = @id`,
      [{ name: 'id', type: sql.Int, value: parseInt(id, 10) }]
    );

    if (content.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ content: content[0] });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      message: 'Server error fetching content',
      error: error.message 
    });
  }
});

// Bookmark endpoints
app.get('/api/bookmarks', authenticateToken, async (req, res) => {
  try {
    const bookmarks = await executeQuery(
      `SELECT content_id FROM Bookmarks WHERE user_id = @userId`,
      [{ name: 'userId', type: sql.Int, value: req.user.userId }]
    );
    
    res.json({ 
      bookmarks: bookmarks.map(b => b.content_id)
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ 
      message: 'Server error fetching bookmarks',
      error: error.message 
    });
  }
});

app.get('/api/bookmarks/check/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    
    const result = await executeQuery(
      `SELECT 1 FROM Bookmarks 
       WHERE user_id = @userId AND content_id = @contentId`,
      [
        { name: 'userId', type: sql.Int, value: req.user.userId },
        { name: 'contentId', type: sql.Int, value: parseInt(contentId) }
      ]
    );
    
    res.json({ 
      isBookmarked: result.length > 0
    });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    res.status(500).json({ 
      message: 'Server error checking bookmark',
      error: error.message 
    });
  }
});

app.post('/api/bookmarks/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    
    await executeQuery(
      `INSERT INTO Bookmarks (user_id, content_id)
       VALUES (@userId, @contentId)`,
      [
        { name: 'userId', type: sql.Int, value: req.user.userId },
        { name: 'contentId', type: sql.Int, value: parseInt(contentId) }
      ]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ 
      message: 'Server error adding bookmark',
      error: error.message 
    });
  }
});

app.delete('/api/bookmarks/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    
    await executeQuery(
      `DELETE FROM Bookmarks 
       WHERE user_id = @userId AND content_id = @contentId`,
      [
        { name: 'userId', type: sql.Int, value: req.user.userId },
        { name: 'contentId', type: sql.Int, value: parseInt(contentId) }
      ]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ 
      message: 'Server error removing bookmark',
      error: error.message 
    });
  }
});

// ====================== QUIZ ROUTES ====================== //

// Get quiz questions by difficulty
app.get('/api/quiz/questions', async (req, res) => {
  try {
    const { difficulty } = req.query;
    let query;
    
    if (difficulty === 'random') {
      query = `
        SELECT TOP 10 * FROM QuizQuestions
        ORDER BY NEWID()
      `;
    } else {
      query = `
        SELECT * FROM QuizQuestions
        WHERE difficulty = @difficulty
        ORDER BY NEWID()
      `;
    }

    const request = pool.request();
    if (difficulty !== 'random') {
      request.input('difficulty', sql.NVarChar, difficulty);
    }

    const result = await request.query(query);
    
    // Format options from JSON string to array
    const questions = result.recordset.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));

    res.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error fetching questions' });
  }
});

// Save quiz result
app.post('/api/quiz/results', authenticateToken, async (req, res) => {
  try {
    const { difficulty, score, totalQuestions } = req.body;
    const userId = req.user.userId;

    await executeQuery(
      `INSERT INTO QuizResults (user_id, difficulty, score, total_questions)
       VALUES (@userId, @difficulty, @score, @totalQuestions)`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'difficulty', type: sql.NVarChar, value: difficulty },
        { name: 'score', type: sql.Int, value: score },
        { name: 'totalQuestions', type: sql.Int, value: totalQuestions }
      ]
    );

    res.json({ message: 'Result saved successfully' });
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ message: 'Server error saving result' });
  }
});

// Get user's quiz history
app.get('/api/quiz/history', authenticateToken, async (req, res) => {
  try {
    const results = await executeQuery(
      `SELECT id, difficulty, score, total_questions, completed_at 
       FROM QuizResults 
       WHERE user_id = @userId
       ORDER BY completed_at DESC`,
      [{ name: 'userId', type: sql.Int, value: req.user.userId }]
    );

    res.json({ results });
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({ message: 'Server error fetching quiz history' });
  }
});

// ====================== FEELINGS ROUTES ====================== //

// Get surah suggestions based on feeling
app.get('/api/feelings/suggestions', async (req, res) => {
  try {
    const { feeling } = req.query;
    
    const suggestions = await executeQuery(`
      SELECT 
        s.surah_number,
        s.surah_name,
        a.ayat_number,
        a.ayat_text,
        f.explanation
      FROM FeelingSuggestions f
      JOIN Surahs s ON f.surah_id = s.id
      JOIN Ayats a ON f.ayat_id = a.id
      WHERE f.feeling = @feeling
      ORDER BY f.relevance_score DESC
    `, [{ name: 'feeling', type: sql.NVarChar, value: feeling }]);

    res.json({ suggestions });
  } catch (error) {
    console.error('Error fetching feeling suggestions:', error);
    res.status(500).json({ message: 'Server error fetching suggestions' });
  }
});

// ====================== TWEET ROUTES ====================== //

// Create a tweet
app.post('/api/tweets', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!content || content.length > 280) {
      return res.status(400).json({ 
        message: 'Tweet must be between 1 and 280 characters' 
      });
    }

    // Create tweet
    const newTweet = await executeQuery(
      `INSERT INTO tweets (user_id, content)
       OUTPUT INSERTED.id, INSERTED.content, INSERTED.created_at
       VALUES (@userId, @content)`,
      [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'content', type: sql.NVarChar, value: content }
      ]
    );

    // Get user details to include in response
    const user = await executeQuery(
      'SELECT name, email FROM users WHERE id = @userId',
      [{ name: 'userId', type: sql.Int, value: userId }]
    );

    res.status(201).json({
      ...newTweet[0],
      name: user[0].name,
      email: user[0].email
    });
  } catch (error) {
    console.error('Tweet creation error:', error);
    res.status(500).json({ message: 'Server error creating tweet' });
  }
});

// Get all tweets
app.get('/api/tweets', async (req, res) => {
  try {
    const tweets = await executeQuery(`
      SELECT t.id, t.content, t.created_at, u.name, u.email
      FROM tweets t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);

    res.json({ tweets });
  } catch (error) {
    console.error('Tweets fetch error:', error);
    res.status(500).json({ message: 'Server error fetching tweets' });
  }
});

// Get a single tweet
app.get('/api/tweets/:id', async (req, res) => {
  try {
    const tweet = await executeQuery(`
      SELECT t.id, t.content, t.created_at, u.name, u.email
      FROM tweets t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = @id
    `, [{ name: 'id', type: sql.Int, value: req.params.id }]);

    if (tweet.length === 0) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    res.json(tweet[0]);
  } catch (error) {
    console.error('Tweet fetch error:', error);
    res.status(500).json({ message: 'Server error fetching tweet' });
  }
});

// Delete a tweet
app.delete('/api/tweets/:id', authenticateToken, async (req, res) => {
  try {
    // First check if tweet exists and belongs to user
    const tweet = await executeQuery(
      'SELECT user_id FROM tweets WHERE id = @id',
      [{ name: 'id', type: sql.Int, value: req.params.id }]
    );

    if (tweet.length === 0) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    if (tweet[0].user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this tweet' });
    }

    // Delete the tweet
    await executeQuery(
      'DELETE FROM tweets WHERE id = @id',
      [{ name: 'id', type: sql.Int, value: req.params.id }]
    );

    res.json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    console.error('Tweet deletion error:', error);
    res.status(500).json({ message: 'Server error deleting tweet' });
  }
});

///read quran apiiiiiiii
app.get('/api/surah/:id', async (req, res) => {
  try {
    const surahId = parseInt(req.params.id);
    
    // Get surah info using the pool connection
    const surahResult = await pool.request()
      .input('surahNumber', sql.Int, surahId)
      .query('SELECT * FROM Surahs WHERE surah_number = @surahNumber');
    
    const surah = surahResult.recordset[0];
    
    if (!surah) {
      return res.status(404).json({ error: 'Surah not found' });
    }
    
    // Get all ayahs for this surah
    const ayatsResult = await pool.request()
      .input('surahId', sql.Int, surah.id)
      .query('SELECT * FROM Ayats WHERE surah_id = @surahId ORDER BY ayat_number');
    
    res.json({
      ...surah,
      ayats: ayatsResult.recordset
    });
    
  } catch (error) {
    console.error('Error fetching surah:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// server.js - Add these endpoints

// Get prayer times by location
app.get('/api/prayer-times', async (req, res) => {
  try {
    const { location } = req.query;
    
    // Example query - adjust based on your database schema
    const result = await pool.request()
      .input('location', sql.NVarChar, location || 'Lahore')
      .query(`
        SELECT TOP 1 
          date, location, fajr, sunrise, dhuhr, asr, maghrib, isha
        FROM PrayerTimes 
        WHERE location = @location
        ORDER BY date DESC
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Prayer times not found for this location' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Qibla direction by location
app.get('/api/qibla-direction', async (req, res) => {
  try {
    const { location } = req.query;
    
    // Example query - adjust based on your database schema
    const result = await pool.request()
      .input('location', sql.NVarChar, location || 'Lahore')
      .query(`
        SELECT 
          direction, degrees, distance, 
          CONCAT(location, ' to Mecca') as fromLocation
        FROM QiblaDirections
        WHERE location = @location
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Qibla direction not found for this location' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching qibla direction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
    
 
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});