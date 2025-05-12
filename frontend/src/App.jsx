import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Gallery from './pages/Gallery';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Gallery />} />
        <Route path="collections" element={<Collections />} />
        <Route path="collections/:id" element={<CollectionDetail />} />
      </Route>
    </Routes>
  );
}

export default App;