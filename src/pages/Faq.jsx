import React from 'react';
import Navbar from '../components/Navbar';
import faqBg from '../assets/faq.jpg';

const faqs = [
  // Account & Profile
  {
    section: 'Account & Profile',
    qas: [
      {
        question: 'How do I register for an account?',
        answer: 'Click the "Register" button in the top right and fill out the form with your username, email, and password.'
      },
      {
        question: 'How do I sign in?',
        answer: 'Click "Sign In" in the top right and enter your registered username and password.'
      },
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Click "Forgot password? Reset here" on the sign-in page, or use the "Forgot Password? Click Here" link in your profile to go to the reset password page.'
      },
      {
        question: 'How do I update my profile information?',
        answer: 'Go to your profile page, select "Profile Info," and use the form to change your username or email. Changes are saved instantly and reflected everywhere.'
      },
      {
        question: 'How do I change my password?',
        answer: 'In your profile, select "Change Password." Enter your current password, then your new password. You can also use the "Forgot Password" link if you can\'t remember your current password.'
      },
    ]
  },
  // Orders & Shopping
  {
    section: 'Orders & Shopping',
    qas: [
      {
        question: 'How do I add products to my cart?',
        answer: 'Sign in, go to the product page, select your size (S, M, L, XL, XXL), and click "Add to Cart."'
      },
      {
        question: 'Why can\'t I add items to my cart or choose a size?',
        answer: 'You must be signed in to select a size and add items to your cart.'
      },
      {
        question: 'How do I check out?',
        answer: 'Go to your cart, review your items, and click "Check Out." Fill in your shipping details, accept the terms & conditions, and confirm your order.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We currently accept Cash on Delivery only.'
      },
      {
        question: 'How do I view my orders or order status?',
        answer: 'After signing in, go to your profile and select "My Orders" for active orders, "In Transit" for shipped orders, and "Order History" for completed or cancelled orders.'
      },
      {
        question: 'Can I cancel or change my order?',
        answer: 'You can cancel an order from "My Orders" if it hasn\'t shipped yet. Once an order is confirmed and paid, it can no longer be changed.'
      },
    ]
  },
  // Shipping, Returns & Support
  {
    section: 'Shipping, Returns & Support',
    qas: [
      {
        question: 'How do I update my shipping address?',
        answer: 'In your profile, select "Shipping Address" and update your details. Changes are saved and used for your next order.'
      },
      {
        question: 'How much is the shipping fee?',
        answer: 'Shipping may vary for each order. The exact fee will be shown at checkout.'
      },
      {
        question: 'How do I request a return or exchange?',
        answer: 'Go to your profile and select "Support/Returns" for our policy. Contact us within 7 days if you received a defective or incorrect item. Items must be unused and in original packaging.'
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We do not accept refunds under any circumstances. Exchanges are possible for eligible cases.'
      }
    ]
  },
  // Policies & Terms
  {
    section: 'Policies & Terms',
    qas: [
      {
        question: 'Where can I read your Terms & Conditions and Privacy Policy?',
        answer: 'Links to our Terms & Conditions and Privacy Policy are in the website footer and during checkout.'
      },
      {
        question: 'How do I view the size chart?',
        answer: 'Click "Size Chart" in the navigation bar for detailed sizing information.'
      },
    ]
  },
];

const Faq = () => (
  <div style={{
    minHeight: '100vh',
    width: '100vw',
    background: `url(${faqBg}) center center/cover no-repeat`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    margin: 0
  }}>
    <Navbar />
    <section className="faq-section" style={{ maxWidth: 1400, margin: '0 auto', padding: '3rem 1rem 0 1rem', width: '100%' }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: '3.5rem 2.5rem 2.5rem 2.5rem',
        margin: '100px auto 2.5rem auto',
        maxWidth: 1000,
        textAlign: 'center',
        position: 'relative',
        top: 0,
        zIndex: 2
      }}>
        <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 600, fontSize: '2.5rem', color: '#222', textAlign: 'center', letterSpacing: 1, marginBottom: '2.5rem', marginTop: '1.5rem' }}>FREQUENTLY ASKED QUESTIONS</h2>
        {faqs.map((section, idx) => (
          <div key={idx} style={{ marginBottom: 40, textAlign: 'left' }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, color: '#111', margin: '2rem 0 1.2rem 0', letterSpacing: 1 }}>{section.section}</h2>
      <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', justifyContent: 'center' }}>
              {section.qas.map((faq, index) => (
          <div key={index} className="faq-card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', padding: '2rem 2rem 1.5rem 2rem', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>{faq.question}</h3>
            <p style={{ fontSize: '1.1rem', color: '#444', fontWeight: 400 }}>{faq.answer}</p>
          </div>
        ))}
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center', color: '#555', fontSize: 18, margin: '2.5rem 0 1.5rem 0' }}>
          If you have more questions, please contact us at <b>supporttrapkings@gmail.com</b> or call <b>+63-947-1050-509</b>.
        </div>
      </div>
    </section>
  </div>
);

export default Faq;