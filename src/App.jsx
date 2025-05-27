import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import Home from './pages/Home';
import Product from './pages/Product';
import Register from './pages/Register';
import Signin from './pages/Signin';
import Contact from './pages/Contact';
import About from './pages/About';
import Faq from './pages/Faq';
import Navbar from './components/Navbar';
import AdminHome from './pages/AdminHome';
import UploadOrder from './pages/UploadOrder';
import Inventory from './pages/Inventory';
import ManageUser from './pages/ManageUser';
import Order from './pages/Order';
import AdminProfile from './pages/AdminProfile';
import UserProfile from './pages/UserProfile';
import UserCart from './pages/UserCart';
import ProductDetail from './pages/ProductDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import TnC from './pages/TnC';
import SizeChart from './pages/SizeChart';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';
import chatbotIcon from './assets/chatbot.jpg';
import axios from 'axios';
import RnE from './pages/RnE';

// Chatbot Icon Component
const ChatbotIcon = () => (
  <div style={{ width: 60, height: 60, background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
    <img src={chatbotIcon} alt="TKBot" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%' }} />
  </div>
);


const chatbotChoices = [
  {
    label: "What's new?",
    response:
      "Check out our latest arrivals and features! We've added new products, improved order tracking, and updated our size options. Visit the Products page or What's New section for details.",
  },
  {
    label: 'How to order?',
    response: null,
  },
  {
    label: 'Available sizes',
    response: null,
  },
  {
    label: 'FAQs',
    response:
      `Here are some frequently asked questions:\n\n- How do I track my order? Go to your profile after signing in to see your order status.\n\n- What sizes do you offer? We offer S, M, L, XL, and XXL. Check the Size Chart for details.\n\n- How do I contact support? Use the Contact page or email us at support@trapkings.com.\n\n- What is your return policy? Returns are accepted within 7 days if items are unworn and in original condition.\n\nFor more, visit the FAQs page!`,
  },
];

const ChatbotModal = ({ onClose }) => {
  const [chatHistory, setChatHistory] = React.useState([]); // [{idx, type, data}]
  const [latestProduct, setLatestProduct] = React.useState(null);
  const [loadingProduct, setLoadingProduct] = React.useState(false);
  const [errorProduct, setErrorProduct] = React.useState(null);
  const [showSignInPrompt, setShowSignInPrompt] = React.useState(false);
  const chatEndRef = React.useRef(null);

  function getImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `http://localhost/trapkings-api/${path.replace(/^\/+/,'')}`;
  }

  // Handle choice click
  const handleChoice = idx => {
    setShowSignInPrompt(false);
    if (idx === 0) {
      setLoadingProduct(true);
      setErrorProduct(null);
      axios.get('http://localhost/trapkings-api/get_product.php')
        .then(res => {
          if (res.data.success && res.data.products.length > 0) {
            const sorted = res.data.products.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
            setLatestProduct(sorted[0]);
            setChatHistory(prev => [...prev, { idx, type: 'product', data: sorted[0] }]);
          } else {
            setErrorProduct('No products found.');
            setChatHistory(prev => [...prev, { idx, type: 'error', data: 'No products found.' }]);
          }
        })
        .catch(() => {
          setErrorProduct('Failed to fetch product.');
          setChatHistory(prev => [...prev, { idx, type: 'error', data: 'Failed to fetch product.' }]);
        })
        .finally(() => setLoadingProduct(false));
    } else if (idx === 1) {
      setChatHistory(prev => [...prev, { idx, type: 'howto', data: null }]);
    } else if (idx === 2) {
      setChatHistory(prev => [...prev, { idx, type: 'sizes', data: null }]);
    } else {
      setChatHistory(prev => [...prev, { idx, type: 'text', data: chatbotChoices[idx].response }]);
    }
  };

  // Choices left to pick (exclude those already picked)
  const pickedIdxs = chatHistory.map(h => h.idx);
  const availableChoices = chatbotChoices.filter((_, idx) => !pickedIdxs.includes(idx));

  // Check if user is signed in
  function isSignedIn() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return !!user;
    } catch {
      return false;
    }
  }

  // Handle profile link click
  const handleProfileClick = e => {
    if (!isSignedIn()) {
      e.preventDefault();
      setShowSignInPrompt(true);
    }
  };

  // Render FAQ with interactive links
  function renderFAQWithLinks(text) {
    // Remove the intro line
    const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('Here are some'));
    // Group by Q&A
    return lines.map((line, idx) => {
      // Track my order
      if (line.includes('track my order')) {
        return (
          <div key={idx}>
            - How do I track my order?<br />
            Go to your{' '}
            <a
              href="/trapkings/userprofile"
              style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
              onClick={handleProfileClick}
            >
              profile
            </a>{' '}after signing in to see your order status.
          </div>
        );
      }
      // Sizes
      if (line.includes('sizes do you offer')) {
        return (
          <div key={idx}>
            - What sizes do you offer?<br />
            We offer S, M, L, XL, and XXL. Check the{' '}
            <a
              href="/trapkings/sizechart"
              style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
            >
              Size Chart
            </a>{' '}
            for details.
          </div>
        );
      }
      // Contact
      if (line.includes('contact support')) {
        return (
          <div key={idx}>
            - How do I contact support?<br />
            Use the{' '}
            <a
              href="/trapkings/contact"
              style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
            >
              Contact page
            </a>{' '}or email us at support@trapkings.com.
          </div>
        );
      }
      // Return policy
      if (line.includes('return policy')) {
        return (
          <div key={idx}>
            - What is your return policy?<br />
            Returns are accepted within 7 days if items are unworn and in original condition.
          </div>
        );
      }
      // FAQs page
      if (line.includes('FAQs page')) {
        return (
          <div key={idx}>
            For more, visit the{' '}
            <a
              href="/trapkings/faqs"
              style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
            >
              FAQs page
            </a>!
          </div>
        );
      }
      // Default
      return null;
    }).filter(Boolean);
  }

  // Render How to order with interactive links
  function renderHowToOrder() {
    return (
      <span>
        Ordering is easy! Browse{' '}
        <a
          href="/trapkings/products"
          style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
        >
          products
        </a>
        , select your size and color, add to cart, then proceed to checkout. You'll receive an order confirmation and can track your order by going to your{' '}
        <a
          href="/trapkings/userprofile"
          style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
          onClick={handleProfileClick}
        >
          profile
        </a>.
      </span>
    );
  }

  // Scroll to bottom when chatHistory or loadingProduct changes
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, loadingProduct, showSignInPrompt]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: 340,
      maxWidth: '95vw',
      height: 540,
      background: '#fff',
      borderRadius: '18px 18px 0 0',
      boxShadow: '0 0 24px rgba(0,0,0,0.18)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '2px solid #222',
    }}>
      <div style={{ background: '#222', color: '#fff', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ChatbotIcon />
          <span style={{ fontWeight: 600, fontSize: 20 }}>TKBot</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', fontWeight: 700, marginLeft: 10 }}>×</button>
      </div>
      <div style={{ flex: 1, background: '#f4f4f4', padding: 18, overflowY: 'auto' }}>
        {/* Bot greeting */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
          <ChatbotIcon />
          <div style={{ background: '#222', color: '#fff', borderRadius: 12, padding: '12px 18px', fontSize: 17, maxWidth: 220, textAlign: 'left' }}>
            Hey! I'm TK, an automated assistant of TrapKings. How can I help you today?
          </div>
        </div>
        {/* Chat history */}
        {chatHistory.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <ChatbotIcon />
            <div style={{ background: '#fff', color: '#222', borderRadius: 12, padding: '12px 18px', fontSize: 16, maxWidth: 220, textAlign: 'left', border: '1px solid #ddd' }}>
              {entry.type === 'product' ? (
                <div>
                  <div style={{ marginBottom: 10 }}>Fresh out the shadows. Meet <b>{entry.data.name}</b> — {entry.data.description || 'our latest drop!'} Click <b>View</b> for more details.</div>
                  <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
                    <img src={entry.data.images ? getImageUrl(entry.data.images.split(',')[0].trim()) : getImageUrl(entry.data.image)} alt={entry.data.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, background: '#222', marginBottom: 10 }} />
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{entry.data.name}</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>₱{String(entry.data.price).replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    <a href={`/trapkings/products/${entry.data.id}`} style={{ textDecoration: 'none', color: '#222', fontWeight: 600, fontSize: 15, border: '1px solid #222', borderRadius: 6, padding: '8px 22px', background: '#fafafa', transition: 'background 0.2s' }}>View</a>
                  </div>
                </div>
              ) : entry.type === 'howto' ? (
                renderHowToOrder()
              ) : entry.type === 'sizes' ? (
                <span>
                  We offer sizes S, M, L, XL, and XXL for most products. Check the{' '}
                  <a
                    href="/trapkings/sizechart"
                    style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    Size Chart
                  </a>{' '}
                  for detailed measurements to find your perfect fit.
                </span>
              ) : entry.type === 'error' ? (
                <span>{entry.data}</span>
              ) : (
                renderFAQWithLinks(entry.data)
              )}
            </div>
          </div>
        ))}
        {/* Loading spinner for product */}
        {loadingProduct && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <ChatbotIcon />
            <div style={{ background: '#fff', color: '#222', borderRadius: 12, padding: '12px 18px', fontSize: 16, maxWidth: 220, textAlign: 'left', border: '1px solid #ddd' }}>
              Loading latest product...
            </div>
          </div>
        )}
        {/* Sign in prompt */}
        {showSignInPrompt && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <ChatbotIcon />
            <div style={{ background: '#fff', color: '#222', borderRadius: 12, padding: '12px 18px', fontSize: 16, maxWidth: 220, textAlign: 'left', border: '1px solid #ddd' }}>
              Please <a href="/trapkings/signin" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}>sign in</a> first to continue.
            </div>
          </div>
        )}
        {/* Next choices */}
        {availableChoices.length > 0 && !loadingProduct && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
            {availableChoices.map((choice, idx) => {
              // Find real index in chatbotChoices
              const realIdx = chatbotChoices.findIndex(c => c.label === choice.label);
              return (
                <button
                  key={choice.label}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#eee',
                    color: '#222',
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginBottom: 8,
                  }}
                  onClick={() => handleChoice(realIdx)}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

function AppContent() {
  const footerRef = useRef();
  const [showChatPrompt, setShowChatPrompt] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [footerWasVisible, setFooterWasVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowChatPrompt(true);
          setFooterWasVisible(true);
        } else if (!footerWasVisible) {
          setShowChatPrompt(false);
        }
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [footerWasVisible]);

  // If the prompt was ever shown, keep it visible
  const shouldShowPrompt = showChatPrompt || footerWasVisible;

  // Check if current path is admin - updated to be more precise
  const isAdminPath = location.pathname.includes('/admin');

  return (
    <>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/products" element={<><Navbar /><Product /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/signin" element={<><Navbar /><Signin /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /></>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/faqs" element={<><Navbar /><Faq /></>} />
        <Route path="/userprofile" element={<><Navbar /><UserProfile /></>} />
        <Route path="/usercart" element={<><Navbar /><UserCart /></>} />
        <Route path="/trapkings/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicy /></>} />
        <Route path="/terms-of-service" element={<><Navbar /><TermsOfService /></>} />
        <Route path="/tnc" element={<><Navbar /><TnC /></>} />
        <Route path="/sizechart" element={<SizeChart />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/rne" element={<><Navbar /><RnE /></>} />

        {/* Admin routes (no Navbar, each page has AdminNavbar inside) */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/order" element={<Order />} />
        <Route path="/admin/upload-order" element={<UploadOrder />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/manage-user" element={<ManageUser />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Routes>
      {/* Only show Footer for non-admin pages */}
      {!isAdminPath && <Footer ref={footerRef} />}
      {shouldShowPrompt && !chatbotOpen && !isAdminPath && (
        <div
          style={{
            position: 'fixed',
            bottom: 110,
            right: 36,
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            background: 'none',
            flexDirection: 'row-reverse',
          }}
          onClick={() => setChatbotOpen(true)}
        >
          <ChatbotIcon />
        </div>
      )}
      {chatbotOpen && <ChatbotModal onClose={() => setChatbotOpen(false)} />}
    </>
  );
}

function App() {
  return (
    <Router basename="/trapkings">
      <AppContent />
    </Router>
  );
}

export default App;