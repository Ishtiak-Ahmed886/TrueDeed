'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { Toaster, toast } from 'sonner'
import { 
  AlertTriangle, ArrowRight, BadgeCheck, BookOpen, Check, ChevronDown, 
  ClipboardCheck, Copy, FileCheck2, FileJson, GitBranch, Globe2, KeyRound, 
  LockKeyhole, ScanLine, ShieldCheck, UserRound, X, Zap, Scale, Layers, 
  Sliders, Plus, Minus, RotateCcw, AlertCircle, Sparkles
} from 'lucide-react'

type Bilingual = { en: string; bn: string }
const tr = (value: Bilingual, lang: 'en' | 'bn') => value[lang]

type Scenario = 'valid' | 'fraud'
type Role = 'Sub-Registrar' | 'Bank Underwriter' | 'Citizen-NRB'
type Tab = 'cockpit' | 'baya' | 'farayez'

const data = {
  valid: { score: 94, seller: { en: 'Md. Abdul Karim', bn: 'মোঃ আব্দুল করিম' }, claimed: 12, entitled: 14, status: 'PASS', verdictKey: 'validVerdict', lock: 'CLEAR', baya: 35, farayez: 25, lockPoints: 25, nid: 9 },
  fraud: { score: 18, seller: { en: 'Md. Abdul Karim', bn: 'মোঃ আব্দুল করিম' }, claimed: 22, entitled: 14, status: 'BLOCKED', verdictKey: 'fraudVerdict', lock: 'ALERT', baya: 10, farayez: 0, lockPoints: 0, nid: 8 },
}

const entityRows = [
  ['District / জেলা', { en: 'Dhaka', bn: 'ঢাকা' }, '99%'], 
  ['Upazila / উপজেলা', { en: 'Savar', bn: 'সাভার' }, '98%'], 
  ['Mouza / মৌজা', { en: 'Ashulia', bn: 'আশুলিয়া' }, '97%'], 
  ['JL No / জে.এল', { en: '87', bn: '87' }, '96%'], 
  ['RS Khatian / খতিয়ান', { en: '412', bn: '412' }, '93%'], 
  ['Daag No / দাগ', { en: '1893', bn: '1893' }, '91%'], 
  ['Deeded acreage', { en: '12.00 shatak', bn: '12.00 শতক' }, '88%'], 
  ['Seller NID', { en: '•••• •••• 4721', bn: '•••• •••• 4721' }, '86%'],
]

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral'|'good'|'warn'|'bad'|'blue' }) {
  return <span className={`pill pill-${tone}`}><span className="pill-dot" />{children}</span>
}

