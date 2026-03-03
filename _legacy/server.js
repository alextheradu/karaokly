require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4006;
const loginsFile = path.join(__dirname, 'logins.json');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Setup Nodemailer transporter for Gmail using your Gmail credentials.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'al3x.radu1@gmail.com', // your Gmail account
    pass: process.env.GMAIL_PASSWORD  // your app password
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'someSecretKey',
  resave: false,
  saveUninitialized: false
}));

// Utility functions for managing logins
function loadLogins() {
  if (!fs.existsSync(loginsFile)) {
    fs.writeFileSync(loginsFile, JSON.stringify([]));
  }
  const data = fs.readFileSync(loginsFile);
  return JSON.parse(data);
}

function saveLogins(logins) {
  fs.writeFileSync(loginsFile, JSON.stringify(logins, null, 2));
}

// -----------------
// SIGNUP ENDPOINT
// -----------------
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Validate that username is a valid email address.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const logins = loadLogins();

  if (logins.find(user => user.username === username)) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate email verification token (valid for 24 hours)
  const emailVerificationToken = crypto.randomBytes(20).toString('hex');
  const emailVerificationTokenExpiry = Date.now() + 24 * 3600 * 1000; // 24 hours

  const newUser = {
    username,
    password: hashedPassword,
    playlist: [],
    emailVerified: false,
    emailVerificationToken,
    emailVerificationTokenExpiry,
    partyMembers: [],
    isAdmin: false  // Flag to determine if the user is an admin
  };
  logins.push(newUser);
  saveLogins(logins);

  // Construct verification link
  const verificationLink = `${req.protocol}://${req.get('host')}/verify-email?token=${emailVerificationToken}`;

  // Send verification email from no-reply@karaokly.com
  const mailOptions = {
    from: 'Karaokly <no-reply@karaokly.com>',
    to: username,
    subject: 'Verify your email address',
    text: `Thank you for signing up for Karaokly.
Please verify your email by clicking on the following link:
${verificationLink}
This link is valid for 24 hours.
If you did not sign up, please ignore this email.`,
    html: `
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #e0e5ec; padding: 20px; }
            .card { max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
            h2 { color: #333; }
            p { font-size: 16px; color: #555; }
            .btn {
              display: inline-block;
              padding: 15px 25px;
              margin: 20px 0;
              font-size: 16px;
              color: #000;
              background: linear-gradient(45deg, #667eea, #764ba2);
              text-decoration: none;
              border-radius: 5px;
              transition: background 0.3s ease;
            }
            .btn:hover { background: linear-gradient(45deg, #5a67d8, #6b46c1); }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Welcome to Karaokly!</h2>
            <p>Thank you for signing up. To complete your registration, please verify your email address.</p>
            <a class="btn" href="${verificationLink}" style="color: white;">Verify Email</a>
            <p>This link is valid for 24 hours.<br>If you did not sign up, please ignore this email.</p>
          </div>
        </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
      return res.status(500).json({ error: 'Error sending verification email.' });
    }
    console.log('Verification email sent:', info.response);
    // Do not log the user in until they verify their email.
    return res.json({ success: true, message: 'Account created. Please check your email for a verification link.' });
  });
});

// -----------------
// LOGIN ENDPOINT
// -----------------
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const logins = loadLogins();

  const user = logins.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  
  if (!user.emailVerified) {
    return res.status(401).json({ error: 'Email not verified. Please check your email for the verification link.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.session.user = { username };
  return res.json({ success: true, username });
});

// --------------------------
// EMAIL VERIFICATION ENDPOINT
// --------------------------
app.get('/verify-email', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Invalid verification link.');
  }
  let logins = loadLogins();
  const user = logins.find(u => u.emailVerificationToken === token && u.emailVerificationTokenExpiry > Date.now());
  if (!user) {
    return res.status(400).send('Verification link is invalid or has expired.');
  }
  user.emailVerified = true;
  delete user.emailVerificationToken;
  delete user.emailVerificationTokenExpiry;
  saveLogins(logins);
  // Automatically log the user in
  req.session.user = { username: user.username };
  // Redirect to /app after verification
  return res.redirect('/app');
});

// --------------------------
// LOGIN STATUS CHECK
// --------------------------
app.get('/check-login', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// --------------------------
// LOGOUT ENDPOINT
// --------------------------
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// --------------------------
// PLAYLIST ENDPOINTS (USER)
// --------------------------
app.get('/playlist', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const logins = loadLogins();
  const user = logins.find(u => u.username === req.session.user.username);
  if (user) {
    return res.json({ playlist: user.playlist || [] });
  }
  res.status(404).json({ error: 'User not found.' });
});

app.post('/playlist/add', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const video = req.body.video; // expects { videoId, title }
  if (!video || !video.videoId || !video.title) {
    return res.status(400).json({ error: 'Invalid video object.' });
  }
  const logins = loadLogins();
  const user = logins.find(u => u.username === req.session.user.username);
  if (user) {
    user.playlist = user.playlist || [];
    if (!user.playlist.find(v => v.videoId === video.videoId)) {
      user.playlist.push(video);
      saveLogins(logins);
    }
    return res.json({ success: true, playlist: user.playlist });
  }
  res.status(404).json({ error: 'User not found.' });
});

app.post('/playlist/remove', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const videoId = req.body.videoId;
  if (!videoId) return res.status(400).json({ error: 'Missing videoId.' });

  const logins = loadLogins();
  const user = logins.find(u => u.username === req.session.user.username);
  if (user && user.playlist) {
    user.playlist = user.playlist.filter(v => v.videoId !== videoId);
    saveLogins(logins);
    return res.json({ success: true, playlist: user.playlist });
  }
  res.status(404).json({ error: 'User not found or no playlist.' });
});

app.post('/playlist/clear', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const logins = loadLogins();
  const user = logins.find(u => u.username === req.session.user.username);
  if (user) {
    user.playlist = [];
    saveLogins(logins);
    return res.json({ success: true, playlist: [] });
  }
  res.status(404).json({ error: 'User not found.' });
});

// --------------------------
// ASSIGN SONG TO PARTY MEMBER (USER)
// --------------------------
app.post('/playlist/assign', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const { videoId, assignedTo } = req.body;
  const logins = loadLogins();
  const user = logins.find(u => u.username === req.session.user.username);
  const song = user.playlist.find(item => item.videoId === videoId);
  if (song) {
    song.assignedTo = assignedTo || "";
    saveLogins(logins);
    return res.json({ success: true });
  } else {
    return res.json({ success: false, error: 'Song not found' });
  }
});

// --------------------------
// PARTY MEMBERS ENDPOINTS (USER)
// --------------------------
app.get('/party-members', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const logins = loadLogins();
  const user = logins.find(u => u.username === req.session.user.username);
  res.json({ partyMembers: user.partyMembers || [] });
});

app.post('/party-members/add', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const { member } = req.body;
  const logins = loadLogins();
  const user = logins.find(u => u.username === req.session.user.username);
  user.partyMembers = user.partyMembers || [];
  if (!user.partyMembers.includes(member)) {
    user.partyMembers.push(member);
    saveLogins(logins);
  }
  res.json({ success: true, partyMembers: user.partyMembers });
});

app.post('/party-members/remove', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const { member } = req.body;
  const logins = loadLogins();
  const user = logins.find(u => u.username === req.session.user.username);
  user.partyMembers = user.partyMembers.filter(m => m !== member);
  // Unassign any song assigned to that member
  user.playlist.forEach(song => {
    if (song.assignedTo === member) {
      song.assignedTo = "";
    }
  });
  saveLogins(logins);
  res.json({ success: true, partyMembers: user.partyMembers });
});

// --------------------------
// FORGOT PASSWORD & RESET PASSWORD ENDPOINTS
// --------------------------
app.post('/forgot-password', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Missing email.' });
  }
  const logins = loadLogins();
  const user = logins.find(u => u.username === username);
  if (!user) {
    // For security, do not reveal if the user exists.
    return res.json({ success: true, message: 'If that user exists, a password reset email has been sent.' });
  }
  
  // Generate token and expiry (1 hour)
  const token = crypto.randomBytes(20).toString('hex');
  const expiry = Date.now() + 3600000; // 1 hour
  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  saveLogins(logins);

  // Construct reset link
  const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;

  // Send reset email using Gmail SMTP
  const mailOptions = {
    from: 'Karaokly <no-reply@karaokly.com>',
    to: username,
    subject: 'Password Reset Request',
    text: `You are receiving this email because a password reset request was made for your account.
Please click on the following link, or paste it into your browser, to complete the process within one hour:
${resetLink}
If you did not request this, please ignore this email.`,
    html: `
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; background: #e0e5ec; padding: 20px; }
            .card { max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
            h2 { color: #333; }
            p { font-size: 16px; color: #555; }
            .btn {
              display: inline-block;
              padding: 15px 25px;
              margin: 20px 0;
              font-size: 16px;
              color: #000;
              background: linear-gradient(45deg, #667eea, #764ba2);
              text-decoration: none;
              border-radius: 5px;
              transition: background 0.3s ease;
            }
            .btn:hover { background: linear-gradient(45deg, #5a67d8, #6b46c1); }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Password Reset</h2>
            <p>You are receiving this email because a password reset request was made for your account.</p>
            <a class="btn" href="${resetLink}">Reset Password</a>
            <p>Please complete this process within one hour.<br>If you did not request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending reset email:', error);
      return res.status(500).json({ error: 'Error sending email.' });
    }
    console.log('Password reset email sent:', info.response);
    return res.json({ success: true, message: 'If that user exists, a reset email has been sent.' });
  });
});

app.post('/reset-password', async (req, res) => {
  const { newPassword, token } = req.body;
  if (req.session.user) {
    // Logged-in user: change password directly
    const username = req.session.user.username;
    let logins = loadLogins();
    const user = logins.find(u => u.username === username);
    if (!user) {
      console.error("Reset password: user not found for", username);
      return res.status(404).json({ error: 'User not found.' });
    }
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      delete user.resetToken;
      delete user.resetTokenExpiry;
      saveLogins(logins);
      console.log(`Password updated for user ${username}`);
      return res.json({ success: true });
    } catch (error) {
      console.error("Reset password error for user", username, ":", error);
      return res.status(500).json({ error: 'Error updating password: ' + error.message });
    }
  } else {
    // Token-based password reset (forgot password flow)
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Missing token or newPassword.' });
    }
    let logins = loadLogins();
    const user = logins.find(u => u.resetToken === token && u.resetTokenExpiry > Date.now());
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      delete user.resetToken;
      delete user.resetTokenExpiry;
      saveLogins(logins);
      return res.json({ success: true });
    } catch (error) {
      console.error("Reset password error using token:", error);
      return res.status(500).json({ error: 'Error updating password: ' + error.message });
    }
  }
});

