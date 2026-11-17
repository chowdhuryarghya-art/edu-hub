import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Zap, 
  Crown, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Award, 
  ArrowRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import './ProUpgradeModal.css';

export default function ProUpgradeModal({ isOpen, onClose }) {
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' | 'yearly'
  const [purchasedPlan, setPurchasedPlan] = useState(null);

  if (!isOpen) return null;

  const handleCheckout = (planName) => {
    setPurchasedPlan(planName);
    // Persist pro flag in localStorage
    localStorage.setItem('eduhub_pro_member', 'true');
  };

  return (
    <div className="pro-modal-backdrop" onClick={onClose}>
      <div className="pro-modal-card" onClick={e => e.stopPropagation()}>
        <button className="pro-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {purchasedPlan ? (
          <div className="pro-success-state">
            <div className="success-badge-icon">
              <Crown size={36} color="#f59e0b" />
            </div>
            <h2>Welcome to Edu Hub Pro!</h2>
            <p>You have unlocked full access to all FAANG System Design templates, Anki decks, and printable architectural cheat sheets.</p>
            <button className="pro-start-btn" onClick={() => { setPurchasedPlan(null); onClose(); }}>
              Start Exploring Pro Features <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="pro-modal-header">
              <div className="pro-tag">
                <Crown size={14} />
                <span>Edu Hub Pro & Architect Studio</span>
              </div>
              <h2>Fast-Track Your Senior Engineering Career</h2>
              <p>Everything you need to master distributed systems, ace senior staff interviews, and design production-grade cloud architectures.</p>

              {/* Billing Toggle */}
              <div className="billing-toggle-wrap">
                <button 
                  className={`toggle-opt ${billingCycle === 'monthly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly Billing
                </button>
                <button 
                  className={`toggle-opt ${billingCycle === 'yearly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly Billing <span className="save-badge">Save 35%</span>
                </button>
              </div>
            </div>

            {/* Pricing Grid */}
            <div className="pro-pricing-grid">
              {/* Free Tier */}
              <div className="pricing-card free-tier">
                <div className="card-header">
                  <h3>Community Free</h3>
                  <div className="price-display">
                    <span className="amount">$0</span>
                    <span className="period">forever</span>
                  </div>
                  <p className="card-desc">Essential developer tutorials and interactive basics.</p>
                </div>

                <ul className="tier-features">
                  <li><Check size={16} className="feat-check" /> 5 Foundational Tech Tracks</li>
                  <li><Check size={16} className="feat-check" /> In-Browser JavaScript & Python Scratchpad</li>
                  <li><Check size={16} className="feat-check" /> Standard System Design Canvas</li>
                  <li><Check size={16} className="feat-check" /> 50 Basic Flashcards</li>
                </ul>

                <button className="tier-btn secondary" onClick={onClose}>
                  Current Free Plan
                </button>
              </div>

              {/* Pro Tier */}
              <div className="pricing-card pro-tier highlight">
                <div className="popular-badge">MOST POPULAR</div>
                <div className="card-header">
                  <h3>Edu Hub Pro</h3>
                  <div className="price-display">
                    <span className="amount">{billingCycle === 'yearly' ? '$8' : '$14'}</span>
                    <span className="period">/ month {billingCycle === 'yearly' && '(billed $96/yr)'}</span>
                  </div>
                  <p className="card-desc">For engineers targeting L5/L6 Senior & Staff roles.</p>
                </div>

                <ul className="tier-features">
                  <li><Check size={16} className="feat-check" /> <strong>All Free Features</strong></li>
                  <li><Check size={16} className="feat-check" /> <strong>FAANG System Design Blueprints</strong> (Netflix, WhatsApp, Uber)</li>
                  <li><Check size={16} className="feat-check" /> <strong>One-Click Anki Deck Exporter (.tsv)</strong></li>
                  <li><Check size={16} className="feat-check" /> <strong>Print-Ready PDF Architect Cheat Sheets</strong></li>
                  <li><Check size={16} className="feat-check" /> <strong>Timed Mock Interview Arena with Talking Points</strong></li>
                </ul>

                <button className="tier-btn primary" onClick={() => handleCheckout('Edu Hub Pro')}>
                  <Zap size={16} /> Unlock Edu Hub Pro
                </button>
              </div>

              {/* Lifetime / Staff Tier */}
              <div className="pricing-card lifetime-tier">
                <div className="card-header">
                  <h3>Staff Architect Pass</h3>
                  <div className="price-display">
                    <span className="amount">$149</span>
                    <span className="period">one-time payment</span>
                  </div>
                  <p className="card-desc">Lifetime access + 1-on-1 resume/architecture review.</p>
                </div>

                <ul className="tier-features">
                  <li><Check size={16} className="feat-check" /> <strong>Lifetime Access</strong> to all current & future tracks</li>
                  <li><Check size={16} className="feat-check" /> <strong>1x 45-min 1-on-1 Mock Interview</strong> or Architecture Review</li>
                  <li><Check size={16} className="feat-check" /> <strong>High-Res Printable Laminated Cheat Sheet Pack</strong></li>
                  <li><Check size={16} className="feat-check" /> <strong>Private Discord Architect Community</strong></li>
                </ul>

                <button className="tier-btn lifetime" onClick={() => handleCheckout('Staff Architect Pass')}>
                  <Crown size={16} /> Get Lifetime Pass
                </button>
              </div>
            </div>

            <div className="pro-modal-footer">
              <span className="guarantee">
                <ShieldCheck size={16} /> 14-day 100% money-back guarantee • Secure checkout via Stripe / LemonSqueezy
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
