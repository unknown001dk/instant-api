import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();
const sessionConfig = session({
  secret: process.env.SESSION_SECRET_KEY,        
  resave: false,                  
  saveUninitialized: false,      
  cookie: {
    httpOnly: true,              
    // secure: process.env.NODE_ENV === 'production', 
    maxAge: 1000 * 60 * 60 * 24,  // 24 hours 
  }
})

export default sessionConfig;