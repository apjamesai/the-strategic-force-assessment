import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SKINS, SKIN_LIST, getActiveSkinId, setActiveSkinId } from '@/lib/sfa/skins/index';
import { SkinProvider } from '@/lib/sfa/SkinContext';
import {
  FRAMEWORK, MOCK_PROFILES,
  RULE_DEFAULTS, rebuildScores, computeResults, getRunningFlags,
  pickArchetype, pickSecondaryPattern, bandFor, overallBand, riskBand,
  applyConditional, personalizeScene
} from '@/lib/sfa/engine';
import { PRACTICE_ICONS, RISK_ICONS, STEP_ICONS } from '@/lib/sfa/icons';
import { wordReveal } from '@/lib/wordReveal';

// Chrome components
import ProgressRail from '@/components/chrome/ProgressRail';
import LocationTag from '@/components/chrome/LocationTag';
import LogoTopRight from '@/components/chrome/LogoTopRight';
import BLStack from '@/components/chrome/BLStack';
import TimerRing from '@/components/chrome/TimerRing';
import NavStrip from '@/components/chrome/NavStrip';

// SceneSlot (double-rAF)
import SceneSlot from '@/components/SceneSlot';

// Scene components
import LandingScene from '@/components/scenes/LandingScene';
import SkinSelectScene from '@/components/scenes/SkinSelectScene';
import IntakeScene from '@/components/scenes/IntakeScene';
import CrawlScene from '@/components/scenes/CrawlScene';
import NarrativeScene from '@/components/scenes/NarrativeScene';
import NarrativeQuoteScene from '@/components/scenes/NarrativeQuoteScene';
import QuestionScene from '@/components/scenes/QuestionScene';
import MidpointScene from '@/components/scenes/MidpointScene';
import TwistScene from '@/components/scenes/TwistScene';
import EndReflectionScene from '@/components/scenes/EndReflectionScene';
import ResultsLaunchScene from '@/components/scenes/ResultsLaunchScene';

// ─── Initial state ───────────────────────────────────────────
const initialScores = () => ({
  practices: {
    understand_self: [], master_emotions: [], embed_practices: [],
    be_curious: [], listen_deeply: [], think_critically: [],
    unlock_creativity: [], manage_uncertainty: [], future_focused: [],
    act_decisively: [], collaborate_inclusively: [], influence_effortlessly: []
  },
  risks: { control_bias: [], moral_drift: [], detachment_pressure: [] }
});

// ─── SVG icon renderers ──────────────────────────────────────
function PracticeIcon({ k }) {
  return <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1" dangerouslySetInnerHTML={{ __html: PRACTICE_ICONS[k] || '' }} />;
}
function RiskIcon({ k }) {
  return <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1" dangerouslySetInnerHTML={{ __html: RISK_ICONS[k] || '' }} />;
}
function StepIcon({ k }) {
  return <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1" dangerouslySetInnerHTML={{ __html: STEP_ICONS[k] || '' }} />;
}

