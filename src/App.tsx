import { Routes, Route } from 'react-router-dom'
import { Page } from './components/Layout'
import Home from './pages/Home'
import Roadmap from './pages/Roadmap'
import Foundations from './pages/Foundations'
import Design from './pages/Design'
import Build from './pages/Build'
import Test from './pages/Test'
import Deploy from './pages/Deploy'
import Monitor from './pages/Monitor'
import Mcp from './pages/Mcp'
import AntiPatterns from './pages/AntiPatterns'
import Reference from './pages/Reference'
import Capstone from './pages/Capstone'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Page>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/foundations" element={<Foundations />} />
        <Route path="/design" element={<Design />} />
        <Route path="/build" element={<Build />} />
        <Route path="/test" element={<Test />} />
        <Route path="/deploy" element={<Deploy />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/mcp" element={<Mcp />} />
        <Route path="/anti-patterns" element={<AntiPatterns />} />
        <Route path="/reference" element={<Reference />} />
        <Route path="/capstone" element={<Capstone />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Page>
  )
}
