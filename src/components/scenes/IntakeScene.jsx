import React, { useState } from 'react';
import { getChoreoSVG } from '@/lib/sfa/discArt';

function Choreo({ id }) {
  return <div dangerouslySetInnerHTML={{ __html: getChoreoSVG(id) }} />;
}

export default function IntakeScene({ scene, onSubmit }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ready = firstName.trim().length >= 1 && lastName.trim().length >= 1 && emailOk && gender;

  const handleSubmit = () => {
    if (!firstName.trim()) { setError('First name is required.'); return; }
    if (!lastName.trim()) { setError('Last name is required.'); return; }
    if (!emailOk) { setError('Please enter a valid email.'); return; }
    if (!gender) { setError('Please choose how we should address you.'); return; }
    onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), gender });
  };

  const genders = [
    { key: 'she', label: 'She / Her', sub: 'female-presenting character' },
    { key: 'he', label: 'He / Him', sub: 'male-presenting character' },
    { key: 'they', label: 'They / Them', sub: 'androgynous-presenting character' }
  ];

  return (
    <div className="sfa-scene-inner sfa-layout-centered">
      <div className="sfa-intake-block">
        <Choreo id="grid" />
        <div className="sfa-eyebrow sfa-reveal-word">{scene.eyebrow}</div>
        <h2 className="sfa-display sfa-reveal-word"
          style={{ fontSize: 'clamp(28px,3.6vw,52px)', fontStyle: 'italic', margin: '8px 0 4px', transitionDelay: '300ms' }}>
          {scene.title}
        </h2>
        <div className="sfa-body-text sfa-reveal-word"
          style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 17, color: 'var(--ink-mute)', transitionDelay: '600ms' }}>
          {scene.sub}
        </div>

        <div className="sfa-intake-grid" style={{ marginTop: 32 }}>
          <div className="sfa-intake-field sfa-reveal-word" style={{ transitionDelay: '900ms' }}>
            <label className="sfa-intake-label">First name</label>
            <input className="sfa-intake-input" type="text" placeholder="What we will call you"
              value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div className="sfa-intake-field sfa-reveal-word" style={{ transitionDelay: '1050ms' }}>
            <label className="sfa-intake-label">Last name</label>
            <input className="sfa-intake-input" type="text" placeholder=""
              value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <div className="sfa-intake-field full sfa-reveal-word" style={{ transitionDelay: '1200ms' }}>
            <label className="sfa-intake-label">Email</label>
            <input className="sfa-intake-input" type="email" placeholder="your@email"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="sfa-intake-field full sfa-reveal-word" style={{ transitionDelay: '1400ms', marginTop: 12 }}>
          <label className="sfa-intake-label">How should we address you, and render your character?</label>
          <div className="sfa-intake-gender">
            {genders.map(g => (
              <div key={g.key}
                className={`sfa-intake-gender-opt${gender === g.key ? ' selected' : ''}`}
                onClick={() => setGender(g.key)}>
                <span className="opt-label">{g.label}</span>
                <span className="opt-sub">{g.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sfa-intake-consent sfa-reveal-word" style={{ transitionDelay: '1700ms' }}>
          Your details stay on this device. They are used to personalise the story and your result.
        </div>
        {error && <div className="sfa-intake-error">{error}</div>}

        <div className="sfa-reveal-word" style={{ transitionDelay: '2100ms' }}>
          <button className={`sfa-q-advance${ready ? ' ready' : ''}`} onClick={handleSubmit}>
            <span>Enter the chamber</span>
            <span className="arrow"></span>
          </button>
        </div>
      </div>
    </div>
  );
}