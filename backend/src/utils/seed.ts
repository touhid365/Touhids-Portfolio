// src/utils/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.project.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.admin.deleteMany()

  console.log('📦 Seeding projects with screenshots...')
  
  // Seed Projects with screenshots
  const projects = await prisma.project.createMany({
    data: [
      {
        title: 'E-Commerce Platform',
        description: `A full-featured e-commerce platform with modern architecture.
        
Key Features:
- User authentication & authorization
- Product catalog with advanced search and filters
- Shopping cart and secure checkout
- Stripe payment integration
- Order management system
- Admin dashboard with analytics
- Responsive and accessible UI

This project demonstrates a complete e-commerce solution built with cutting-edge technologies.`,
        techStack: ['Next.js', 'React', 'Stripe', 'PostgreSQL', 'Tailwind CSS', 'Node.js'],
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556742004-cb5a9f3f2d1a?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556742013-9d1b7f7d2b6a?w=800&h=400&fit=crop'
        ],
        liveUrl: 'https://example-ecommerce.com',
        githubUrl: 'https://github.com/touhid365/ecommerce-platform',
        featured: true
      },
      {
        title: 'Task Management App',
        description: `Collaborative task management with real-time updates.
        
Key Features:
- Real-time updates with WebSockets
- Drag and drop task organization
- Team collaboration and sharing
- Task assignments and deadlines
- Progress tracking and analytics
- Dark mode support
- Mobile-responsive design

Boost team productivity with this modern task management solution.`,
        techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Tailwind CSS', 'Express'],
        imageUrl: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=400&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=400&fit=crop'
        ],
        liveUrl: 'https://example-tasks.com',
        githubUrl: 'https://github.com/touhid365/taskmanager-app',
        featured: true
      },
      {
        title: 'Portfolio Website',
        description: `Personal portfolio showcasing projects and skills.
        
Key Features:
- Modern, minimalist design
- Dark/light mode toggle
- Project showcase with filtering
- Blog section
- Contact form with validation
- SEO optimization
- Analytics integration
- Fast performance with Next.js

A professional portfolio to showcase my work and skills.`,
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
        ],
        liveUrl: 'https://touhid.dev',
        githubUrl: 'https://github.com/touhid365/portfolio',
        featured: false
      },
      {
        title: 'AI Chat Application',
        description: `AI-powered chat application with LLM integration.
        
Key Features:
- OpenAI API integration
- Real-time AI responses
- Multi-language support
- Conversation history
- Custom prompt templates
- Voice input capability
- Export chat history
- User preferences

Experience the power of AI with this intelligent chat application.`,
        techStack: ['Next.js', 'OpenAI API', 'TypeScript', 'Tailwind CSS', 'Python'],
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop'
        ],
        liveUrl: 'https://example-ai-chat.com',
        githubUrl: 'https://github.com/touhid365/ai-chat-app',
        featured: false
      },
      {
        title: 'Weather Dashboard',
        description: `Real-time weather application with interactive maps.
        
Key Features:
- Live weather data
- Interactive maps
- 7-day forecast
- Weather alerts
- Location search
- Favorites saving
- Responsive design
- Dark/light mode

Stay informed with this comprehensive weather dashboard.`,
        techStack: ['React', 'Express.js', 'Node.js', 'Tailwind CSS', 'WebSocket'],
        imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=400&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=400&fit=crop'
        ],
        liveUrl: 'https://example-weatherapp.com',
        githubUrl: 'https://github.com/touhid365/weather-dashboard',
        featured: false
      },
      {
        title: 'Analytics Dashboard',
        description: `Business analytics dashboard with real-time data visualization.
        
Key Features:
- Real-time data updates
- Interactive charts and graphs
- Customizable widgets
- Data export
- User management
- Role-based access
- Performance metrics
- Responsive design

Make data-driven decisions with this powerful analytics dashboard.`,
        techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Chart.js'],
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
        ],
        liveUrl: 'https://example-analytics.com',
        githubUrl: 'https://github.com/touhid365/analytics-dashboard',
        featured: false
      },
      {
        title: 'Real Estate Platform',
        description: `Property listing platform with advanced search and filtering.
        
Key Features:
- Property listings with images
- Advanced search filters
- Map integration
- Property comparison
- User favorites
- Agent profiles
- Appointment scheduling
- Mobile-responsive

Find your dream home with this modern real estate platform.`,
        techStack: ['Next.js', 'PostgreSQL', 'Node.js', 'Tailwind CSS', 'Prisma'],
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop'
        ],
        liveUrl: 'https://example-realestate.com',
        githubUrl: 'https://github.com/touhid365/realestate-platform',
        featured: false
      },
      {
        title: 'Food Delivery App',
        description: `Food delivery application with real-time tracking.
        
Key Features:
- Restaurant discovery
- Food ordering system
- Real-time order tracking
- Payment integration
- Delivery scheduling
- User ratings and reviews
- Admin dashboard
- Push notifications

Order your favorite food with this modern delivery app.`,
        techStack: ['React Native', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop'
        ],
        liveUrl: 'https://example-food.com',
        githubUrl: 'https://github.com/touhid365/food-delivery-app',
        featured: false
      }
    ]
  })

  console.log(`✅ Created ${projects.count} projects with screenshots`)

  // Seed Admin
  console.log('👤 Seeding admin user...')
  
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@touhidportfolio.com',
      password: hashedPassword
    }
  })

  console.log(`✅ Admin created: ${admin.email}`)
  console.log('🔑 Default password: admin123')

  // Seed Contact messages
  console.log('💬 Seeding contact messages...')
  
  await prisma.contact.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Great portfolio! I\'m interested in working together on a project. Let\'s connect!',
        status: 'READ'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'I love your work! Do you accept freelance projects? I have a startup idea.',
        status: 'PENDING'
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        message: 'Your AI Chat application looks amazing! Would love to learn more about how you built it.',
        status: 'PENDING'
      }
    ]
  })

  console.log('✅ Seeding completed successfully!')
  console.log('📊 Summary:')
  console.log(`  - ${projects.count} projects created with screenshots`)
  console.log(`  - 1 admin user created`)
  console.log(`  - 3 contact messages created`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })