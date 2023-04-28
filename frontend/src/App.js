import './App.css';
import ImagesList from './features/images/imagesList';
import ImageUploadForm from './features/images/ImageUploadForm'
import Prefetch from './features/auth/Prefetch'
import Cropper from './components/Cropper/Cropper'


import { Routes, Route } from 'react-router-dom'
// import Public from './components/Public'
import Layout from './components/Layout'

function App() {

  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<Prefetch />}>
          {/* public routes */}
          <Route index element={<ImagesList />} />
            <Route path="/upload" element={<ImageUploadForm />} />
            <Route path="/crop" element={<Cropper />} />
          </Route>
        </Route>
    </Routes>
  )
}

export default App;
