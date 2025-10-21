# 🎯 Tier-Based Hiring Platform

A comprehensive tier-based hiring platform that connects top-tier candidates with recruiters through a merit-based system. Candidates are placed in tiers based on their performance in assessments and contests, while recruiters can access candidates based on their subscription level.

## 🌟 Features

### For Candidates
- **Domain Selection**: Choose from 5 domains (DSA, Web Dev, Database, ML, DevOps)
- **Tier-Based System**: Get placed in tiers 1-5 based on performance
- **Comprehensive Assessments**: Initial placement exams and regular shifting contests
- **Progress Tracking**: Monitor your ranking, scores, and tier progression
- **Contest System**: Participate in weekly internal contests and monthly shifting contests
- **Premium Features**: Advanced analytics, study materials, and mock interviews

### For Recruiters
- **Tier-Based Access**: Access candidates based on subscription level
- **Anonymous Analytics**: View aggregated data about candidate pools
- **Custom Assessments**: Create custom exams for candidates
- **Job Posting**: Post jobs targeting specific tiers and domains
- **Application Management**: Track and manage candidate applications
- **Subscription Tiers**: Free (Tier 1), Basic (Tier 3), Premium (Tier 4), Enterprise (All Tiers)

## 🏗️ Architecture

### Backend (Node.js + Express + PostgreSQL)
- **Authentication**: JWT-based auth with refresh tokens
- **Database**: PostgreSQL with Sequelize ORM
- **APIs**: RESTful APIs for all platform features
- **File Upload**: Cloudinary integration for CVs and documents

### Frontend (React + Framer Motion)
- **Modern UI**: Beautiful, responsive design with animations
- **State Management**: React Context for authentication and theme
- **Routing**: React Router for navigation
- **Components**: Reusable UI components with Lucide React icons

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tier-hiring-platform
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/ApexHire
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=1h
   CORS_ORIGIN=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

5. **Set up the database**
   ```bash
   cd backend
   node setup.js
   ```

6. **Start the development servers**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 Database Schema

### Core Tables
- **Candidates**: User profiles and authentication
- **Recruiters**: Recruiter profiles and authentication
- **Domains**: Available skill domains (DSA, Web Dev, etc.)
- **Tiers**: Tier definitions with slot limits and pricing
- **Jobs**: Job postings with tier targeting
- **Job_Applications**: Candidate applications to jobs

### Assessment System
- **Exams**: Assessment definitions and metadata
- **Questions**: Individual exam questions with multiple types
- **Exam_Attempts**: Candidate exam attempts and scores
- **Candidate_Domain_Performance**: Tier assignments and performance tracking

### Contest System
- **Contests**: Contest definitions (shifting, internal, custom)
- **Contest_Participations**: Candidate participation and scores
- **Tier_Thresholds**: Dynamic tier boundaries based on performance

### Business Features
- **Premium_Subscriptions**: Candidate premium features
- **Recruiter_Subscriptions**: Recruiter tier access management
- **Cooldown_Periods**: Hiring cooldown management
- **Analytics_Data**: Anonymous analytics for recruiters

## 🎮 User Flow

### Candidate Journey
1. **Registration**: Sign up as a candidate
2. **Domain Selection**: Choose domains of interest
3. **Initial Assessment**: Take placement exams
4. **Tier Assignment**: Get placed in appropriate tier
5. **Regular Participation**: Join contests and maintain activity
6. **Tier Progression**: Move up tiers based on performance
7. **Job Applications**: Apply to jobs matching your tier

### Recruiter Journey
1. **Registration**: Sign up as a recruiter
2. **Company Setup**: Create company profile
3. **Subscription**: Choose subscription tier
4. **Job Posting**: Post jobs targeting specific tiers
5. **Candidate Search**: Browse candidates by tier and domain
6. **Application Management**: Review and manage applications
7. **Analytics**: View anonymous tier analytics

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### Exams
- `GET /api/exams/domain/:domainId` - Get available exams
- `GET /api/exams/:examId` - Get exam details
- `POST /api/exams/:examId/start` - Start exam
- `POST /api/exams/attempt/:attemptId/answer` - Submit answer
- `POST /api/exams/attempt/:attemptId/complete` - Complete exam

### Tiers
- `GET /api/tiers/domain/:domainId` - Get candidate tier info
- `GET /api/tiers/domain/:domainId/leaderboard` - Get domain leaderboard
- `GET /api/tiers/domain/:domainId/tiers` - Get available tiers

### Contests
- `GET /api/contests/active` - Get active contests
- `POST /api/contests/:contestId/register` - Register for contest
- `GET /api/contests/:contestId/leaderboard` - Get contest leaderboard

### Recruiter
- `GET /api/recruiters/dashboard` - Get recruiter dashboard
- `POST /api/recruiters/jobs` - Create job post
- `GET /api/recruiters/candidates` - Search candidates by tier
- `GET /api/recruiters/analytics` - Get anonymous analytics

## 🎨 UI Components

### Key Components
- **DomainSelection**: Domain selection with tier preview
- **ExamSystem**: Full-featured exam interface with timer
- **TierDashboard**: Comprehensive tier management dashboard
- **RecruiterDashboard**: Recruiter interface with candidate search
- **CandidateDomainDashboard**: Domain-specific candidate dashboard

### Design Features
- **Responsive Design**: Works on all device sizes
- **Dark/Light Theme**: Toggle between themes
- **Animations**: Smooth transitions with Framer Motion
- **Modern UI**: Clean, professional design
- **Accessibility**: WCAG compliant components

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting (recommended)
- **HTTPS Ready**: Production-ready security headers

## 📈 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connections
- **Image Optimization**: Cloudinary for image handling
- **Lazy Loading**: Component-based lazy loading
- **Caching**: Redis caching (recommended for production)

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Set production environment variables
2. **Database**: Set up production PostgreSQL database
3. **File Storage**: Configure Cloudinary for production
4. **SSL**: Set up SSL certificates
5. **Domain**: Configure custom domain

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify
- **Database**: AWS RDS, DigitalOcean Managed Database
- **File Storage**: Cloudinary, AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by competitive programming platforms
- Designed for fair, merit-based hiring

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Made with ❤️ for fair and efficient hiring**
