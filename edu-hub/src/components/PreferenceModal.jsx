import React from 'react';
import {
  School,
  GraduationCap,
  BookOpen,
  Briefcase,
  Sparkles,
  X,
  Check,
  ArrowRight,
  Code2,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useUserPreference, PERSONAS } from '../context/UserPreferenceContext';
import './PreferenceModal.css';

const ICON_MAP = {
  School: School,
  GraduationCap: GraduationCap,
  BookOpen: BookOpen,
  Briefcase: Briefcase,
  Sparkles: Sparkles,
};

export default function PreferenceModal() {
  const { personaId, activePersona, isOnboardingOpen, closePreferenceModal, selectPersona } = useUserPreference();

  if (!isOnboardingOpen) return null;

  return (
    <div className="pref-modal-overlay" onClick={personaId ? closePreferenceModal : undefined}>
      <div className="pref-modal-container" onClick={e => e.stopPropagation()}>
        <div className="pref-modal-header">
          <div className="pref-modal-title-wrap">
            <div className="pref-icon-halo">
              <Sparkles size={22} className="pref-header-sparkle" />
            </div>
            <div>
              <h2 className="pref-modal-title">Customize Your Learning Track</h2>
              <p className="pref-modal-subtitle">
                Select your current focus to curate tutorials, mock interviews, and code playgrounds specifically for your curriculum and goals.
              </p>
            </div>
          </div>
          {personaId && (
            <button className="pref-close-btn" onClick={closePreferenceModal} title="Close">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="pref-grid">
          {Object.values(PERSONAS).map(p => {
            const IconComp = ICON_MAP[p.iconName] || BookOpen;
            const isSelected = personaId === p.id;

            return (
              <div
                key={p.id}
                className={`pref-card ${isSelected ? 'selected' : ''}`}
                style={{ '--card-accent': p.color }}
                onClick={() => selectPersona(p.id)}
              >
                <div className="pref-card-top">
                  <div className="pref-card-icon" style={{ background: `${p.color}1a`, color: p.color }}>
                    <IconComp size={22} />
                  </div>
                  <span className="pref-card-badge" style={{ background: `${p.color}15`, color: p.color }}>
                    {p.badge}
                  </span>
                  {isSelected && (
                    <div className="pref-check-badge">
                      <Check size={14} /> Active
                    </div>
                  )}
                </div>

                <h3 className="pref-card-title">{p.title}</h3>
                <p className="pref-card-desc">{p.description}</p>

                <div className="pref-card-focus">
                  <span className="pref-focus-label">Primary Languages:</span>
                  <div className="pref-lang-tags">
                    {p.recommendedLangs.map(lang => (
                      <span key={lang} className="pref-tag">
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pref-card-action">
                  <span>{isSelected ? 'Currently Selected' : 'Select Track'}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pref-modal-footer">
          <div className="pref-privacy-note">
            <ShieldCheck size={16} />
            <span>Preferences are stored locally in your browser. No account or database required. You can change this anytime from the header.</span>
          </div>
          {personaId && (
            <button className="pref-continue-btn" onClick={closePreferenceModal}>
              Continue with {activePersona?.shortTitle || 'Current Track'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