// Optional: Serve a simple HTML form for token-based password reset
app.get('/reset-password', (req, res) => {
  const token = req.query.token;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .container { background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
        input { padding: 10px; margin: 5px 0; width: 100%; }
        button { padding: 10px; width: 100%; background: #667eea; color: white; border: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Reset Password</h2>
        <form id="reset-form">
          <input type="hidden" id="token" value="${token || ''}">
          <input type="password" id="newPassword" placeholder="New Password" required>
          <button type="submit">Reset Password</button>
        </form>
        <div id="message"></div>
      </div>
      <script>
        document.getElementById('reset-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const token = document.getElementById('token').value;
          const newPassword = document.getElementById('newPassword').value;
          const res = await fetch('/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
          });
          const data = await res.json();
          document.getElementById('message').textContent = data.success ? 'Password reset successfully.' : data.error;
        });
      </script>
    </body>
    </html>
  `);
});

// ------------------
// SHARE ENDPOINTS
// ------------------

// Create share token for logged-in user
app.post('/create-share-token', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const username = req.session.user.username;
  let logins = loadLogins();
  const user = logins.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  // Generate a share token if it doesn't already exist
  if (!user.shareToken) {
    user.shareToken = crypto.randomBytes(10).toString('hex');
    saveLogins(logins);
  }
  const shareUrl = `https://${req.get('host')}/share?token=${user.shareToken}`;
  return res.json({ shareUrl });
});

