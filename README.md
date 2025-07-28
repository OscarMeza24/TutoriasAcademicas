# TutorHub - Accessible Academic Tutoring Platform

A comprehensive web application for managing academic tutoring sessions with a strong focus on accessibility and inclusive design.

## 🌟 Features

### Core Functionality
- **Complete Authentication System** - Secure user registration, login, and profile management
- **Role-Based Access** - Separate interfaces for students, tutors, and administrators
- **Session Management** - Schedule, manage, and track tutoring sessions
- **Advanced Search** - Find tutors by subject, availability, and ratings
- **Real-time Notifications** - Stay updated on session changes and reminders
- **Feedback System** - Rate and review tutoring sessions

### Accessibility Features
- **WCAG 2.1 AA Compliant** - Meets international accessibility standards
- **Screen Reader Support** - Full compatibility with assistive technologies
- **Keyboard Navigation** - Complete keyboard accessibility for all features
- **High Contrast Mode** - Enhanced visibility for users with visual impairments
- **Adjustable Font Sizes** - Customizable text sizing for better readability
- **Color-Blind Support** - Multiple color vision accessibility options
- **Reduced Motion** - Respects user preferences for motion sensitivity
- **Focus Management** - Clear focus indicators and logical tab order

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/tutoring-management-system.git
   cd tutoring-management-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Set up the database**
   
   Run the SQL scripts in your Supabase SQL editor:
   \`\`\`bash
   # Run scripts/01-initial-schema.sql first
   # Then run scripts/02-seed-data.sql
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Styling**: Tailwind CSS with custom accessibility enhancements
- **UI Components**: Radix UI primitives with custom accessible wrappers
- **State Management**: React Context API

### Project Structure
\`\`\`
├── app/                    # Next.js App Router pages
├── components/            
│   ├── forms/             # Accessible form components
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   └── ui/                # Reusable UI components
├── contexts/              # React Context providers
├── lib/                   # Utility functions and configurations
├── scripts/               # Database setup and migration scripts
└── public/                # Static assets
\`\`\`

## 🎯 Accessibility Implementation

### Key Accessibility Features

1. **Semantic HTML Structure**
   - Proper heading hierarchy (h1-h6)
   - Landmark regions (main, nav, aside, footer)
   - Form labels and descriptions

2. **ARIA Implementation**
   - ARIA labels for complex interactions
   - Live regions for dynamic content updates
   - Proper roles and states

3. **Keyboard Navigation**
   - Tab order management
   - Skip links for main content
   - Keyboard shortcuts for common actions

4. **Visual Accessibility**
   - High contrast color schemes
   - Scalable font sizes
   - Color-blind friendly palettes
   - Focus indicators

5. **Screen Reader Support**
   - Descriptive alt text for images
   - Screen reader only content where needed
   - Proper form field associations

### Testing Accessibility

\`\`\`bash
# Install accessibility testing tools
npm install -D @axe-core/react eslint-plugin-jsx-a11y

# Run accessibility linting
npm run lint

# Manual testing checklist:
# - Navigate using only keyboard
# - Test with screen reader (NVDA, JAWS, VoiceOver)
# - Verify color contrast ratios
# - Test with different zoom levels
\`\`\`

## 🔧 Configuration

### Supabase Setup

1. **Create a new Supabase project**
2. **Run the database migrations** (see scripts folder)
3. **Configure Row Level Security policies**
4. **Set up authentication providers** (optional)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for admin functions) | No |

## 📱 Responsive Design

The application is fully responsive and works across:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)  
- **Mobile** (320px - 767px)

## 🧪 Testing

\`\`\`bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
\`\`\`

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions that improve accessibility and functionality!

### Development Guidelines

1. **Follow accessibility best practices**
2. **Test with keyboard navigation**
3. **Verify screen reader compatibility**
4. **Maintain WCAG 2.1 AA compliance**
5. **Write semantic HTML**
6. **Include proper ARIA attributes**

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test accessibility thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Accessibility**: For accessibility-related questions, please include details about your assistive technology

## 🙏 Acknowledgments

- **Supabase** for the excellent backend-as-a-service platform
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Next.js** team for the amazing React framework
- **Web Accessibility Initiative (WAI)** for WCAG guidelines

---

Built with ❤️ and accessibility in mind.
