import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Projects from './pages/Projects'
import Resume from './pages/Resume'
import Article from './pages/Article'

const AuroraLayout = lazy(() => import('./components/aurora/AuroraLayout'))
const ExperienceGateway = lazy(() => import('./pages/ExperienceGateway'))
const AuroraHome = lazy(() => import('./pages/aurora/AuroraHome'))
const AuroraBlog = lazy(() => import('./pages/aurora/AuroraBlog'))
const AuroraProjects = lazy(() => import('./pages/aurora/AuroraProjects'))
const AuroraResume = lazy(() => import('./pages/aurora/AuroraResume'))
const AuroraArticle = lazy(() => import('./pages/aurora/AuroraArticle'))
const AuroraPlayground = lazy(() => import('./pages/aurora/AuroraPlayground'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ProtectedAdminRoute = lazy(() => import('./pages/admin/ProtectedAdminRoute'))

function ClassicPage({ children, basePath = '' }: { children: React.ReactNode; basePath?: string }) {
  return <Layout basePath={basePath}>{children}</Layout>
}

function LazyExperience({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#040001]" />}>
      {children}
    </Suspense>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LazyExperience><ExperienceGateway /></LazyExperience>} />

      <Route path="/classic" element={<ClassicPage basePath="/classic"><Home /></ClassicPage>} />
      <Route path="/classic/blog" element={<ClassicPage basePath="/classic"><Blog /></ClassicPage>} />
      <Route path="/classic/blog/:slug" element={<ClassicPage basePath="/classic"><Article /></ClassicPage>} />
      <Route path="/classic/projects" element={<ClassicPage basePath="/classic"><Projects /></ClassicPage>} />
      <Route path="/classic/resume" element={<ClassicPage basePath="/classic"><Resume /></ClassicPage>} />

      <Route path="/blog" element={<ClassicPage><Blog /></ClassicPage>} />
      <Route path="/blog/:slug" element={<ClassicPage><Article /></ClassicPage>} />
      <Route path="/projects" element={<ClassicPage><Projects /></ClassicPage>} />
      <Route path="/resume" element={<ClassicPage><Resume /></ClassicPage>} />

      <Route path="/aurora" element={<LazyExperience><AuroraLayout /></LazyExperience>}>
        <Route index element={<AuroraHome />} />
        <Route path="blog" element={<AuroraBlog />} />
        <Route path="blog/:slug" element={<AuroraArticle />} />
        <Route path="projects" element={<AuroraProjects />} />
        <Route path="resume" element={<AuroraResume />} />
        <Route path="playground" element={<AuroraPlayground />} />
      </Route>

      <Route path="/admin/login" element={<LazyExperience><AdminLogin /></LazyExperience>} />
      <Route path="/admin" element={<LazyExperience><ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute></LazyExperience>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