// Serve the share page (make sure you have public/share.html)
app.get('/share', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'share.html'));
});

// Get the shared playlist using the share token
app.get('/share/playlist', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token.' });
  }
  const logins = loadLogins();
  const user = logins.find(u => u.shareToken === token);
  if (!user) {
    return res.status(404).json({ error: 'Invalid token.' });
  }
  return res.json({ playlist: user.playlist || [] });
});

// Add a video to the shared playlist using the share token
app.post('/share/playlist/add', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token.' });
  }
  const video = req.body.video; // expects { videoId, title }
  if (!video || !video.videoId || !video.title) {
    return res.status(400).json({ error: 'Invalid video object.' });
  }
  let logins = loadLogins();
  const user = logins.find(u => u.shareToken === token);
  if (!user) {
    return res.status(404).json({ error: 'Invalid token.' });
  }
  user.playlist = user.playlist || [];
  if (!user.playlist.find(v => v.videoId === video.videoId)) {
    user.playlist.push(video);
    saveLogins(logins);
  }
  return res.json({ success: true, playlist: user.playlist });
});

// Remove a video from the shared playlist using the share token
app.post('/share/playlist/remove', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token.' });
  }
  const { videoId } = req.body;
  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId.' });
  }
  let logins = loadLogins();
  const user = logins.find(u => u.shareToken === token);
  if (!user) {
    return res.status(404).json({ error: 'Invalid token.' });
  }
  if (user.playlist) {
    user.playlist = user.playlist.filter(v => v.videoId !== videoId);
    saveLogins(logins);
  }
  return res.json({ success: true, playlist: user.playlist });
});

// Assign a video in the shared playlist to a party member
app.post('/share/playlist/assign', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token.' });
  }
  const { videoId, assignedTo } = req.body;
  let logins = loadLogins();
  const user = logins.find(u => u.shareToken === token);
  if (!user) {
    return res.status(404).json({ error: 'Invalid token.' });
  }
  const song = user.playlist.find(item => item.videoId === videoId);
  if (song) {
    song.assignedTo = assignedTo || "";
    saveLogins(logins);
    return res.json({ success: true });
  } else {
    return res.json({ success: false, error: 'Song not found' });
  }
});

// Shared party members endpoints
app.get('/share/party-members', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token.' });
  }
  const logins = loadLogins();
  const user = logins.find(u => u.shareToken === token);
  if (!user) {
    return res.status(404).json({ error: 'Invalid token.' });
  }
  res.json({ partyMembers: user.partyMembers || [] });
});

app.post('/share/party-members/add', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token.' });
  }
  const { member } = req.body;
  let logins = loadLogins();
  const user = logins.find(u => u.shareToken === token);
  if (!user) {
    return res.status(404).json({ error: 'Invalid token.' });
  }
  user.partyMembers = user.partyMembers || [];
  if (!user.partyMembers.includes(member)) {
    user.partyMembers.push(member);
    saveLogins(logins);
  }
  res.json({ success: true, partyMembers: user.partyMembers });
});

