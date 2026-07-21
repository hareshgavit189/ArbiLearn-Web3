import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen  from './components/loading/LoadingScreen'
import Layout         from './components/layout/Layout'
import Home           from './pages/Home'
import Concepts       from './pages/Concepts'
import Prices         from './pages/Prices'
import Simulator      from './pages/Simulator'
import NotFound       from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      {/* Loading screen */}
      <LoadingScreen />

      {/* Main app */}
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/concepts"   element={<Concepts />} />
            <Route path="/prices"     element={<Prices />} />
            <Route path="/simulator"  element={<Simulator />} />
            <Route path="*"           element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </BrowserRouter>
  )
}
