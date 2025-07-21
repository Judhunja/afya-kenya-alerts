# AfyaApp - Health Alert System - https://afya-kenya-alerts.lovable.app

A health alert system for Kenya that allows users to register and receive SMS notifications about health outbreaks in their counties.

## 🏥 Features

- User registration with name, email, phone number, and location
- SMS notifications for health alerts by county
- Real-time health alerts for Nairobi, Mombasa, and Kisumu
- MongoDB database for user data storage
- Africa's Talking SMS integration

## 🛠️ Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn/ui components
- React Router for navigation
- Built with Lovable

**Backend:**
- Python Flask
- MongoDB for database
- Africa's Talking SMS API
- Flask-CORS for cross-origin requests

## 🚀# 🚀 Quick Start

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- MongoDB (local or remote)
- Africa's Talking API credentials (username and API key)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd afya-kenya-alerts
   ```

## Backend Setup

1. **Install Python dependencies**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   # Africa's Talking API
   AFRICASTALKING_USERNAME=your_africastalking_username
   AFRICASTALKING_API_KEY=your_africastalking_api_key
   
   # MongoDB (local or remote)
   MONGO_URI=mongodb://localhost:27017/afyaapp
   
   # Server Configuration
   PORT=5000
   FLASK_APP=app.py
   FLASK_ENV=development
   ```

3. **Start the backend server**
   ```bash
   python app.py
   ```
   The backend API will be available at http://localhost:5000

## Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   Open http://localhost:5173 in your browser

## Running the Application

1. **Start MongoDB**
   Make sure MongoDB is running locally or update the `MONGO_URI` in the backend's `.env` file to point to your MongoDB instance.

2. **Start the backend server**
   In one terminal:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   python app.py
   ```

3. **Start the frontend**
   In another terminal:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Required API Keys

1. **MongoDB Atlas**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create cluster and get connection string
   - Add to `MONGO_URI` in `.env`

2. **Africa's Talking**
   - Sign up at [Africa's Talking](https://africastalking.com/)
   - Get API key and username from dashboard
   - Add to `.env` file

### Frontend Configuration

Update the API endpoints in your React components to match your backend URL:
- Development: `http://localhost:5000`
- Production: Your deployed backend URL

## 📁 Project Structure

```
afyaapp/
├── backend/
│   ├── app.py              # Flask backend
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── src/
│   ├── components/
│   │   ├── AfyaApp.tsx    # Main app component
│   │   └── SignIn.tsx     # User registration
│   ├── pages/
│   │   └── Index.tsx      # Home page
│   └── main.tsx           # App entry point
└── README.md
```

## 🚀 Deployment

### Frontend Deployment (Lovable)
1. Click "Publish" button in Lovable interface
2. Your app will be deployed automatically
3. Optional: Connect custom domain in Project Settings

### Backend Deployment Options

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option 2: Render**
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

**Option 3: Heroku**
```bash
# Install Heroku CLI and login
heroku login
heroku create your-app-name
heroku config:set MONGO_URI=your_mongo_uri
heroku config:set AFRICASTALKING_USERNAME=your_username
heroku config:set AFRICASTALKING_API_KEY=your_api_key
git push heroku main
```

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Enable MongoDB IP whitelist in production
- Use HTTPS in production

## 📱 SMS Features

- Automatic SMS alerts based on user location
- Custom alert messages per county
- SMS callback handling for user responses
- Phone number validation for Kenyan numbers (+254)

## 🗄️ Database Schema

**Users Collection:**
```javascript
{
  name: String,
  email: String,
  phone_number: String, // Format: +254XXXXXXXXX
  location: String      // County name
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues or questions:
- Check the [Lovable Documentation](https://docs.lovable.dev/)
- Review API documentation for Africa's Talking
- Check MongoDB Atlas connection guides