app.post('/share/party-members/remove', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token.' });
  }
  const { member } = req.body;
  let logins = loadLogins();
  const user = logins.find(u => u.shareToken === token);
  if (!user) {
    return res.status(404).json({ error: 'Invalid token.' });
  }
  user.partyMembers = user.partyMembers.filter(m => m !== member);
  // Unassign any song assigned to that member
  user.playlist.forEach(song => {
    if (song.assignedTo === member) {
      song.assignedTo = "";
    }
  });
  saveLogins(logins);
  res.json({ success: true, partyMembers: user.partyMembers });
});

// --------------------------
// DELETE ACCOUNT ENDPOINT (with Confirmation Email)
// --------------------------
app.post('/delete-account', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const username = req.session.user.username;
  let logins = loadLogins();
  const user = logins.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Generate deletion token if not exists or expired (valid for 1 hour)
  if (!user.deleteAccountToken || user.deleteAccountTokenExpiry < Date.now()) {
    user.deleteAccountToken = crypto.randomBytes(20).toString('hex');
    user.deleteAccountTokenExpiry = Date.now() + 3600000; // 1 hour
    saveLogins(logins);
  }
  
  // Construct confirmation link
  const confirmationLink = `${req.protocol}://${req.get('host')}/confirm-delete-account?token=${user.deleteAccountToken}`;
  
  // Send confirmation email
  const mailOptions = {
    from: 'Karaokly <no-reply@karaokly.com>',
    to: username,
    subject: 'Confirm Account Deletion',
    text: `You requested to delete your account at Karaokly.
Please confirm your account deletion by clicking on the following link:
${confirmationLink}
This link is valid for one hour.
If you did not request account deletion, please ignore this email.`,
    html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #e0e5ec; padding: 20px; }
            .card { max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
            h2 { color: #333; }
            p { font-size: 16px; color: #555; }
            .btn {
              display: inline-block;
              padding: 15px 25px;
              margin: 20px 0;
              font-size: 16px;
              color: #000;
              background: linear-gradient(45deg, #667eea, #764ba2);
              text-decoration: none;
              border-radius: 5px;
              transition: background 0.3s ease;
            }
            .btn:hover { background: linear-gradient(45deg, #5a67d8, #6b46c1); }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Confirm Account Deletion</h2>
            <p>Click the button below to confirm deletion of your account.</p>
            <a class="btn" href="${confirmationLink}">Confirm Account Deletion</a>
            <p>This link is valid for one hour.<br>If you did not request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending deletion confirmation email:', error);
      return res.status(500).json({ error: 'Error sending confirmation email.' });
    }
    console.log('Deletion confirmation email sent:', info.response);
    return res.json({ success: true, message: 'A confirmation email has been sent. Please check your email to confirm account deletion.' });
  });
});

// GET endpoint to handle confirmation link and delete the account.
app.get('/confirm-delete-account', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Invalid deletion token.');
  }
  let logins = loadLogins();
  const userIndex = logins.findIndex(u => u.deleteAccountToken === token && u.deleteAccountTokenExpiry > Date.now());
  if (userIndex === -1) {
    return res.status(400).send('Invalid or expired deletion token.');
  }
  // Retrieve username before deleting
  const username = logins[userIndex].username;
  logins.splice(userIndex, 1);
  saveLogins(logins);
  // Destroy session if applicable
  if (req.session.user && req.session.user.username === username) {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  }
  return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Account Deleted</title>
          <style>
              body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; height: 100vh; }
              .container { background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); text-align: center; }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Account Deleted</h2>
              <p>Your account has been successfully deleted.</p>
              <p><a href="/login">Return to Login</a></p>
          </div>
      </body>
      </html>
  `);
});

// --------------------------
// YOUTUBE SEARCH PROXY & AUTOCOMPLETE
// --------------------------
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter.' });
  }
  
  // Append "karaoke" if not already present
  const lowerQuery = query.toLowerCase();
  const searchQuery = lowerQuery.includes('karaoke') ? query : `${query} karaoke`;

  console.log('Search query:', searchQuery);

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=10&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    console.log('YouTube API response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to fetch data from YouTube API.' });
  }
});

/* Commented out autofill/autocomplete functionality
app.get('/api/suggestions', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ suggestions: [] });
  }
  
  // Append "karaoke" if not already present
  const lowerQuery = query.toLowerCase();
  const searchQuery = lowerQuery.includes('karaoke') ? query : `${query} karaoke`;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=5&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    let suggestions = [];
    if (data.items) {
      suggestions = data.items.map(item => item.snippet.title);
      suggestions = [...new Set(suggestions)]; // Remove duplicates
    }
    res.json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions from YouTube API:', error);
    res.status(500).json({ suggestions: [] });
  }
});
*/

// --------------------------
// ADMIN ENDPOINTS
// --------------------------

// New isAdmin middleware that checks the isAdmin flag in the user's record.
function isAdmin(req, res, next) {
  if (req.session.user) {
    const logins = loadLogins();
    const user = logins.find(u => u.username === req.session.user.username);
    if (user && user.isAdmin) return next();
  }
  return res.status(403).json({ error: 'Unauthorized' });
}

// GET /admin/accounts
// Returns a list of all accounts (without sensitive info)
app.get('/admin/accounts', isAdmin, (req, res) => {
  let logins = loadLogins();
  const accounts = logins.map(account => ({
    username: account.username,
    emailVerified: account.emailVerified,
    partyMembers: account.partyMembers || [],
    playlist: account.playlist || [],
    isAdmin: account.isAdmin || false
  }));
  res.json({ accounts });
});

// POST /admin/delete-account
// Deletes a user account (except admin)
app.post('/admin/delete-account', isAdmin, (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }
  if (username === 'aradu28@pascack.org') {
    return res.status(400).json({ error: 'Cannot delete admin account.' });
  }
  let logins = loadLogins();
  const index = logins.findIndex(user => user.username === username);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  logins.splice(index, 1);
  saveLogins(logins);
  return res.json({ success: true, message: `Deleted account: ${username}` });
});

// POST /admin/send-support-email
// Sends a support email using NodeMailer from support@karaokly.com
app.post('/admin/send-support-email', isAdmin, (req, res) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing email parameters' });
  }
  const mailOptions = {
    from: 'Karaokly Support <support@karaokly.com>',
    to,
    subject,
    text: message,
    html: `<p>${message}</p>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending support email:', error);
      return res.status(500).json({ error: 'Error sending support email.' });
    }
    console.log('Support email sent:', info.response);
    return res.json({ success: true, message: 'Support email sent successfully.' });
  });
});

