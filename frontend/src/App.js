import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import CategoryList from './pages/CategoryList';
import TagList from './pages/TagList';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="py-4">
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<PostList />} />
                <Route path="/posts/:slug" element={<PostDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-post/:slug" element={<EditPost />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/tags" element={<TagList />} />
              </Routes>
            </Container>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;