// ─── Archetype portrait SVGs ─────────────────────────────────
const ARCHETYPE_ART_SVG = {
  reactive_defender: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="rd1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="rdG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8a4a" stopOpacity="0.6"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="rdBlur"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#rd1)"/>
      <ellipse cx="190" cy="380" rx="170" ry="22" fill="rgba(255,90,44,0.18)" filter="url(#rdBlur)"/>
      <path d="M 80 380 L 90 280 L 130 250 L 150 200 L 160 170 L 190 150 L 220 170 L 230 200 L 250 250 L 290 280 L 300 380 Z" fill="#0e0907" stroke="rgba(255,90,44,0.45)" strokeWidth="0.8"/>
      <circle cx="190" cy="155" r="22" fill="#0e0907" stroke="rgba(255,90,44,0.5)" strokeWidth="0.6"/>
      <ellipse cx="190" cy="340" rx="180" ry="40" fill="url(#rdG)" filter="url(#rdBlur)"/>
    </svg>
  ),
  tactical_survivor: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="ts1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="tsG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8a4a" stopOpacity="0.6"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="tsBlur"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#ts1)"/>
      <ellipse cx="190" cy="380" rx="160" ry="20" fill="rgba(255,90,44,0.15)" filter="url(#tsBlur)"/>
      <path d="M 150 380 L 170 230 L 195 150 L 215 230 L 230 380 L 200 380 L 205 280 L 195 280 L 185 380 Z" fill="#0e0907" stroke="rgba(255,90,44,0.5)" strokeWidth="0.7"/>
      <circle cx="195" cy="130" r="20" fill="#0e0907" stroke="rgba(255,90,44,0.55)" strokeWidth="0.7"/>
      <circle cx="120" cy="100" r="42" fill="url(#tsG)" filter="url(#tsBlur)"/>
      <circle cx="120" cy="100" r="22" fill="#ff5a2c" opacity="0.7"/>
    </svg>
  ),
  hidden_drifter: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="hd1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="hdG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8a4a" stopOpacity="0.55"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="hdBlur"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#hd1)"/>
      <path d="M 130 380 L 140 200 L 165 130 L 190 200 L 200 380 Z" fill="rgba(20,16,12,0.6)" stroke="rgba(255,90,44,0.25)" strokeWidth="0.6" filter="url(#hdBlur)" opacity="0.6"/>
      <circle cx="165" cy="115" r="18" fill="rgba(20,16,12,0.6)" stroke="rgba(255,90,44,0.25)" strokeWidth="0.5" opacity="0.6"/>
      <path d="M 175 380 L 185 200 L 210 130 L 235 200 L 245 380 Z" fill="#0e0907" stroke="rgba(255,90,44,0.55)" strokeWidth="0.7"/>
      <circle cx="210" cy="115" r="20" fill="#0e0907" stroke="rgba(255,90,44,0.6)" strokeWidth="0.7"/>
      <ellipse cx="180" cy="270" rx="20" ry="160" fill="url(#hdG)" filter="url(#hdBlur)" opacity="0.5"/>
    </svg>
  ),
  strategic_operator: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="so1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="soG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8a4a" stopOpacity="0.6"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="soBlur"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#so1)"/>
      <path d="M 130 370 L 150 220 L 170 140 L 185 110 L 195 110 L 210 140 L 230 220 L 250 370 Z" fill="#0e0907" stroke="rgba(255,90,44,0.65)" strokeWidth="0.8"/>
      <circle cx="190" cy="100" r="22" fill="#0e0907" stroke="rgba(255,90,44,0.7)" strokeWidth="0.8"/>
      <circle cx="190" cy="100" r="50" fill="none" stroke="rgba(255,90,44,0.4)" strokeWidth="0.5"/>
      <circle cx="190" cy="200" r="120" fill="url(#soG)" filter="url(#soBlur)" opacity="0.4"/>
    </svg>
  ),
  force_multiplier: (
    <svg viewBox="0 0 380 380">
      <defs>
        <radialGradient id="fm1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#2a1f17"/><stop offset="100%" stopColor="#070504"/></radialGradient>
        <radialGradient id="fmG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffab2b" stopOpacity="0.7"/><stop offset="100%" stopColor="#c93a16" stopOpacity="0"/></radialGradient>
        <filter id="fmBlur"><feGaussianBlur stdDeviation="10"/></filter>
      </defs>
      <rect width="380" height="380" fill="url(#fm1)"/>
      <circle cx="190" cy="170" r="140" fill="url(#fmG)" filter="url(#fmBlur)"/>
      <path d="M 150 350 L 165 200 L 180 130 L 200 130 L 215 200 L 230 350 Z" fill="#0e0907" stroke="rgba(255,138,74,0.8)" strokeWidth="1"/>
      <circle cx="190" cy="118" r="18" fill="#0e0907" stroke="rgba(255,138,74,0.85)" strokeWidth="1"/>
    </svg>
  )
};

// ─── Results Page ─────────────────────────────────────────────
const PRACTICE_ORDER = [
  'understand_self','master_emotions','embed_practices',
  'be_curious','listen_deeply','think_critically',
  'unlock_creativity','manage_uncertainty','future_focused',
  'act_decisively','collaborate_inclusively','influence_effortlessly'
];