// ---------- NEW ENDPOINT TO PROMOTE A USER TO ADMIN -----------
app.post('/admin/make-admin', isAdmin, (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Missing username' });
  let logins = loadLogins();
  const user = logins.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.isAdmin = true;
  saveLogins(logins);
  return res.json({ success: true, message: `${username} is now an admin.` });
});

// ---------- NEW ENDPOINT TO REMOVE ADMIN PRIVILEGES -----------
app.post('/admin/remove-admin', isAdmin, (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Missing username' });
  if (username === 'aradu28@pascack.org') return res.status(400).json({ error: 'Cannot remove admin privileges from the super admin.' });
  let logins = loadLogins();
  const user = logins.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.isAdmin = false;
  saveLogins(logins);
  return res.json({ success: true, message: `${username} is no longer an admin.` });
});

// --------------------------
// ADMIN PAGE ROUTE
// --------------------------
app.get('/admin', (req, res) => {
  if (!req.session.user || !(() => {
    const logins = loadLogins();
    const user = logins.find(u => u.username === req.session.user.username);
    return user && user.isAdmin;
  })()) {
    return res.redirect('/app');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ------------------
// SERVE STATIC FILES & ROUTES
// ------------------
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'index.html'));
});

app.get('/tos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tos.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

app.get('/indev', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'indev', 'index.html'));
});

app.get('/app', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'app', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
