import React, { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://localhost/trapkings-api/${path.replace(/^\/+/,'')}`;
}

function getCartKey() {
  const userId = localStorage.getItem('userId');
  return userId ? `cart_${userId}` : 'cart_guest';
}

function getAddressKey() {
  const userId = localStorage.getItem('userId');
  return userId ? `address_${userId}` : 'address_guest';
}

const UserCart = () => {
  const [cart, setCart] = useState([]);
  const [shipping] = useState(40);
  const [codChecked, setCodChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [showCheckoutNotification, setShowCheckoutNotification] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(getCartKey())) || [];
    setCart(storedCart);
    const savedAddress = localStorage.getItem(getAddressKey());
    setShippingAddress(savedAddress || '');
  }, [location]);

  // Listen for localStorage changes (e.g., if another tab updates shipping info)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === getAddressKey()) {
        setShippingAddress(e.newValue || '');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleQuantityChange = (id, size, delta) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.id === id && item.size === size) {
          const newQty = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem(getCartKey(), JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleRemove = (id, size) => {
    const newCart = cart.filter(item => !(item.id === id && item.size === size));
    setCart(newCart);
    localStorage.setItem(getCartKey(), JSON.stringify(newCart));
  };

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const orderTotal = subtotal + shipping;
  const formatPrice = (num) => Number(num).toLocaleString('en-US');

  const handleCheckout = async () => {
    if (!codChecked) {
      alert('You need to select a payment.');
      return;
    }
    if (!termsChecked) {
      alert('You need to accept the terms and conditions.');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const shippingAddressObj = JSON.parse(localStorage.getItem(getAddressKey()) || '{}');

    // Require full name and shipping address for new users
    if (!shippingAddressObj.fullName || !shippingAddressObj.address) {
      alert('Please provide your full name and shipping address before checking out.');
      navigate('/userprofile', { state: { openShipping: true } });
      return;
    }

    // Create order data with all necessary information
    const orderData = {
      name: user.username,
      email: user.email,
      order_total: orderTotal,
      shipping: shipping,
      full_name: shippingAddressObj.fullName || user.username,
      shipping_address: shippingAddressObj.address || '',
      delivery_note: shippingAddressObj.note || '',
      method_of_payment: 'Cash on Delivery',
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        size: item.size || '',
        image: item.image
      }))
    };

    try {
      const response = await fetch('http://localhost/trapkings-api/create_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const result = await response.json();
      if (result.success) {
        setCart([]);
        localStorage.setItem(getCartKey(), JSON.stringify([]));
        setShowCheckoutNotification(true);
        setTimeout(() => {
          setShowCheckoutNotification(false);
          navigate('/userprofile', { state: { openOrders: true } });
        }, 1800);
      } else {
        alert('Failed to place order: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to place order: ' + err.message);
    }
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', padding: '40px 0', marginTop: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 40 }}>
        {/* Cart List */}
        <div style={{ flex: 2 }}>
          <h1 style={{ fontFamily: 'serif', fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Shopping Cart</h1>
          {cart.length === 0 ? (
            <div style={{ color: '#888', fontSize: 20, marginTop: 40 }}>Your cart is empty.</div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id + '-' + (item.size || '')} style={{ display: 'flex', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                  <img src={getImageUrl(item.image || (item.images ? item.images.split(',')[0] : ''))} alt={item.name} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 6, marginRight: 16 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: '#666', fontSize: 15 }}>₱{formatPrice(item.price)}</div>
                    {item.size && <div style={{ color: '#888', fontSize: 14 }}>Size: {item.size}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => handleQuantityChange(item.id, item.size, -1)} style={{ padding: '2px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', fontWeight: 700, fontSize: 18 }}>-</button>
                    <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity || 1}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.size, 1)} style={{ padding: '2px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', fontWeight: 700, fontSize: 18 }}>+</button>
                  </div>
                  <div style={{ width: 80, textAlign: 'right', fontWeight: 600 }}>₱{formatPrice(Number(item.price) * (item.quantity || 1))}</div>
                  <button onClick={() => handleRemove(item.id, item.size)} style={{ marginLeft: 16, color: '#d32f2f', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
              <div style={{ marginTop: 24, fontWeight: 700, fontSize: 20 }}>Subtotal ₱{formatPrice(subtotal)}</div>
            </>
          )}
        </div>
        {/* Checkout Section */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>
          <h2 style={{ fontFamily: 'serif', fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Checkout</h2>
          <div style={{ marginBottom: 16 }}>
            {(() => {
              let obj = null;
              try {
                obj = JSON.parse(shippingAddress);
              } catch {}
              return (
                <>
                  {/* Full Name */}
                  <div style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                    <span>Full Name</span>
                    <FaPen
                      style={{ cursor: 'pointer', fontSize: 16, marginLeft: 8 }}
                      title="Edit"
                      onClick={() => navigate('/userprofile', { state: { openShipping: true } })}
                    />
                  </div>
                  <div style={{ color: '#888', fontSize: 15, marginBottom: 8, marginLeft: 2 }}>
                    {obj && obj.fullName ? obj.fullName : '[User\'s full name here]'}
                  </div>
                  {/* Shipping Address */}
                  <div style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                    <span>Shipping Address</span>
                    <FaPen
                      style={{ cursor: 'pointer', fontSize: 16, marginLeft: 8 }}
                      title="Edit"
                      onClick={() => navigate('/userprofile', { state: { openShipping: true } })}
                    />
                  </div>
                  <div style={{ color: '#888', fontSize: 15, marginBottom: 8, marginLeft: 2 }}>
                    {obj && obj.address ? obj.address : "[User's shipping address here]"}
                  </div>
                  {/* Delivery Note */}
                  <div style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                    <span>Delivery Note</span>
                    <FaPen
                      style={{ cursor: 'pointer', fontSize: 16, marginLeft: 8 }}
                      title="Edit"
                      onClick={() => navigate('/userprofile', { state: { openShipping: true } })}
                    />
                  </div>
                  <div style={{ color: '#888', fontSize: 15, marginLeft: 2 }}>
                    {obj && obj.note ? obj.note : '[User\'s delivery note here]'}
                  </div>
                </>
              );
            })()}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
              <span>Subtotal</span>
              <span>₱{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
              <span>Shipping</span>
              <span>₱{formatPrice(shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, marginTop: 8 }}>
              <span>Order Total</span>
              <span>₱{formatPrice(orderTotal)}</span>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Payment</div>
            <div>
              <input
                type="checkbox"
                checked={codChecked}
                onChange={e => setCodChecked(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Cash on Delivery
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={e => setTermsChecked(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              <label htmlFor="acceptTerms" style={{ fontSize: 16 }}>
                I accept the terms & conditions<br />
                <span style={{ color: '#888', fontSize: 14 }}>
                  <Link to="/tnc" style={{ color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>Read our T&Cs</Link>
                </span>
              </label>
            </div>
          </div>
          <button
            style={{
              width: '100%',
              background: '#222',
              color: '#fff',
              padding: 16,
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              border: 'none',
              cursor: codChecked && termsChecked ? 'pointer' : 'not-allowed',
            }}
            disabled={!(codChecked && termsChecked)}
            onClick={handleCheckout}
          >
            Check Out
          </button>
          {showCheckoutNotification && (
            <div style={{
              position: 'fixed',
              top: 30,
              right: 30,
              background: '#222',
              color: '#fff',
              padding: '16px 28px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 17,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 9999
            }}>
              Successfully checked out! Your order has been placed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCart;