function WheelSVG({ R, onSelect, onHover }) {
  const cx = 400, cy = 400, innerR = 110, baseR = 180, maxR = 360;
  const segAngle = 30 * Math.PI / 180;
  function pointAt(r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function arcSegment(r0, r1, a0, a1) {
    const [x0,y0]=pointAt(r0,a0), [x1,y1]=pointAt(r0,a1), [x2,y2]=pointAt(r1,a1), [x3,y3]=pointAt(r1,a0);
    return `M ${x0} ${y0} A ${r0} ${r0} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${r1} ${r1} 0 0 0 ${x3} ${y3} Z`;
  }
  const segments = PRACTICE_ORDER.map((key, i) => {
    const score = R.practices[key];
    const a0 = -Math.PI/2 + i * segAngle, a1 = a0 + segAngle;
    const scoreR = baseR + (score/100) * (maxR - baseR);
    const fillOpacity = 0.18 + (score/100) * 0.55;
    return { key, d: arcSegment(innerR, scoreR, a0, a1), fillOpacity, score };
  });
  const rings = [25,50,75,100].map(pct => baseR + (pct/100) * (maxR-baseR));
  const spokes = PRACTICE_ORDER.map((_,i) => {
    const a = -Math.PI/2 + i*segAngle;
    const [x1,y1]=pointAt(innerR,a), [x2,y2]=pointAt(maxR,a);
    return {x1,y1,x2,y2};
  });
  const levelArcs = [
    {L:'L1',startIdx:0},{L:'L2',startIdx:3},{L:'L3',startIdx:6},{L:'L4',startIdx:9}
  ].map(({L,startIdx})=>{
    const a0=-Math.PI/2+startIdx*segAngle, a1=a0+3*segAngle, midA=(a0+a1)/2;
    const r=maxR+26, [tx,ty]=pointAt(r,midA);
    const rot=(midA*180/Math.PI+90), rotFinal=(rot>90&&rot<270)?rot+180:rot;
    return {L,tx,ty,rotFinal,name:FRAMEWORK.levels[L].name};
  });
  return (
    <svg viewBox="0 0 800 800" style={{width:'100%',height:'100%',display:'block',cursor:'pointer'}}>
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1310"/><stop offset="100%" stopColor="#0a0807"/>
        </radialGradient>
      </defs>
      {rings.map((r,i)=><circle key={i} className="sfa-wheel-ring" cx={cx} cy={cy} r={r}/>)}
      {segments.map(({key,d,fillOpacity})=>(
        <path key={key} className="sfa-wheel-segment" d={d}
          fill={`rgba(255,90,44,${fillOpacity.toFixed(3)})`}
          stroke="rgba(255,90,44,0.55)" strokeWidth="0.7"
          onClick={()=>onSelect(key)} onMouseOver={()=>onHover(key)}/>
      ))}
      {spokes.map((s,i)=><line key={i} className="sfa-wheel-spoke" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}/>)}
      <circle className="sfa-wheel-center-disk" cx={cx} cy={cy} r={innerR} fill="url(#centerGlow)"/>
      <text x={cx} y={cy-32} textAnchor="middle" style={{fontSize:14,letterSpacing:'0.32em',textTransform:'uppercase',fill:'var(--ink-mute)',fontFamily:'var(--sans)',fontWeight:400}}>Your wheel</text>
      <text x={cx} y={cy+14} textAnchor="middle" style={{fontSize:38,fill:'var(--amber)',fontStyle:'italic',fontFamily:'var(--serif)'}}>{R.overall}<tspan style={{fontSize:18,fill:'var(--ink-mute)'}}>%</tspan></text>
      <text x={cx} y={cy+44} textAnchor="middle" style={{fontSize:9,fontFamily:'var(--sans)',letterSpacing:'0.3em',fill:'var(--ink-mute)',textTransform:'uppercase'}}>{overallBand(R.overall)}</text>
      {levelArcs.map(({L,tx,ty,rotFinal,name})=>(
        <text key={L} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
          transform={`rotate(${rotFinal} ${tx} ${ty})`}
          style={{fontSize:13,fontStyle:'italic',fill:'var(--ink-mute)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:300,fontFamily:'var(--serif)',pointerEvents:'none'}}>
          {name}
        </text>
      ))}
    </svg>
  );
}

function ResultsPage({ R, archKey, secondaryKey, reflections, onRestart, onDownload,
  archetypes = {}, riskCopy = {}, nextSteps = {}, secondaryPatterns = {} }) {
  // Fall back to engine constants if skin doesn't provide them
  const arch = archetypes[archKey] || {};
  const secondary = secondaryKey ? (secondaryPatterns[secondaryKey] || null) : null;
  const [selectedKey, setSelectedKey] = useState(null);
  const [showTiles, setShowTiles] = useState(false);
  const sortedP = Object.entries(R.practices).sort((a,b)=>b[1]-a[1]);
  const top = sortedP[0], bottom = sortedP[sortedP.length-1];
  const secondaryHardTriggered = secondary && typeof secondary.trigger === 'function' && (()=>{try{return !!secondary.trigger(R);}catch(e){return false;}})();
  const handleSelect = (key) => setSelectedKey(prev=>prev===key?null:key);
  const handleHover = (key) => { if (!selectedKey) setSelectedKey(key); };

  const WheelDetail = () => {
    if (!selectedKey) return (
      <div className="sfa-wheel-detail">
        <div className="sfa-wheel-empty-hint">Hover or tap a segment. The longer the wedge, the stronger that practice — in your pattern.</div>
      </div>
    );
    const p = FRAMEWORK.practices[selectedKey];
    const score = R.practices[selectedKey];
    const band = bandFor(score);
    const copy = score >= 65 ? p.high : p.low;
    return (
      <div className="sfa-wheel-detail">
        <div className="sfa-wheel-detail-eyebrow">{FRAMEWORK.levels[p.level].num} · {FRAMEWORK.levels[p.level].name}</div>
        <div className="sfa-wheel-detail-name">{p.displayLong}</div>
        <div className="sfa-wheel-detail-row">
          <div className="sfa-wheel-detail-score">{score}<span style={{fontSize:'0.4em',color:'var(--ink-mute)',fontStyle:'normal',letterSpacing:'0.1em',marginLeft:4}}>/100</span></div>
          <div className="sfa-wheel-detail-band">{band}</div>
        </div>
        <div className="sfa-wheel-detail-bar"><div className="fill" style={{width:`${score}%`}}></div></div>
        <div className="sfa-wheel-detail-body" dangerouslySetInnerHTML={{__html:copy}}/>
      </div>
    );
  };

  return (
    <div className="sfa-results-inner">
      {/* HERO */}
      <div className="sfa-results-hero-grid">
        <div className="hero-left">
          <div className="sfa-hero-eyebrow">YOUR SCORE</div>
          <div className="sfa-hero-score-mini"><span className="pct">{R.overall}</span><span style={{fontSize:'0.4em',color:'var(--ink-mute)',letterSpacing:'0.05em'}}>%</span></div>
          <div className="sfa-hero-band-line">{arch.band.toUpperCase()}</div>
          <div className="sfa-hero-headline">{arch.headline}</div>
        </div>
        <div className="sfa-archetype-portrait">
          {ARCHETYPE_ART_SVG[archKey] || ARCHETYPE_ART_SVG.strategic_operator}
          <div className="pulse"></div>
        </div>
        <div className="hero-right">
          <div className="sfa-hero-eyebrow">YOUR ARCHETYPE</div>
          <div className="sfa-hero-arch-name">{arch.name}</div>
          {secondary && (
            <div style={{marginTop:18,paddingTop:14,borderTop:'1px solid rgba(255,90,44,0.2)'}}>
              <div style={{fontFamily:'var(--sans)',fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:'var(--amber)',marginBottom:6}}>
                {secondaryHardTriggered?'SECONDARY PATTERN · ACTIVE':'SECONDARY TILT · NEAREST'}
              </div>
              <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:'clamp(20px,2.2vw,28px)',color:'var(--ink)',fontWeight:300,lineHeight:1.2}}>{secondary.name}</div>
              <div style={{fontFamily:'var(--sans)',fontSize:12,lineHeight:1.6,color:'var(--ink-soft)',marginTop:6}}>{secondary.headline}</div>
            </div>
          )}
          <div className="sfa-hero-headline">
            Your strongest practice is <em style={{fontStyle:'italic',color:'var(--ink)'}}>{FRAMEWORK.practices[top[0]].displayLong}</em>.
            Your development edge is <em style={{fontStyle:'italic',color:'var(--ink)'}}>{FRAMEWORK.practices[bottom[0]].displayLong}</em>.
          </div>
        </div>
      </div>

      {/* WHEEL */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Twelve Practices</div>
        <div className="sfa-results-section-display">The strategic mastery framework — yours, mapped.</div>
        <div className="sfa-wheel-stage">
          <div className="sfa-wheel-wrap"><WheelSVG R={R} onSelect={handleSelect} onHover={handleHover}/></div>
          <WheelDetail/>
        </div>
        <div style={{display:showTiles?'block':'none',marginTop:32}}>
          <div style={{fontFamily:'var(--sans)',fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'var(--amber)',marginBottom:16}}>ALL TWELVE — INDEX</div>
          <div className="sfa-practice-grid">
            {PRACTICE_ORDER.map(k=>{
              const p=FRAMEWORK.practices[k], score=R.practices[k];
              return (
                <div key={k} className="sfa-practice-tile">
                  <div className="label">{FRAMEWORK.levels[p.level].num} · {FRAMEWORK.levels[p.level].short}</div>
                  <div className="name">{p.displayLong}</div>
                  <div className="score">{score}<span style={{fontSize:13,fontFamily:'var(--sans)',letterSpacing:'0.2em',marginLeft:6,color:'var(--ink-mute)'}}>/100</span></div>
                  <div className="bar"><div className="fill" style={{width:showTiles?`${score}%`:0}}></div></div>
                  <div className="band">{bandFor(score)}</div>
                  <div className="desc">{score>=65?p.high:p.low}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:24}}>
          <button className="sfa-cta-btn ghost" onClick={()=>setShowTiles(v=>!v)}>
            {showTiles?'Hide the index':'Show all twelve as cards'}
          </button>
        </div>
      </div>

      {/* LEVEL RINGS */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Four Levels</div>
        <div className="sfa-results-section-display">Each level is the average of three practices.</div>
        <div className="sfa-level-pulse-grid">
          {Object.entries(R.levels).map(([k,v])=>{
            const L=FRAMEWORK.levels[k], circ=2*Math.PI*54, target=circ-(v/100)*circ;
            return (
              <div key={k} className="sfa-level-pulse">
                <div className="sfa-level-pulse-tag">{L.num}</div>
                <div className="sfa-level-pulse-ring">
                  <svg viewBox="0 0 120 120">
                    <circle className="sfa-level-pulse-track" cx="60" cy="60" r="54"/>
                    <circle className="sfa-level-pulse-fill" cx="60" cy="60" r="54" style={{strokeDashoffset:target}}/>
                  </svg>
                  <div className="sfa-level-pulse-center"><span className="num">{v}</span><span style={{fontSize:14,color:'var(--ink-mute)',marginLeft:2}}>%</span></div>
                </div>
                <div className="sfa-level-pulse-name">{L.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RISK GAUGES */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Three Watchouts</div>
        <div className="sfa-results-section-display">Not failures — interpretive overlays that make the pattern legible.</div>
        <div className="sfa-risk-gauge-grid">
          {Object.entries(R.risks).map(([k,v])=>{
            const rc=riskCopy[k]||{name:k,low:'',mod:'',high:'',q:''}, band=riskBand(v), copy=v<=30?rc.low:v<=60?rc.mod:rc.high;
            const circumference=2*Math.PI*36, dashOffset=circumference-(v/100)*circumference;
            return (
              <div key={k} className="sfa-risk-gauge">
                <div className="sfa-risk-gauge-header">
                  <div className="sfa-risk-gauge-icon"><RiskIcon k={k}/></div>
                  <div className="sfa-risk-gauge-name">{rc.name}</div>
                </div>
                <div className="sfa-risk-gauge-arc">
                  <div className="sfa-risk-gauge-arc-svg">
                    <svg viewBox="0 0 80 80">
                      <circle className="sfa-risk-gauge-arc-track" cx="40" cy="40" r="36"/>
                      <circle className="sfa-risk-gauge-arc-fill" cx="40" cy="40" r="36" style={{strokeDashoffset:dashOffset}}/>
                    </svg>
                  </div>
                  <div>
                    <div className="sfa-risk-gauge-value-num">{v}<span style={{fontSize:14,color:'var(--ink-mute)',fontFamily:'var(--sans)',letterSpacing:'0.2em',marginLeft:4,fontStyle:'normal'}}>/100</span></div>
                    <div className="sfa-risk-gauge-value-label">{band.name}</div>
                  </div>
                </div>
                <div className="sfa-risk-gauge-body" dangerouslySetInnerHTML={{__html:copy+`<span class="sfa-risk-gauge-q">${rc.q}</span>`}}/>
              </div>
            );
          })}
        </div>
      </div>

      {/* PATTERN PROSE */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Pattern</div>
        <div className="sfa-results-body" dangerouslySetInnerHTML={{__html:arch.body}}/>
        <div className="sfa-results-section-display" style={{marginTop:32}} dangerouslySetInnerHTML={{__html:arch.risk}}/>
      </div>

      {/* DEVELOPMENT FOCUS */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Your Development Focus</div>
        <div className="sfa-results-section-display" dangerouslySetInnerHTML={{__html:arch.focus}}/>
        <div className="sfa-results-body">{arch.next}</div>
      </div>

      {/* NEXT STEPS */}
      <div className="sfa-results-section">
        <div className="sfa-results-section-title">Next Steps — Practices To Test and Trial</div>
        <div className="sfa-results-section-display">Four small, concrete experiments. Pick one. Run it. Notice what shifts.</div>
        <div className="sfa-next-steps-grid">
          {(nextSteps[archKey]||[]).map((step,i)=>(
            <div key={i} className="sfa-next-step-card">
              <div className="sfa-next-step-num">No. {String(i+1).padStart(2,'0')}</div>
              <div className="sfa-next-step-icon"><StepIcon k={step.icon}/></div>
              <div className="sfa-next-step-title">{step.title}</div>
              <div className="sfa-next-step-body">{step.body}</div>
              <div className="sfa-next-step-test">— {step.test}</div>
            </div>
          ))}
        </div>
      </div>

      {/* REFLECTIONS */}
      {Object.values(reflections).some(Boolean) && (
        <div className="sfa-results-section">
          <div className="sfa-results-section-title">Your Reflections</div>
          <div className="sfa-reflection-grid">
            {[
              {key:'reflect_midpoint_thinking',title:'Thinking',sub:'Midpoint — what you noticed about how you think',icon:'question'},
              {key:'reflect_midpoint_feeling',title:'Feeling',sub:'Midpoint — what you noticed about how you feel',icon:'mirror'},
              {key:'reflect_midpoint_behaving',title:'Behaving',sub:'Midpoint — what you noticed about how you behave',icon:'notice'},
              {key:'reflect_strengths',title:'Strengths',sub:'Closing — where you felt most yourself',icon:'multiply'},
              {key:'reflect_beliefs',title:'Beliefs',sub:'Closing — a belief tested by the assessment',icon:'reframe'},
              {key:'reflect_mindset',title:'Mindset',sub:'Closing — the shift that would change everything',icon:'doors'},
              {key:'reflect_behaviour',title:'Behaviour',sub:'Closing — the 90-day practice to build',icon:'experiment'}
            ].filter(r=>reflections[r.key]).map(r=>(
              <div key={r.key} className="sfa-reflection-card">
                <div className="icon"><StepIcon k={r.icon}/></div>
                <div className="title">{r.title}</div>
                <div className="sub">{r.sub}</div>
                <div className="body">{reflections[r.key]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="sfa-cta-block">
        <div className="sfa-cta-line">Strategic capability is not fixed. It can be developed. Your result is a mirror, not a verdict.</div>
        <button className="sfa-cta-btn" onClick={onRestart}>Retake the assessment</button>
        <button className="sfa-cta-btn ghost" onClick={onDownload}>Download your profile</button>
      </div>
    </div>
  );
}

// ─── Apply skin theme CSS variables to document root ─────────
function applySkinTheme(skin) {
  if (!skin?.theme) return;
  const root = document.documentElement;
  Object.entries(skin.theme).forEach(([k, v]) => {
    if (k.startsWith('--')) root.style.setProperty(k, v);
  });
  // Inject font import if present
  if (skin.theme.fontImport) {
    const existingLink = document.getElementById('skin-font-import');
    if (!existingLink || existingLink.href !== skin.theme.fontImport) {
      const link = document.createElement('link');
      link.id = 'skin-font-import';
      link.rel = 'stylesheet';
      link.href = skin.theme.fontImport;
      document.head.appendChild(link);
    }
  }
}

// ─── MAIN ASSESSMENT COMPONENT ───────────────────────────────
export default function Assessment() {
  const [activeSkinId, setActiveSkinIdState] = useState(getActiveSkinId);
  const activeSkin = SKINS[activeSkinId] || SKINS.force_trial;
  const scenes = activeSkin.scenes;
  useEffect(() => {
    const onSkinChange = () => setActiveSkinIdState(getActiveSkinId());
    window.addEventListener('sfa:skin-change', onSkinChange);
    window.addEventListener('storage', (e) => { if (e.key === 'mandarin.assessment.currentSkin') onSkinChange(); });
    return () => {
      window.removeEventListener('sfa:skin-change', onSkinChange);
    };
  }, []);
  const [showSkinSelect, setShowSkinSelect] = useState(true);
  const [current, setCurrent] = useState(0);
  const [outgoing, setOutgoing] = useState(null);
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', gender: 'they' });
  const [answers, setAnswers] = useState({});
  const [reflections, setReflections] = useState({});
  const [scores, setScores] = useState(initialScores);
  const [showResults, setShowResults] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isWhooshing, setIsWhooshing] = useState(false);
  const [timerVisible, setTimerVisible] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  const timerRef = useRef(null);
  const whooshRef = useRef(null);
  const outgoingTimerRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorGlowRef = useRef(null);
  const glowPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const glowAnimRef = useRef(null);

  // Stable refs
  const currentRef = useRef(current);
  currentRef.current = current;
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const scoresRef = useRef(scores);
  scoresRef.current = scores;
  const userRef = useRef(user);
  userRef.current = user;

  const getScene = useCallback((idx) => {
    const raw = scenes[idx];
    if (!raw) return null;
    const flags = getRunningFlags(scoresRef.current);
    const conditional = applyConditional(raw, flags);
    return personalizeScene(conditional, userRef.current);
  }, [scenes]);

  // Progress
  const totalQ = scenes.filter(s => s.type === 'question' || s.type === 'end-reflection').length;
  const doneQ = scenes.slice(0, current + 1).filter(s => s.type === 'question' || s.type === 'end-reflection').length;
  const progress = (doneQ / totalQ) * 100;

  // ─── Advance with outgoing cross-fade (Section 1 pattern) ───
  const advance = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(whooshRef.current);
    clearTimeout(outgoingTimerRef.current);
    setCurrent(c => {
      if (c >= scenes.length - 1) return c;
      setOutgoing(c);
      outgoingTimerRef.current = setTimeout(() => setOutgoing(null), 1800);
      return c + 1;
    });
    setTimerVisible(false);
    setTimerRunning(false);
    setIsWhooshing(false);
    window.scrollTo(0, 0);
  }, [scenes.length]);

  const goBack = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(whooshRef.current);
    clearTimeout(outgoingTimerRef.current);
    setTimerVisible(false);
    setTimerRunning(false);
    const c = currentRef.current;
    if (c <= 0) return;
    const newIdx = c - 1;
    setOutgoing(c);
    outgoingTimerRef.current = setTimeout(() => setOutgoing(null), 1800);
    const newScores = rebuildScores(scenes, Object.fromEntries(Object.entries(answersRef.current).filter(([k]) => +k < newIdx)));
    setScores(newScores);
    setCurrent(newIdx);
    window.scrollTo(0, 0);
  }, [scenes]);

  const skipScene = useCallback(() => {
    const scene = getScene(currentRef.current);
    if (scene && scene.type === 'crawl' && !isWhooshing) {
      setIsWhooshing(true);
      setTimeout(() => advance(), 1600);
    } else {
      advance();
    }
  }, [advance, getScene, isWhooshing]);

  // ─── Timer ring activation logic (Section 3) ────────────────
  const currentScene = getScene(current);
  useEffect(() => {
    const scene = getScene(current);
    if (!scene) return;
    const autoTypes = ['narrative', 'narrative-scene', 'twist', 'crawl'];
    if (!autoTypes.includes(scene.type) || !scene.duration) {
      setTimerVisible(false);
      setTimerRunning(false);
      return;
    }
    // Whoosh for crawl scenes
    if (scene.type === 'crawl') {
      whooshRef.current = setTimeout(() => setIsWhooshing(true), Math.max(0, scene.duration - 2400));
    }
    // Show ring after 600ms, run for scene.duration
    const showTimer = setTimeout(() => {
      setTimerVisible(true);
      setTimerRunning(true);
    }, 600);
    timerRef.current = setTimeout(() => {
      setTimerVisible(false);
      setTimerRunning(false);
      advance();
    }, scene.duration);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(timerRef.current);
      clearTimeout(whooshRef.current);
    };
  }, [current, advance, getScene]);

  // ─── Answer handlers ─────────────────────────────────────────
  const handleAnswer = useCallback((value, textVal) => {
    const c = currentRef.current;
    const scene = getScene(c);
    const newAnswers = { ...answersRef.current, [c]: value };
    setAnswers(newAnswers);
    const newScores = rebuildScores(scenes, newAnswers);
    setScores(newScores);
    if (scene && scene.kind === 'short-text') {
      setReflections(prev => ({ ...prev, [`midtext_${c}`]: textVal || '' }));
    }
    advance();
  }, [scenes, advance, getScene]);

  const handleMidpoint = useCallback((key, textVal) => {
    setReflections(prev => ({ ...prev, [key]: textVal }));
    advance();
  }, [advance]);

  const handleReflection = useCallback((key, textVal) => {
    setReflections(prev => ({ ...prev, [key]: textVal }));
    advance();
  }, [advance]);

  // ─── Results ─────────────────────────────────────────────────
  const openResults = () => {
    setShowResults(true);
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setShowResults(false);
    setShowSkinSelect(true);
    setCurrent(0);
    setOutgoing(null);
    setAnswers({});
    setReflections({});
    setScores(initialScores());
    setPreviewData(null);
    window.scrollTo(0, 0);
  };

  const handleDownload = () => {
    const R = computeResults(scores);
    const arch = (activeSkin.archetypes || {})[pickArchetype(R)] || {};
    const data = { overall_score: R.overall, archetype: arch.name, band: arch.band, practices: R.practices, levels: R.levels, risks: R.risks, reflections, completed: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'strategic-force-assessment-result.json'; a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Admin preview ───────────────────────────────────────────
  const handlePreview = (primary, secondary) => {
    const mockR = secondary
      ? (() => {
          const base = JSON.parse(JSON.stringify(MOCK_PROFILES[primary] || MOCK_PROFILES.hidden_drifter));  // eslint-disable-line
          const tune = {
            architect_of_order: () => { base.risks.control_bias = 78; },
            the_justifier: () => { base.risks.moral_drift = 70; },
            the_calm_blade: () => { base.risks.detachment_pressure = 72; },
            the_consensus_seeker: () => { base.practices.collaborate_inclusively = 86; base.practices.act_decisively = 48; },
            the_decisive_commander: () => { base.practices.act_decisively = 86; base.practices.listen_deeply = 48; },
            vision_under_strain: () => { base.practices.future_focused = 86; base.practices.master_emotions = 48; }
          };
          if (tune[secondary]) tune[secondary]();
          return base;
        })()
      : MOCK_PROFILES[primary];
    setPreviewData({ archKey: primary, secondaryKey: secondary, R: mockR });
    setAdminOpen(false);
    setShowResults(true);
    if (!user.firstName) setUser({ firstName: 'Citizen', lastName: 'Preview', email: 'preview@local', gender: 'they' });
  };

  // ─── Apply skin theme whenever skin changes ──────────────────
  useEffect(() => {
    applySkinTheme(activeSkin);
    // Clear any previously-applied skin body classes
    document.body.classList.forEach(c => { if (c.startsWith('skin-')) document.body.classList.remove(c); });
    // Apply this skin's body classes (e.g. skin-petals for Yi)
    if (activeSkin.bodyClasses?.length) {
      activeSkin.bodyClasses.forEach(cls => document.body.classList.add(cls));
    }
  }, [activeSkinId]);



  // ─── Particles ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.5 + 0.1
    }));
    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,90,44,${p.a * 0.4})`; ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  // ─── Cursor glow ─────────────────────────────────────────────
  useEffect(() => {
    const glow = () => {
      glowPosRef.current.x += (mousePosRef.current.x - glowPosRef.current.x) * 0.08;
      glowPosRef.current.y += (mousePosRef.current.y - glowPosRef.current.y) * 0.08;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = glowPosRef.current.x + 'px';
        cursorGlowRef.current.style.top = glowPosRef.current.y + 'px';
      }
      glowAnimRef.current = requestAnimationFrame(glow);
    };
    glowAnimRef.current = requestAnimationFrame(glow);
    return () => cancelAnimationFrame(glowAnimRef.current);
  }, []);

  // ─── Mouse tracking ──────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) { cursorRef.current.style.left = e.clientX + 'px'; cursorRef.current.style.top = e.clientY + 'px'; }
    };
    const onOver = (e) => {
      if (e.target.matches('button,.sfa-q-option,.sfa-q-scale-item,.sfa-q-ranking-item,.sfa-landing-cta,.sfa-cta-btn,a,textarea,.sfa-intake-gender-opt,.sfa-admin-arch-card,.sfa-admin-base-pill')) {
        cursorRef.current?.classList.add('hover');
      }
    };
    const onOut = (e) => {
      if (e.target.matches('button,.sfa-q-option,.sfa-q-scale-item,.sfa-q-ranking-item,.sfa-landing-cta,.sfa-cta-btn,a,textarea,.sfa-intake-gender-opt,.sfa-admin-arch-card,.sfa-admin-base-pill')) {
        cursorRef.current?.classList.remove('hover');
      }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  // ─── Keyboard shortcuts ──────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && adminOpen) setAdminOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [adminOpen]);

  // ─── Derived (must be before any useEffect that references scene) ────
  const skinArchetypes = activeSkin.archetypes;
  const skinRiskCopy = activeSkin.riskCopy;
  const skinNextSteps = activeSkin.nextSteps;
  const skinSecondaryPatterns = activeSkin.secondaryPatterns;

  const R = previewData?.R || computeResults(scores);
  const archKey = previewData?.archKey || pickArchetype(R);
  const secondaryKey = previewData?.secondaryKey || pickSecondaryPattern(R, undefined, skinSecondaryPatterns);
  const scene = currentScene;

  // ─── Sync chrome state to <body> so reference CSS rules fire ─────────
  useEffect(() => {
    document.body.classList.add('interactive');
    return () => document.body.classList.remove('interactive');
  }, []);
  useEffect(() => {
    document.body.classList.toggle('admin-open', adminOpen);
  }, [adminOpen]);
  useEffect(() => {
    const hasBack = current > 0 && scene && !['landing', 'intake', 'crawl', 'results-launch'].includes(scene.type);
    document.body.classList.toggle('has-back', !!hasBack);
  }, [current, scene]);

  const showChrome = current > 0;
  const isCrawl = scene?.type === 'crawl';
  const autoAdvanceTypes = ['narrative', 'narrative-scene', 'twist', 'crawl'];
  const showNavStrip = showChrome && !showResults && scene && !['landing', 'results-launch'].includes(scene.type);
  const showBackBtn = current > 0 && scene && !['landing', 'intake', 'crawl', 'results-launch'].includes(scene.type);
  const showSkipBtn = scene && autoAdvanceTypes.includes(scene.type);

  function renderSceneContent(s, idx) {
    if (!s) return null;
    switch (s.type) {
      case 'landing': return <LandingScene scene={s} onNext={advance} />;
      case 'intake': return <IntakeScene scene={s} onSubmit={(u) => { setUser(u); advance(); }} />;
      case 'crawl': return <CrawlScene scene={s} />;
      case 'narrative': return <NarrativeScene scene={s} />;
      case 'narrative-scene': return <NarrativeQuoteScene scene={s} />;
      case 'question': return <QuestionScene scene={s} savedAnswer={answers[idx ?? current]} onAnswer={handleAnswer} />;
      case 'midpoint': return <MidpointScene scene={s} onSubmit={handleMidpoint} />;
      case 'twist': return <TwistScene scene={s} />;
      case 'end-reflection': return <EndReflectionScene scene={s} onSubmit={handleReflection} />;
      case 'results-launch': return <ResultsLaunchScene onShowResults={openResults} />;
      default: return null;
    }
  }

  function renderOutgoingContent(idx) {
    const s = getScene(idx);
    if (!s) return null;
    return renderSceneContent(s, idx);
  }

  return (
    <SkinProvider skin={activeSkin}><div className={`sfa-root interactive${adminOpen ? ' admin-open' : ''}`}
      style={{ position: 'fixed', inset: 0 }}>

      {/* Atmosphere */}
      <div className="sfa-grain"></div>
      <div className="sfa-vignette"></div>
      <div className="sfa-gradient-wash"></div>
      <canvas ref={canvasRef} className="sfa-particles"></canvas>

      {/* Petal layer */}
      <div className="sfa-petal-layer" id="sfaPetalLayer">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="sfa-petal">
            <svg viewBox="0 0 20 20">
              <path d="M10 2 Q14 4 14 10 Q14 16 10 18 Q6 16 6 10 Q6 4 10 2 Z"/>
              <circle cx="10" cy="10" r="1.4"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Custom cursor */}
      <div ref={cursorGlowRef} className="sfa-cursor-glow"></div>
      <div ref={cursorRef} className="sfa-cursor"></div>

      {/* Chrome */}
      <ProgressRail visible={showChrome} percent={progress} />
      <LocationTag label={scene?.locationLabel || ''} visible={showChrome && !isCrawl} />
      <LogoTopRight visible={showChrome && !isCrawl} />
      <BLStack visible={showChrome && !isCrawl} current={current} total={scenes.length} />
      <TimerRing visible={timerVisible} running={timerRunning} duration={scene?.duration || 5000} onSkip={skipScene} />
      <NavStrip
        visible={showNavStrip}
        showBack={showBackBtn}
        showSkip={showSkipBtn}
        onBack={goBack}
        onSkip={skipScene}
        onForward={advance}
      />

      {/* Skin selection pre-screen */}
      {showSkinSelect && !showResults && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20 }}>
          <SkinSelectScene
            activeSkinId={activeSkinId}
            onPickSkin={(id) => {
              setActiveSkinIdState(id);
              setActiveSkinId(id);
              window.dispatchEvent(new Event('sfa:skin-change'));
            }}
            onNext={() => setShowSkinSelect(false)}
          />
        </div>
      )}

      {/* Main stage — cross-fade between outgoing and current */}
      {!showResults && !showSkinSelect && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
          {outgoing !== null && (
            <SceneSlot key={`out-${outgoing}`} outgoing={true} isCrawl={getScene(outgoing)?.type === 'crawl'}>
              {renderOutgoingContent(outgoing)}
            </SceneSlot>
          )}
          <SceneSlot key={`in-${current}`} active={true} isCrawl={isCrawl} isWhooshing={isWhooshing}>
            {renderSceneContent(scene)}
          </SceneSlot>
        </div>
      )}

      {/* Results stage */}
      <div className={`sfa-results-stage${showResults ? ' active' : ''}`}>
        {showResults && (
          <ResultsPage
            R={R} archKey={archKey} secondaryKey={secondaryKey}
            reflections={reflections} onRestart={handleRestart} onDownload={handleDownload}
            archetypes={skinArchetypes} riskCopy={skinRiskCopy} nextSteps={skinNextSteps}
            secondaryPatterns={skinSecondaryPatterns}
          />
        )}
      </div>

      {/* Admin panel */}
      {adminOpen && (
        <div className="sfa-admin-panel open">
          <div className="sfa-admin-topbar">
            <div className="sfa-admin-brand">
              <span className="dot"></span><span>Admin · </span>
              <span className="label">The Strategic Force Assessment</span>
            </div>
            <div className="sfa-admin-tabs">
              {['archetypes','skins','results'].map(t => (
                <button key={t} className="sfa-admin-tab">{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
            <button className="sfa-admin-close" onClick={() => setAdminOpen(false)}>Close · ESC</button>
          </div>
          <div className="sfa-admin-body">
            <div className="sfa-admin-section-title">Switch between archetypes</div>
            <div className="sfa-admin-section-sub">Preview any archetype result directly.</div>
            <div className="sfa-admin-arch-grid">
              {Object.entries(skinArchetypes).map(([key, a]) => (
                <div key={key} className="sfa-admin-arch-card" onClick={() => handlePreview(key, null)}>
                  <div className="tag">{a.band}</div>
                  <div className="name">{a.name}</div>
                  <div className="head">{a.headline}</div>
                  <div className="cta">Preview result →</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <a href="/admin" style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--amber)', textDecoration: 'none' }}>
                Open full admin panel →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
    </SkinProvider>
  );
}