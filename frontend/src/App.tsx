import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Learn } from './pages/Learn'
import { MethodPage } from './pages/MethodPage'
import { Methods } from './pages/Methods'
import { About, Help, NotFound } from './pages/Static'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="methods" element={<Methods />} />
        <Route path="methods/:category/:slug" element={<MethodPage />} />
        <Route path="learn" element={<Learn />} />
        <Route path="help" element={<Help />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