function SectionTitle({ icon: Icon, children, action }: { icon: React.ElementType; children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="section-title"><div className="section-title-main"><Icon size={14} /> <span>{children}</span></div>{action}</div>
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) { 
  return <section className={`card ${className}`}>{children}</section> 
}

function MiniBar({ value, tone = 'green' }: { value: number; tone?: string }) { 
  return <div className="mini-bar"><span className={tone} style={{ width: `${value}%` }} /></div> 
}

function ScoreGauge({ score }: { score: number }) {
  const { t } = useLanguage()
  const good = score >= 80, bad = score < 50
  return <div className={`gauge-wrap ${good ? 'gauge-good' : bad ? 'gauge-bad' : 'gauge-warn'}`}>
    <svg viewBox="0 0 240 140" className="gauge" aria-label={`Trust score ${score} percent`}>
      <path d="M 25 120 A 95 95 0 0 1 215 120" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="18" strokeLinecap="round" />
      <path d="M 25 120 A 95 95 0 0 1 215 120" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" pathLength="100" strokeDasharray={`${score} 100`} />
    </svg>
    <div className="gauge-number"><strong>{score}</strong><span>%</span></div>
    <div className="gauge-label">{good ? t('safeToProceed') : bad ? t('registrationBlocked') : t('manualReview')}</div>
  </div>
}

function ScanViewer({ scenario }: { scenario: Scenario }) {
  return (
    <div className={`scan-viewer ${scenario === 'fraud' ? 'scan-alert' : ''}`}>
      <div className="scan-lines" />
      <div className="scan-heading">সাফ কবলা দলিল</div>
      <div className="scan-sub">Document No. 1214 / 2009</div>
      {['বিক্রেতার নাম: মোঃ আব্দুল করিম','মৌজা: আশুলিয়া · জে.এল: ৮৭','খতিয়ান নং: ৪১২ · দাগ: ১৮৯৩','জমির পরিমাণ: ১২.০০ শতাংশ'].map((line) => (
        <div className="bangla-line" key={line}>{line}</div>
      ))}
      <div className="stamp">REG<br/><small>SAVAR</small></div>
      <div className="bbox bbox-one" />
      <div className="bbox bbox-two" />
      <div className="bbox bbox-three" />
      <div className="scan-beam" />
      <div className="scan-meta"><ScanLine size={12} /> OCR CAPTURE · 4 FIELDS</div>
    </div>
  )
}

function Interceptor({ icon: Icon, title, status, verdict, children, open, onOpen }: { 
  icon: React.ElementType; title: string; status: string; verdict: string; children: React.ReactNode; open: boolean; onOpen: () => void 
}) {
  const tone = status === 'PASS' ? 'good' : status === 'BLOCKED' ? 'bad' : 'warn'
  const { t } = useLanguage()
  const statusLabel = status === 'PASS' ? t('pass') : status === 'BLOCKED' ? t('blocked') : status === 'WARNING' ? t('warning') : t('reviewStatus')
  return (
    <Card className={`interceptor ${open ? 'is-open' : ''}`}>
      <button className="interceptor-head" onClick={onOpen} aria-expanded={open}>
        <div className="interceptor-icon"><Icon size={15} /></div>
        <div className="interceptor-copy">
          <div className="interceptor-name">{title}</div>
          <div className="interceptor-verdict">{verdict}</div>
        </div>
        <Pill tone={tone}>{statusLabel}</Pill>
        <ChevronDown size={15} className={open ? 'rotate' : ''} />
      </button>
      {open && <div className="interceptor-detail">{children}</div>}
    </Card>
  )
}

export default function Page() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [tab, setTab] = useState<Tab>('cockpit')
  const [scenario, setScenario] = useState<Scenario>('valid')
  const { lang, setLang, t } = useLanguage()
  const [role, setRole] = useState<Role>('Sub-Registrar')
  const [open, setOpen] = useState('farayez')
  const [loading, setLoading] = useState(false)
  const [showJson, setShowJson] = useState(false)

  // Interactive Sandbox state for Page 3 (Farayez)
  const [estateArea, setEstateArea] = useState<number>(40)
  const [wifeCount, setWifeCount] = useState<number>(1)
  const [sonCount, setSonCount] = useState<number>(2)
  const [daughterCount, setDaughterCount] = useState<number>(3)
  const [hasMother, setHasMother] = useState<boolean>(true)
  const [hasFather, setHasFather] = useState<boolean>(false)
  const [claimedSale, setClaimedSale] = useState<number>(14)

  const current = data[scenario]
  const display = (value: Bilingual) => tr(value, lang)
  const copyHash = () => { navigator.clipboard?.writeText('a9e4b1d7…c02f7a91'); toast.success(t('merkleCopied')) }
  const rerun = () => { setLoading(true); window.setTimeout(() => { setLoading(false); toast.success(t('checksComplete')) }, 1200) }

  // Calculation for Farayez Sandbox
  const childrenCount = sonCount + daughterCount
  let wifeShare = childrenCount > 0 ? (1/8) : (1/4)
  if (wifeCount === 0) wifeShare = 0
  const motherShare = hasMother ? (childrenCount > 0 ? (1/6) : (1/3)) : 0
  const fatherShare = hasFather ? (1/6) : 0
  const zawilFuroodSum = (wifeShare * (wifeCount > 0 ? 1 : 0)) + motherShare + fatherShare
  const residue = Math.max(0, 1 - zawilFuroodSum)
  const childParts = (sonCount * 2) + daughterCount
  const sonShare = childParts > 0 ? (residue * 2) / childParts : 0
  const daughterShare = childParts > 0 ? (residue * 1) / childParts : 0

  const wifeAcreage = (estateArea * wifeShare) / (wifeCount || 1)
  const motherAcreage = estateArea * motherShare
  const fatherAcreage = estateArea * fatherShare
  const sonAcreage = estateArea * sonShare
  const daughterAcreage = estateArea * daughterShare

  const isClaimLegal = claimedSale <= sonAcreage + 0.01

  return (
    <>
      <Toaster theme="dark" position="bottom-right" />
      <main className="app-shell">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark"><ShieldCheck size={19} /></div>
            <div>
              <div className="brand-name">True<span>Deed</span></div>
              <div className="brand-caption">{t('commandCenter')}</div>
            </div>
          </div>

          <div className="breadcrumb">
            <span>{t('subRegistryDesk')}</span>
            <ArrowRight size={12} />
            <strong>{t('preRegistration')}</strong>
          </div>

          <div className="top-actions">
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label={t('userRole')}>
              <option>Sub-Registrar</option>
              <option>Bank Underwriter</option>
              <option>Citizen-NRB</option>
            </select>
            
            <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} aria-label={t('switchLanguage')}>
              <span className={lang === 'en' ? 'active' : ''}>EN</span>
              <span>/</span>
              <span className={lang === 'bn' ? 'active' : ''}>বাংলা</span>
            </button>
            <div className="latency"><Zap size={12} /> 3.8s</div>
            <div className="avatar">SR</div>
          </div>
        </header>

        {/* 3-PAGE NAVIGATION TABS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 10px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', background: '#0a1017', padding: '4px', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <button 
              onClick={() => setTab('cockpit')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: tab === 'cockpit' ? '#142735' : 'transparent',
                color: tab === 'cockpit' ? 'var(--blue)' : 'var(--muted)',
                boxShadow: tab === 'cockpit' ? '0 0 12px rgba(102,179,232,0.2)' : 'none'
              }}
            >
              <ShieldCheck size={14} /> {lang === 'en' ? '1. Verification Cockpit' : '১. ভেরিফিকেশন ককপিট'}
            </button>

            <button 
              onClick={() => setTab('baya')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: tab === 'baya' ? '#142735' : 'transparent',
                color: tab === 'baya' ? 'var(--blue)' : 'var(--muted)',
                boxShadow: tab === 'baya' ? '0 0 12px rgba(102,179,232,0.2)' : 'none'
              }}
            >
              <GitBranch size={14} /> {lang === 'en' ? '2. Baya DAG Lineage Tree' : '২. বায়া দলিলের ধারাবাহিকতা (DAG)'}
            </button>

            <button 
              onClick={() => setTab('farayez')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: tab === 'farayez' ? '#142735' : 'transparent',
                color: tab === 'farayez' ? 'var(--blue)' : 'var(--muted)',
                boxShadow: tab === 'farayez' ? '0 0 12px rgba(102,179,232,0.2)' : 'none'
              }}
            >
              <Scale size={14} /> {lang === 'en' ? '3. Farayez Inheritance Sandbox' : '৩. ফারায়েজ উত্তরাধিকার ক্যালকুলেটর'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>SCENARIO:</span>
            <div className="scenario-switcher">
              <button className={scenario === 'valid' ? 'active valid' : ''} onClick={() => setScenario('valid')}>
                <Check size={13} /> {t('verifiedValidTitle')} <b>94%</b>
              </button>
              <button className={scenario === 'fraud' ? 'active fraud' : ''} onClick={() => setScenario('fraud')}>
                <AlertTriangle size={13} /> {t('criticalFraud')} <b>18%</b>
              </button>
            </div>
          </div>
        </div>

        {/* ================= PAGE 1: VERIFICATION COCKPIT ================= */}
        {tab === 'cockpit' && (
          <div>
            <div className="case-strip">
              <span><span className="case-label">{t('caseStrip')}</span><b className="mono">TD-2026-014872</b></span>
              <span><BookOpen size={13} /> {t('deedType')} <em>{t('deedType')}</em></span>
              <span><Globe2 size={13} /> {t('location')}</span>
              <span className="muted">{t('lodged')}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>● Sub-Registry Live Connected</span>
            </div>

            <div className="dashboard-grid">
              {/* LEFT COLUMN: OCR */}
              <div className="column left-col">
                <SectionTitle icon={ScanLine}>{t('deedIntake')}<Pill tone="blue">{t('pipelineLive')}</Pill></SectionTitle>
                <Card>
                  <div className="card-kicker">
                    <span>{t('documentPreview')}</span>
                    <span className="mono">TD_SCAN_014872</span>
                  </div>
                  <ScanViewer scenario={scenario} />
                </Card>

                <Card>
                  <div className="card-header">
                    <div>
                      <div className="card-title">{t('extractedEntities')}</div>
                      <div className="card-sub">{t('normalizedFields')}</div>
                    </div>
                    <FileJson size={16} className="muted" />
                  </div>
                  <div className="entity-list">
                    {entityRows.map(([name, value, confidence]) => (
                      <div className="entity-row" key={name as string}>
                        <span>{name === 'Seller NID' ? t('sellerNid') : (name as string)}</span>
                        <strong className="mono">{display(value as Bilingual)}</strong>
                        <span className={Number.parseInt(confidence as string) < 90 ? 'confidence review' : 'confidence'}>
                          {confidence as string} {Number.parseInt(confidence as string) < 90 ? t('review') : '✓'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="raw-toggle" onClick={() => setShowJson(!showJson)}>
                    <ChevronDown size={14} className={showJson ? 'rotate' : ''} /> {t('viewRawJson')}
                  </button>
                  {showJson && (
                    <pre className="json-block">{`{\n  "district": "Dhaka",\n  "mouza": "Ashulia",\n  "khatian": "412",\n  "daag": "1893",\n  "acreage": 12.00\n}`}</pre>
                  )}
                </Card>
                <div className="pipeline-footer"><span className="green-dot" /> {t('ocrPipeline')} <span>3.6s</span></div>
              </div>

              {/* CENTER COLUMN: INTERCEPTORS */}
              <div className="column center-col">
                <SectionTitle icon={GitBranch}>
                  {t('interceptors')}
                  <button className="text-button" onClick={rerun}>{loading ? t('running') : t('rerun')}</button>
                </SectionTitle>
                {loading && <div className="loading-bar" />}

                {/* FARAYEZ CARD */}
                <Interceptor 
                  icon={ClipboardCheck} 
                  title={t('farayezQuota')} 
                  status={scenario === 'valid' ? 'PASS' : 'BLOCKED'} 
                  verdict={t(current.verdictKey)} 
                  open={open === 'farayez'} 
                  onOpen={() => setOpen(open === 'farayez' ? '' : 'farayez')}
                >
                  <div className="heir-bar">
                    <span style={{width:'12.5%'}}>W</span>
                    <span className="seller-segment" style={{width: '35%'}}>S</span>
                    <span style={{width:'17.5%'}}>D</span>
                    <span style={{width:'17.5%'}}>D</span>
                    <span style={{width:'17.5%'}}>D</span>
                  </div>
                  <div className="heir-legend">
                    <span><i className="dot widow" /> {t('widowShare')}</span>
                    <span><i className="dot seller" /> {t('sellerShare')}</span>
                    <span><i className="dot daughter" /> {t('daughterShare')}</span>
                  </div>
                  <div className="compare">
                    <div>
                      <small>CLAIMED</small>
                      <strong className={scenario === 'fraud' ? 'bad-text' : ''}>
                        {current.claimed} <small>{t('shatak')}</small>
                      </strong>
                    </div>
                    <div className="compare-arrow">vs</div>
                    <div>
                      <small>ENTITLED</small>
                      <strong className="good-text">14 <small>{t('shatak')}</small></strong>
                    </div>
                  </div>
                  <div className="formula">{t('estateFormula')}</div>
                  <button 
                    className="outline-button" 
                    onClick={() => setTab('farayez')}
                    style={{ marginTop: '10px', width: '100%' }}
                  >
                    Open Full Farayez Sandbox <ArrowRight size={13} />
                  </button>
                </Interceptor>

                {/* BAYA CARD */}
                <Interceptor 
                  icon={GitBranch} 
                  title={t('bayaTracer')} 
                  status={scenario === 'valid' ? 'PASS' : 'BLOCKED'} 
                  verdict={scenario === 'valid' ? t('allLinks') : t('breakAt')} 
                  open={open === 'baya'} 
                  onOpen={() => setOpen(open === 'baya' ? '' : 'baya')}
                >
                  <div className="lineage">
                    <span>CS<small>1921</small></span>
                    <i className="line-ok" />
                    <span>SA<small>1962</small></span>
                    <i className={scenario === 'fraud' ? 'line-bad' : 'line-ok'} />
                    <span>RS<small>1987</small></span>
                    <i className={scenario === 'fraud' ? 'line-bad' : 'line-ok'} />
                    <span>DEED<small>2009</small></span>
                    <i className="line-ok" />
                    <span>SELLER<small>NOW</small></span>
                  </div>
                  <div className="check-list">
                    <div><Check size={12} /> Party continuity</div>
                    <div><Check size={12} /> Area conservation</div>
                    <div className={scenario === 'fraud' ? 'bad-text' : ''}>
                      {scenario === 'fraud' ? <X size={12} /> : <Check size={12} />} Mutation DCR present
                    </div>
                  </div>
                  <button 
                    className="outline-button" 
                    onClick={() => setTab('baya')}
                    style={{ width: '100%' }}
                  >
                    Open Full Lineage DAG Visualizer <ArrowRight size={13} />
                  </button>
                </Interceptor>

                {/* LOCK MANAGER CARD */}
                <Interceptor 
                  icon={LockKeyhole} 
                  title="Concurrency Lock Manager" 
                  status={scenario === 'valid' ? 'PASS' : 'WARNING'} 
                  verdict={scenario === 'valid' ? t('freshLock') : 'Active lock held by Dhamrai · duplicate rejected'} 
                  open={open === 'lock'} 
                  onOpen={() => setOpen(open === 'lock' ? '' : 'lock')}
                >
                  <div className="lock-key mono">Savar_Ashulia_JL87_Khatian412_Daag1893</div>
                  <div className="lock-grid">
                    <div className="countdown">
                      <strong>{scenario === 'valid' ? '45' : '36'}</strong>
                      <small>DAYS LEFT</small>
                    </div>
                    <div>
                      <div className="lock-state">
                        <LockKeyhole size={13} /> {current.lock} · {scenario === 'valid' ? 'Sub-Registry Savar' : 'Sub-Registry Dhamrai'}
                      </div>
                      <div className="lock-log">
                        17 Oct · Savar · acquired<br />
                        08 Oct · Dhamrai · filing accepted<br />
                        08 Oct · Dhamrai · lock created
                      </div>
                    </div>
                  </div>
                  <div className="lock-note">Lock auto-releases when e-Namjari mutation completes.</div>
                </Interceptor>

                <Card className="consistency">
                  <div className="consistency-title">
                    <KeyRound size={14} /> NID & Registry Consistency 
                    <Pill tone={scenario === 'valid' ? 'warn' : 'bad'}>
                      {scenario === 'valid' ? 'REVIEW' : 'ALERT'}
                    </Pill>
                  </div>
                  <div className="consistency-grid">
                    <span><Check size={12} /> Seller NID</span>
                    <span><Check size={12} /> Porcha match</span>
                    <span className={scenario === 'fraud' ? 'bad-text' : ''}>
                      {scenario === 'fraud' ? <X size={12} /> : <Check size={12} />} Biometric log
                    </span>
                  </div>
                </Card>
              </div>

              {/* RIGHT COLUMN: TRUST SCORE & CERTIFICATE */}
              <div className="column right-col">
                <SectionTitle icon={ShieldCheck}>
                  {t('trustCertificate')}
                  <Pill tone={scenario === 'valid' ? 'good' : 'bad'}>
                    {scenario === 'valid' ? t('verified') : t('fraudAlert')}
                  </Pill>
                </SectionTitle>

                <Card className="score-card">
                  <ScoreGauge score={current.score} />
                  <div className="breakdown">
                    {[
                      [t('breakdownBaya'), current.baya, 35], 
                      [t('breakdownFarayez'), current.farayez, 25], 
                      [t('breakdownLock'), current.lockPoints, 25], 
                      [t('breakdownNid'), current.nid, 15]
                    ].map(([label, points, max]) => (
                      <div className="breakdown-row" key={label as string}>
                        <div><span>{label}</span><strong>{points}<small>/{max}</small></strong></div>
                        <MiniBar 
                          value={Number(points) / Number(max) * 100} 
                          tone={Number(points) === Number(max) ? 'green' : Number(points) === 0 ? 'red' : 'amber'} 
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="veto-card">
                  <div className="card-title">{t('hardVeto')}</div>
                  <div className="veto-row">
                    <span><GitBranch size={13} /> {t('brokenBaya')}</span>
                    <Pill tone={scenario === 'fraud' ? 'bad' : 'good'}>
                      {scenario === 'fraud' ? t('triggered') : t('clear')}
                    </Pill>
                  </div>
                  <div className="veto-row">
                    <span><AlertTriangle size={13} /> {t('injunction')} <small>{t('orderRules')}</small></span>
                    <Pill tone="good">{t('clearStatus')}</Pill>
                  </div>
                </Card>

                <Card className={`decision-card ${scenario === 'fraud' ? 'decision-bad' : ''}`}>
                  {scenario === 'valid' ? (
                    <>
                      <div className="decision-icon"><BadgeCheck size={20} /></div>
                      <div>
                        <div className="decision-title">{t('approveRegistration')}</div>
                        <div className="card-sub">{t('checksPassed')}</div>
                      </div>
                      <button className="primary-button" onClick={() => toast.success(t('approvalQueued'))}>
                        {t('approve')} <ArrowRight size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="decision-icon"><X size={20} /></div>
                      <div>
                        <div className="decision-title">{t('registrationBlocked')}</div>
                        <div className="card-sub">{t('fraudEscalation')}</div>
                      </div>
                      <div className="decision-actions">
                        <button className="danger-button" onClick={() => toast('Escalation packet prepared for AC (Land)')}>
                          Escalate to AC
                        </button>
                        <button className="outline-button" onClick={() => toast('Notification queued for 3 co-heirs')}>
                          Notify Co-heirs
                        </button>
                      </div>
                    </>
                  )}
                </Card>

                <Card className="certificate">
                  <div className="certificate-head">
                    <div>
                      <div className="card-title">{t('certificateTitle')}</div>
                      <div className="card-sub">Pre-registration verification proof</div>
                    </div>
                    <FileCheck2 size={19} className={scenario === 'valid' ? 'good-text' : 'bad-text'} />
                  </div>
                  {scenario === 'valid' ? (
                    <>
                      <div className="cert-valid"><BadgeCheck size={13} /> VALID CERTIFICATE</div>
                      <div className="cert-body">
                        <div className="qr">
                          <svg viewBox="0 0 80 80">
                            {Array.from({length: 64}, (_, i) => (
                              <rect key={i} x={(i%8)*10} y={Math.floor(i/8)*10} width="7" height="7" fill={(i*17+3)%5 < 2 ? 'currentColor' : 'transparent'} />
                            ))}
                          </svg>
                        </div>
                        <div className="cert-meta">
                          <span>ID <b className="mono">TD-CERT-014872</b></span>
                          <span>SHA-256 <b className="mono hash">a9e4b1d7…c02f7a91</b>
                            <button className="icon-button" onClick={copyHash} aria-label={t('copyHash')}><Copy size={12} /></button>
                          </span>
                          <span>Signed by <b>Sub-Registrar, Savar</b></span>
                        </div>
                      </div>
                      <button className="download-button" onClick={() => toast.success('Certificate downloaded successfully!')}>
                        Download PDF <ArrowRight size={13} />
                      </button>
                    </>
                  ) : (
                    <div className="withheld">
                      <LockKeyhole size={18} />
                      <strong>Certificate withheld</strong>
                      <span>Fraud report issued · Case escalated</span>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 2: BAYA DAG LINEAGE TREE ================= */}
        {tab === 'baya' && (
          <div style={{ animation: 'reveal .3s ease' }}>
            <Card style={{ padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                    🌲 Directed Acyclic Graph (DAG) Baya Lineage Tracer
                  </h2>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0' }}>
                    Mathematical Chain-of-Title verification from original 1921 Cadastral Survey down to current 2026 deed lodgment
                  </p>
                </div>
                <Pill tone={scenario === 'valid' ? 'good' : 'bad'}>
                  {scenario === 'valid' ? 'ALL 5 NODES CONTINUOUS & VERIFIED' : 'CRITICAL FRAUD: BROKEN LINEAGE DETECTED'}
                </Pill>
              </div>

              {/* VERTICAL VISUAL DAG TREE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '850px', margin: '0 auto' }}>
                {/* NODE 1: CS */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)' }}>1921 A.D.</span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>British Raj Survey</div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: 'var(--green)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
                  </div>
                  <div style={{ flex: 1, background: '#0b131d', border: '1px solid #1a2f42', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Node 1: CS Khatian #102 (Cadastral Survey Baseline)</strong>
                      <Pill tone="good">STATE BASELINE</Pill>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                      Recorded Proprietor: <b>Jonab Ali Sheikh</b> · Mouza: Ashulia (JL 87) · Daag: 1893<br/>
                      Baseline Survey Acreage: <b style={{ color: 'var(--green)' }}>120.00 Shatak (1.20 Acres)</b> · Gazetted in Bengal District Gazette.
                    </div>
                  </div>
                </div>

                {/* NODE 2: SA */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)' }}>1962 A.D.</span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>East Pakistan Survey</div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: 'var(--green)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--green)' }} />
                  </div>
                  <div style={{ flex: 1, background: '#0b131d', border: '1px solid #1a2f42', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Node 2: SA Khatian #204 (State Acquisition Survey)</strong>
                      <Pill tone="good">MUTATION CONFIRMED</Pill>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                      Conveyance: Inheritance Partition (Jonab Ali Sheikh → Rahim Ullah Sheikh)<br/>
                      Transferred Area: <b style={{ color: 'var(--green)' }}>60.00 Shatak</b> (Area Conserved: 60 &lt;= 120) · Record Room Vol. 14, Page 88.
                    </div>
                  </div>
                </div>

                {/* NODE 3: RS */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)' }}>1987 A.D.</span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Bangladesh Revisional</div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)' }} />
                  </div>
                  <div style={{ flex: 1, background: '#0b131d', border: '1px solid #1a2f42', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Node 3: RS Khatian #412 (Revisional Survey)</strong>
                      <Pill tone="good">ACTIVE PORCHA</Pill>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                      Recorded Holder: <b>Late Rahim Ullah Sheikh</b> · Mutation Case No. 118/1987<br/>
                      Settled Land Area: <b style={{ color: 'var(--green)' }}>40.00 Shatak</b> (Remaining 20 shatak conveyed to co-sharer).
                    </div>
                  </div>
                </div>

                {/* NODE 4: BAYA DEED 2009 (THE FRACTURE POINT IN FRAUD SCENARIO) */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: scenario === 'valid' ? 'var(--blue)' : 'var(--red)' }}>2009 A.D.</span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Intermediate Transfer</div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)', boxShadow: scenario === 'fraud' ? '0 0 12px var(--red)' : 'none' }} />
                  </div>
                  <div style={{ flex: 1, background: scenario === 'valid' ? '#0b131d' : '#231217', border: `1px solid ${scenario === 'valid' ? '#1a2f42' : '#8e3946'}`, borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: scenario === 'valid' ? 'var(--text)' : 'var(--red)' }}>
                        Node 4: Baya Saf-Kabla Deed #8921 (Savar Sub-Registry)
                      </strong>
                      <Pill tone={scenario === 'valid' ? 'good' : 'bad'}>
                        {scenario === 'valid' ? 'VERIFIED WITH DCR' : '🚨 FAKE INTERMEDIATE DEED'}
                      </Pill>
                    </div>
                    {scenario === 'valid' ? (
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                        Seller: Rahim Ullah Sheikh → Buyer: <b>Md. Abdul Karim</b> (Current Seller)<br/>
                        Acreage: <b>14.00 Shatak</b> · Sub-Registry Volume: 412, Page: 18 · DCR Receipt: Verified (#DCR-90412).
                      </div>
                    ) : (
                      <div style={{ fontSize: '11px', color: '#ffb3b8', marginTop: '6px', lineHeight: '1.6' }}>
                        <b>CRITICAL BREAK:</b> Sub-Registry Volume 412, Page 18 is blank or registered to a different Mouza!<br/>
                        Missing Mutation DCR receipt from AC Land office. Chain-of-Title broken at this transition.
                      </div>
                    )}
                  </div>
                </div>

                {/* NODE 5: CURRENT 2026 DEED */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green)' }}>2026 A.D. (NOW)</span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Current Lodgment</div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)' }} />
                  </div>
                  <div style={{ flex: 1, background: '#0b131d', border: `1px solid ${scenario === 'valid' ? '#205340' : '#8e3946'}`, borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Node 5: Target Saf-Kabla Deed #1214 (Under Review)</strong>
                      <Pill tone={scenario === 'valid' ? 'good' : 'bad'}>
                        {scenario === 'valid' ? 'READY FOR EXECUTION' : 'EXECUTION BLOCKED'}
                      </Pill>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                      Seller: Md. Abdul Karim → Buyer: Md. Shamim Reza · Deeded Area: <b>{scenario === 'valid' ? '12.00 Shatak' : '22.00 Shatak'}</b><br/>
                      Verdict: {scenario === 'valid' ? 'Continuity verified back to 1921 CS survey.' : 'REGISTRATION REJECTED due to broken intermediate node.'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ================= PAGE 3: FARAYEZ INHERITANCE SANDBOX ================= */}
        {tab === 'farayez' && (
          <div style={{ animation: 'reveal .3s ease' }}>
            <Card style={{ padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                    ⚖️ Farayez Islamic Inheritance Math Sandbox
                  </h2>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0' }}>
                    Simulate complex fractional entitlement under Hanafi Jurisprudence & Muslim Family Laws Ordinance 1961 (MFLO)
                  </p>
                </div>
                <Pill tone="blue">INTERACTIVE SIMULATION</Pill>
              </div>

              {/* 2-COLUMN SANDBOX WORKSPACE */}
              <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
                {/* CONTROLS */}
                <div style={{ background: '#0b1219', border: '1px solid var(--line)', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '14px', color: 'var(--blue)' }}>
                    👨‍👩‍👧‍👦 1. Family Heirs Configuration
                  </div>

                  {/* ESTATE AREA INPUT */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                      TOTAL DECEASED ESTATE (মোট জমি - শতক):
                    </label>
                    <input 
                      type="number" 
                      value={estateArea} 
                      onChange={(e) => setEstateArea(Math.max(1, Number(e.target.value)))}
                      style={{ width: '100%', background: '#060a0f', border: '1px solid var(--line)', color: 'var(--text)', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>

                  {/* COUNTERS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* WIFE */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e1822', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px' }}>Wife / বিধবা স্ত্রী (1/8 share):</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => setWifeCount(Math.max(0, wifeCount - 1))} style={{ padding: '2px 8px', borderRadius: '4px', background: '#192b3a', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>-</button>
                        <b style={{ minWidth: '16px', textAlign: 'center' }}>{wifeCount}</b>
                        <button onClick={() => setWifeCount(wifeCount + 1)} style={{ padding: '2px 8px', borderRadius: '4px', background: '#192b3a', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>

                    {/* SONS */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e1822', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px' }}>Living Sons / পুত্র (2 parts each):</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => setSonCount(Math.max(0, sonCount - 1))} style={{ padding: '2px 8px', borderRadius: '4px', background: '#192b3a', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>-</button>
                        <b style={{ minWidth: '16px', textAlign: 'center' }}>{sonCount}</b>
                        <button onClick={() => setSonCount(sonCount + 1)} style={{ padding: '2px 8px', borderRadius: '4px', background: '#192b3a', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>

                    {/* DAUGHTERS */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e1822', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px' }}>Living Daughters / কন্যা (1 part each):</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => setDaughterCount(Math.max(0, daughterCount - 1))} style={{ padding: '2px 8px', borderRadius: '4px', background: '#192b3a', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>-</button>
                        <b style={{ minWidth: '16px', textAlign: 'center' }}>{daughterCount}</b>
                        <button onClick={() => setDaughterCount(daughterCount + 1)} style={{ padding: '2px 8px', borderRadius: '4px', background: '#192b3a', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>

                    {/* MOTHER CHECKBOX */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e1822', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px' }}>Surviving Mother / মাতা (1/6 share):</span>
                      <input 
                        type="checkbox" 
                        checked={hasMother} 
                        onChange={(e) => setHasMother(e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  {/* SELLER ATTEMPT SIMULATION */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '10px', color: 'var(--green)' }}>
                      🚨 2. Seller Quota Interception Test
                    </div>
                    <label style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                      SELLER CLAIMED TO SELL IN DEED (শতক):
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        value={claimedSale} 
                        onChange={(e) => setClaimedSale(Number(e.target.value))}
                        style={{ flex: 1, background: '#060a0f', border: '1px solid var(--line)', color: 'var(--text)', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700 }}
                      />
                      <button 
                        onClick={() => setClaimedSale(Math.round(sonAcreage))}
                        style={{ padding: '6px 12px', background: '#123128', border: '1px solid #205340', color: 'var(--green)', borderRadius: '6px', fontSize: '10px', cursor: 'pointer' }}
                      >
                        Set Valid ({sonAcreage.toFixed(1)})
                      </button>
                      <button 
                        onClick={() => setClaimedSale(Math.round(sonAcreage + 8))}
                        style={{ padding: '6px 12px', background: '#321c21', border: '1px solid #71303d', color: 'var(--red)', borderRadius: '6px', fontSize: '10px', cursor: 'pointer' }}
                      >
                        Set Fraud (+8)
                      </button>
                    </div>
                  </div>
                </div>

                {/* RESULTS & BREAKDOWN */}
                <div style={{ background: '#0b1219', border: '1px solid var(--line)', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)' }}>
                      📊 3. Statutory Fractional Entitlement Results
                    </div>
                    <Pill tone={isClaimLegal ? 'good' : 'bad'}>
                      {isClaimLegal ? 'WITHIN LAWFUL QUOTA (PASS)' : 'QUOTA BREACH DETECTED (BLOCKED)'}
                    </Pill>
                  </div>

                  {/* VERDICT BANNER */}
                  <div style={{ 
                    padding: '14px', borderRadius: '8px', marginBottom: '18px',
                    background: isClaimLegal ? '#10251f' : '#28161d',
                    border: `1px solid ${isClaimLegal ? '#205340' : '#8e3946'}`
                  }}>
                    <strong style={{ fontSize: '13px', color: isClaimLegal ? 'var(--green)' : 'var(--red)', display: 'block', marginBottom: '4px' }}>
                      {isClaimLegal ? '✅ Quota Verification Passed' : '❌ Critical Fraud Alert: Quota Breach'}
                    </strong>
                    <div style={{ fontSize: '11px', color: 'var(--text)', lineHeight: '1.5' }}>
                      Seller entitlement: <b>{sonAcreage.toFixed(2)} Shatak</b> | Attempted sale: <b>{claimedSale.toFixed(2)} Shatak</b>.
                      {!isClaimLegal && (
                        <span style={{ color: 'var(--red)', display: 'block', marginTop: '4px' }}>
                          ⚠️ Seller is attempting to sell <b>{(claimedSale - sonAcreage).toFixed(2)} Shatak</b> more than lawful inheritance, depriving female co-heirs.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* TABLE OF SHARES */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--muted)' }}>
                        <th style={{ padding: '8px 4px' }}>Heir Category</th>
                        <th style={{ padding: '8px 4px' }}>Statutory Share</th>
                        <th style={{ padding: '8px 4px' }}>Individual Entitlement</th>
                        <th style={{ padding: '8px 4px' }}>Total Group Area</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wifeCount > 0 && (
                        <tr style={{ borderBottom: '1px solid #14202c' }}>
                          <td style={{ padding: '8px 4px' }}>Wife / বিধবা স্ত্রী ({wifeCount})</td>
                          <td style={{ padding: '8px 4px' }} className="mono">{childrenCount > 0 ? '1/8' : '1/4'}</td>
                          <td style={{ padding: '8px 4px', color: 'var(--blue)' }} className="mono"><b>{wifeAcreage.toFixed(2)}</b> শতক</td>
                          <td style={{ padding: '8px 4px' }} className="mono">{(wifeAcreage * wifeCount).toFixed(2)} শতক</td>
                        </tr>
                      )}
                      {hasMother && (
                        <tr style={{ borderBottom: '1px solid #14202c' }}>
                          <td style={{ padding: '8px 4px' }}>Mother / মাতা</td>
                          <td style={{ padding: '8px 4px' }} className="mono">{childrenCount > 0 ? '1/6' : '1/3'}</td>
                          <td style={{ padding: '8px 4px', color: 'var(--blue)' }} className="mono"><b>{motherAcreage.toFixed(2)}</b> শতক</td>
                          <td style={{ padding: '8px 4px' }} className="mono">{motherAcreage.toFixed(2)} শতক</td>
                        </tr>
                      )}
                      {sonCount > 0 && (
                        <tr style={{ borderBottom: '1px solid #14202c', background: '#0e1f2b' }}>
                          <td style={{ padding: '8px 4px' }}><b>Son / পুত্র (Seller) ({sonCount})</b></td>
                          <td style={{ padding: '8px 4px' }} className="mono">Asaba (2 parts)</td>
                          <td style={{ padding: '8px 4px', color: 'var(--green)' }} className="mono"><b>{sonAcreage.toFixed(2)}</b> শতক</td>
                          <td style={{ padding: '8px 4px' }} className="mono">{(sonAcreage * sonCount).toFixed(2)} শতক</td>
                        </tr>
                      )}
                      {daughterCount > 0 && (
                        <tr style={{ borderBottom: '1px solid #14202c' }}>
                          <td style={{ padding: '8px 4px' }}>Daughter / কন্যা ({daughterCount})</td>
                          <td style={{ padding: '8px 4px' }} className="mono">Asaba (1 part)</td>
                          <td style={{ padding: '8px 4px', color: 'var(--amber)' }} className="mono"><b>{daughterAcreage.toFixed(2)}</b> শতক</td>
                          <td style={{ padding: '8px 4px' }} className="mono">{(daughterAcreage * daughterCount).toFixed(2)} শতক</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* FORMULA BOX */}
                  <div style={{ marginTop: '16px', padding: '10px', background: '#070c12', borderRadius: '6px', fontSize: '10px', color: 'var(--muted)', fontFamily: 'ui-monospace, monospace' }}>
                    Formula applied: Estate ({estateArea} shatak) - Zawil Furood ({((estateArea * zawilFuroodSum)).toFixed(2)} shatak) = Residue ({((estateArea * residue)).toFixed(2)} shatak) divided at 2:1 ratio for {sonCount} Son(s) and {daughterCount} Daughter(s).
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <footer>
          {t('footerDisclaimer')} 
          <span>Build 2026.10.17 · Secure session · DIU LandTech 2026 (LA-72)</span>
        </footer>
      </main>
    </>
  )
}
