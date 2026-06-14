import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { RouteSeo } from './components/seo/RouteSeo'
import { useProfileContent } from './api/profile/useProfileContent'
import Home from './pages/home'
import Blog from './pages/blog'
import Projects from './pages/projects'
import Resume from './pages/resume'
import Article from './pages/article'
import ProjectDetail from './pages/project-detail'

const AuroraLayout = lazy(() => import('./components/aurora/AuroraLayout'))
const ExperienceGateway = lazy(() => import('./pages/experience-gateway'))
const AuroraHome = lazy(() => import('./pages/aurora/AuroraHome'))
const AuroraBlog = lazy(() => import('./pages/aurora/AuroraBlog'))
const AuroraProjects = lazy(() => import('./pages/aurora/AuroraProjects'))
const AuroraResume = lazy(() => import('./pages/aurora/AuroraResume'))
const AuroraArticle = lazy(() => import('./pages/aurora/AuroraArticle'))
const AuroraPlayground = lazy(() => import('./pages/aurora/AuroraPlayground'))
const AuroraProjectDetail = lazy(() => import('./pages/aurora/AuroraProjectDetail'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ProtectedAdminRoute = lazy(() => import('./components/admin/ProtectedAdminRoute'))

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

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function DynamicBrandMeta() {
  const { data: profile } = useProfileContent()

  useEffect(() => {
    const href = profile?.professionalLogoUrl
    if (!href) return

    const setIcon = (selector: string, rel: string) => {
      let element = document.head.querySelector<HTMLLinkElement>(selector)
      if (!element) {
        element = document.createElement('link')
        element.rel = rel
        document.head.appendChild(element)
      }
      element.href = href
    }

    setIcon('link[rel="icon"]', 'icon')
    setIcon('link[rel="shortcut icon"]', 'shortcut icon')
    setIcon('link[rel="apple-touch-icon"]', 'apple-touch-icon')
  }, [profile?.professionalLogoUrl])

  return null
}

function App() {
  return (
    <>
      <RouteSeo />
      <DynamicBrandMeta />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LazyExperience><ExperienceGateway /></LazyExperience>} />

        <Route path="/classic" element={<ClassicPage basePath="/classic"><Home /></ClassicPage>} />
        <Route path="/classic/blog" element={<ClassicPage basePath="/classic"><Blog /></ClassicPage>} />
        <Route path="/classic/blog/:slug" element={<ClassicPage basePath="/classic"><Article /></ClassicPage>} />
        <Route path="/classic/projects" element={<ClassicPage basePath="/classic"><Projects /></ClassicPage>} />
        <Route path="/classic/projects/:projectId" element={<ClassicPage basePath="/classic"><ProjectDetail /></ClassicPage>} />
        <Route path="/classic/resume" element={<ClassicPage basePath="/classic"><Resume /></ClassicPage>} />

        <Route path="/blog" element={<ClassicPage><Blog /></ClassicPage>} />
        <Route path="/blog/:slug" element={<ClassicPage><Article /></ClassicPage>} />
        <Route path="/projects" element={<ClassicPage><Projects /></ClassicPage>} />
        <Route path="/projects/:projectId" element={<ClassicPage><ProjectDetail /></ClassicPage>} />
        <Route path="/resume" element={<ClassicPage><Resume /></ClassicPage>} />

        <Route path="/aurora" element={<LazyExperience><AuroraLayout /></LazyExperience>}>
          <Route index element={<AuroraHome />} />
          <Route path="blog" element={<AuroraBlog />} />
          <Route path="blog/:slug" element={<AuroraArticle />} />
          <Route path="projects" element={<AuroraProjects />} />
          <Route path="projects/:projectId" element={<AuroraProjectDetail />} />
          <Route path="resume" element={<AuroraResume />} />
          <Route path="playground" element={<AuroraPlayground />} />
        </Route>

        <Route path="/admin/login" element={<LazyExperience><AdminLogin /></LazyExperience>} />
        <Route path="/admin" element={<LazyExperience><ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute></LazyExperience>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
