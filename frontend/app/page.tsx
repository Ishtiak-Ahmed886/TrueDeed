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

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    if (newRole === 'Sub-Registrar') {
      toast.success(
        lang === 'bn' 
          ? 'সাব-রেজিস্ট্রার ডেস্ক · সংবিধিবদ্ধ নিবন্ধন কর্তৃপক্ষ ভিউ সক্রিয়' 
          : 'Switched to Sub-Registrar Desk · Statutory Registration Authority View', 
        { icon: '🏛️' }
      )
    } else if (newRole === 'Bank Underwriter') {
      toast.success(
        lang === 'bn' 
          ? 'বাণিজ্যিক ব্যাংক ডেস্ক · বন্ধকী জামানত ক্লিয়ারেন্স ভিউ সক্রিয়' 
          : 'Switched to Bank Underwriter Desk · Mortgage Collateral Clearance View', 
        { icon: '🏦' }
      )
    } else {
      toast.success(
        lang === 'bn' 
          ? 'নাগরিক সেবা পোর্টাল · জমি ক্রয়পূর্ব অডিট ও সুরক্ষা ভিউ সক্রিয়' 
          : 'Switched to Citizen & NRB Portal · Buyer Due-Diligence & Fraud Shield', 
        { icon: '🛡️' }
      )
    }
  }

  const [open, setOpen] = useState('farayez')
  const [loading, setLoading] = useState(false)
  const [showJson, setShowJson] = useState(false)

  // Interactive Sandbox state for Page 3 (Farayez)
  const [estateArea, setEstateArea] = useState<number>(40)
  const [claimedSale, setClaimedSale] = useState<number>(12)
  const [deceasedGender, setDeceasedGender] = useState<'male' | 'female'>('male')
  const [wifeCount, setWifeCount] = useState<number>(1)
  const [husbandCount, setHusbandCount] = useState<number>(0)
  const [sonCount, setSonCount] = useState<number>(1)
  const [daughterCount, setDaughterCount] = useState<number>(3)
  const [hasMother, setHasMother] = useState<boolean>(false)
  const [hasFather, setHasFather] = useState<boolean>(false)
  const [sisterCount, setSisterCount] = useState<number>(0)
  const [activePreset, setActivePreset] = useState<'typical' | 'daughters' | 'aul' | 'custom'>('typical')

  // Automatically sync Farayez sandbox claimed sale with Scenario switcher
  useEffect(() => {
    if (scenario === 'fraud') {
      setClaimedSale(22)
    } else {
      setClaimedSale(12)
    }
  }, [scenario])

  const setTypicalPreset = () => {
    setActivePreset('typical')
    setEstateArea(40)
    setClaimedSale(scenario === 'fraud' ? 22 : 12)
    setDeceasedGender('male')
    setWifeCount(1)
    setHusbandCount(0)
    setSonCount(1)
    setDaughterCount(3)
    setHasMother(false)
    setHasFather(false)
    setSisterCount(0)
  }

  const setDaughtersPreset = () => {
    setActivePreset('daughters')
    setEstateArea(40)
    setClaimedSale(scenario === 'fraud' ? 18 : 12)
    setDeceasedGender('male')
    setWifeCount(1)
    setHusbandCount(0)
    setSonCount(0)
    setDaughterCount(2)
    setHasMother(false)
    setHasFather(false)
    setSisterCount(0)
  }

  const setAulPreset = () => {
    setActivePreset('aul')
    setEstateArea(40)
    setClaimedSale(scenario === 'fraud' ? 20 : 10)
    setDeceasedGender('female')
    setWifeCount(0)
    setHusbandCount(1)
    setSonCount(0)
    setDaughterCount(0)
    setHasMother(true)
    setHasFather(false)
    setSisterCount(2)
  }

  const current = data[scenario]
  const display = (value: Bilingual) => tr(value, lang)
  const copyHash = () => { navigator.clipboard?.writeText('a9e4b1d7…c02f7a91'); toast.success(t('merkleCopied')) }
  const rerun = () => { setLoading(true); window.setTimeout(() => { setLoading(false); toast.success(t('checksComplete')) }, 1200) }

  // Calculation for Farayez Sandbox
  const childrenCount = sonCount + daughterCount
  let spouseShare = 0
  if (deceasedGender === 'male' && wifeCount > 0) {
    spouseShare = childrenCount > 0 ? (1/8) : (1/4)
  } else if (deceasedGender === 'female' && husbandCount > 0) {
    spouseShare = childrenCount > 0 ? (1/4) : (1/2)
  }

  let motherShare = hasMother ? (childrenCount > 0 || sisterCount > 1 ? (1/6) : (1/3)) : 0
  let fatherShare = hasFather ? (1/6) : 0
  let sisterShare = (sisterCount >= 2 && childrenCount === 0 && !hasFather) ? (2/3) : 0

  let zawilFuroodSum = spouseShare + motherShare + fatherShare + sisterShare
  let isAul = zawilFuroodSum > 1
  let aulFactor = isAul ? (1 / zawilFuroodSum) : 1

  let residue = Math.max(0, 1 - zawilFuroodSum)
  const childParts = (sonCount * 2) + daughterCount
  const sonShare = childParts > 0 ? (residue * 2) / childParts : 0
  const daughterShare = childParts > 0 ? (residue * 1) / childParts : 0

  const spouseAcreage = (estateArea * spouseShare * aulFactor) / (wifeCount || husbandCount || 1)
  const motherAcreage = estateArea * motherShare * aulFactor
  const fatherAcreage = estateArea * fatherShare * aulFactor
  const sonAcreage = estateArea * sonShare
  const daughterAcreage = estateArea * daughterShare

  // Structured Heir Rows for dynamic rendering
  interface HeirRow {
    name: string
    fraction: string
    percent: number
    shatak: number
    rule: string
    color: string
    isSeller?: boolean
  }

  const heirRows: HeirRow[] = []

  if (deceasedGender === 'male' && wifeCount > 0) {
    const totalWifePct = (spouseShare * aulFactor) * 100
    const perWifePct = totalWifePct / wifeCount
    const perWifeAcreage = (estateArea * (spouseShare * aulFactor)) / wifeCount
    heirRows.push({
      name: wifeCount > 1 ? `Wives (${wifeCount})` : 'Wife / বিধবা স্ত্রী',
      fraction: childrenCount > 0 ? (wifeCount > 1 ? `1/${8 * wifeCount} each` : '1/8') : (wifeCount > 1 ? `1/${4 * wifeCount} each` : '1/4'),
      percent: perWifePct,
      shatak: perWifeAcreage,
      rule: childrenCount > 0 ? 'Surviving children present (Quran 4:12)' : 'No surviving children (Quran 4:12)',
      color: '#2dd4a3'
    })
  } else if (deceasedGender === 'female' && husbandCount > 0) {
    const husbandPct = (spouseShare * aulFactor) * 100
    const isHusbandSeller = sonCount === 0 && daughterCount === 0
    heirRows.push({
      name: isHusbandSeller ? 'Husband (Seller) / স্বামী (বিক্রেতা)' : 'Husband / স্বামী',
      fraction: childrenCount > 0 ? '1/4' : (isAul ? '3/8 (Aul)' : '1/2'),
      percent: husbandPct,
      shatak: estateArea * (spouseShare * aulFactor),
      rule: isAul ? 'Normalized under Hanafi Aul reduction' : (childrenCount > 0 ? 'Surviving children present (Quran 4:12)' : 'No surviving children (Quran 4:12)'),
      color: '#2dd4a3',
      isSeller: isHusbandSeller
    })
  }

  if (hasMother) {
    const motherPct = (motherShare * aulFactor) * 100
    heirRows.push({
      name: 'Mother / মাতা',
      fraction: isAul ? '1/8 (Aul)' : (childrenCount > 0 || sisterCount > 1 ? '1/6' : '1/3'),
      percent: motherPct,
      shatak: estateArea * (motherShare * aulFactor),
      rule: isAul ? 'Normalized under Hanafi Aul reduction' : (childrenCount > 0 ? 'Surviving children present (Quran 4:11)' : 'No children (Quran 4:11)'),
      color: '#a78bfa'
    })
  }

  if (hasFather) {
    const fatherPct = (fatherShare * aulFactor) * 100
    heirRows.push({
      name: 'Father / পিতা',
      fraction: '1/6',
      percent: fatherPct,
      shatak: estateArea * (fatherShare * aulFactor),
      rule: 'Fixed Quranic share as Zawil Furood (Quran 4:11)',
      color: '#fb923c'
    })
  }

  if (sisterCount > 0 && childrenCount === 0 && !hasFather) {
    const sisterTotalPct = (sisterShare * aulFactor) * 100
    const perSisterPct = sisterTotalPct / sisterCount
    const perSisterAcreage = (estateArea * (sisterShare * aulFactor)) / sisterCount
    for (let i = 1; i <= sisterCount; i++) {
      heirRows.push({
        name: `Sister ${i} / বোন ${i}`,
        fraction: isAul ? '1/4 (Aul)' : (sisterCount >= 2 ? '1/3 each' : '1/2'),
        percent: perSisterPct,
        shatak: perSisterAcreage,
        rule: isAul ? 'Normalized under Hanafi Aul reduction' : 'Kalalah case with multiple sisters (Quran 4:176)',
        color: '#f43f5e'
      })
    }
  }

  // Children: Sons & Daughters
  if (sonCount > 0) {
    const sonPct = sonShare * 100
    for (let i = 1; i <= sonCount; i++) {
      heirRows.push({
        name: i === 1 ? 'Son 1 (Seller) / পুত্র (বিক্রেতা)' : `Son ${i} / পুত্র ${i}`,
        fraction: activePreset === 'typical' ? '7/20' : `${((sonShare * 100)).toFixed(1)}%`,
        percent: sonPct,
        shatak: sonAcreage,
        rule: daughterCount > 0 ? 'Residuary (Asaba) 2:1 against daughter (Quran 4:11)' : 'Residuary (Asaba) universal heir (Quran 4:11)',
        color: '#38bdf8',
        isSeller: i === 1
      })
    }
  }

  if (daughterCount > 0) {
    if (sonCount === 0) {
      const daughtersShare = daughterCount === 1 ? 0.5 : (2/3)
      const perDaughterPct = (daughtersShare * 100) / daughterCount
      const perDaughterAcreage = (estateArea * daughtersShare) / daughterCount
      for (let i = 1; i <= daughterCount; i++) {
        heirRows.push({
          name: i === 1 ? 'Daughter 1 (Seller) / কন্যা ১ (বিক্রেতা)' : `Daughter ${i} / কন্যা ${i}`,
          fraction: daughterCount === 1 ? '1/2' : '1/3 each (2/3 total)',
          percent: perDaughterPct,
          shatak: perDaughterAcreage,
          rule: daughterCount === 1 ? 'Sole daughter fixed Quranic half (Quran 4:11)' : 'Multiple daughters fixed two-thirds (Quran 4:11)',
          color: '#f6bd55',
          isSeller: i === 1
        })
      }
    } else {
      const daughterPct = daughterShare * 100
      for (let i = 1; i <= daughterCount; i++) {
        heirRows.push({
          name: `Daughter ${i} / কন্যা ${i}`,
          fraction: activePreset === 'typical' ? '7/40' : `${((daughterShare * 100)).toFixed(1)}%`,
          percent: daughterPct,
          shatak: daughterAcreage,
          rule: 'Residuary (Asaba) 1:2 against brother (Quran 4:11)',
          color: '#f6bd55'
        })
      }
    }
  }

  // SVG donut calculation
  const circumference = 2 * Math.PI * 38 // 238.76
  let accumulatedLength = 0
  const donutSlices = heirRows.map(heir => {
    const sliceLength = (heir.percent / 100) * circumference
    const strokeDasharray = `${sliceLength.toFixed(1)} ${(circumference - sliceLength).toFixed(1)}`
    const strokeDashoffset = -accumulatedLength
    accumulatedLength += sliceLength
    return {
      ...heir,
      strokeDasharray,
      strokeDashoffset
    }
  })

  let sellerLegalShare = 0
  let sellerTitle = 'Seller / বিক্রেতা'
  if (sonCount > 0) {
    sellerLegalShare = sonAcreage
    sellerTitle = 'Son 1 (Seller)'
  } else if (daughterCount > 0) {
    const daughtersShare = daughterCount === 1 ? 0.5 : (2/3)
    sellerLegalShare = (estateArea * daughtersShare) / daughterCount
    sellerTitle = 'Daughter 1 (Seller)'
  } else if (deceasedGender === 'female' && husbandCount > 0) {
    sellerLegalShare = estateArea * spouseShare * aulFactor
    sellerTitle = 'Husband (Seller)'
  }

  const isClaimLegal = claimedSale <= sellerLegalShare + 0.01
  const excessShatak = Math.max(0, claimedSale - sellerLegalShare)

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

          <div className="breadcrumb" style={{ whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0a1219', border: '1px solid #1a2836', padding: '4px 12px', borderRadius: '20px', fontSize: '11px' }}>
            <span style={{ color: 'var(--muted)' }}>
              {role === 'Sub-Registrar' ? t('subRegistryDesk') : role === 'Bank Underwriter' ? t('commercialBankDesk') : t('citizenPortal')}
            </span>
            <ArrowRight size={11} style={{ opacity: 0.5 }} />
            <strong style={{ color: 'var(--text)' }}>
              {role === 'Sub-Registrar' ? t('preRegistration') : role === 'Bank Underwriter' ? t('mortgageClearance') : t('titleIntegrity')}
            </strong>
          </div>

          <div className="top-actions">
            <select 
              value={role} 
              onChange={(e) => handleRoleChange(e.target.value as Role)} 
              aria-label={t('userRole')}
              style={{
                borderColor: role === 'Sub-Registrar' ? '#2dd4a3' : role === 'Bank Underwriter' ? '#66b3e8' : '#f6bd55',
                color: role === 'Sub-Registrar' ? '#2dd4a3' : role === 'Bank Underwriter' ? '#66b3e8' : '#f6bd55',
                background: '#0d1520',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: `0 0 10px ${role === 'Sub-Registrar' ? 'rgba(45,212,163,0.15)' : role === 'Bank Underwriter' ? 'rgba(102,179,232,0.15)' : 'rgba(246,189,85,0.15)'}`
              }}
            >
              <option value="Sub-Registrar">{lang === 'bn' ? '🏛️ সাব-রেজিস্ট্রার' : '🏛️ Sub-Registrar'}</option>
              <option value="Bank Underwriter">{lang === 'bn' ? '🏦 ব্যাংক আন্ডাররাইটার' : '🏦 Bank Underwriter'}</option>
              <option value="Citizen-NRB">{lang === 'bn' ? '🛡️ নাগরিক / প্রবাসী' : '🛡️ Citizen / NRB'}</option>
            </select>
            
            <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} aria-label={t('switchLanguage')}>
              <span className={lang === 'en' ? 'active' : ''}>EN</span>
              <span>/</span>
              <span className={lang === 'bn' ? 'active' : ''}>বাংলা</span>
            </button>
            <div className="latency"><Zap size={12} /> {lang === 'bn' ? '৩.৮ সে.' : '3.8s'}</div>
            <div className="avatar">
              {role === 'Sub-Registrar' ? (lang === 'bn' ? 'এসআর' : 'SR') : role === 'Bank Underwriter' ? (lang === 'bn' ? 'বিইউ' : 'BU') : (lang === 'bn' ? 'সিজেড' : 'CZ')}
            </div>
          </div>
        </header>

        {/* 3-PAGE NAVIGATION & SCENARIO COMMAND BAR */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          margin: '14px 0 12px', 
          background: '#0a1017', 
          border: '1px solid var(--line)', 
          borderRadius: '10px', 
          padding: '6px 8px',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          {/* TABS (LEFT) */}
          <div style={{ display: 'flex', gap: '6px', flex: '1 1 auto', overflowX: 'auto' }}>
            <button 
              onClick={() => setTab('cockpit')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: tab === 'cockpit' ? '#142735' : 'transparent',
                color: tab === 'cockpit' ? 'var(--blue)' : 'var(--muted)',
                boxShadow: tab === 'cockpit' ? '0 0 12px rgba(102,179,232,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldCheck size={14} /> {lang === 'en' ? '1. Verification Cockpit' : '১. যাচাই ককপিট'}
            </button>

            <button 
              onClick={() => setTab('baya')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: tab === 'baya' ? '#142735' : 'transparent',
                color: tab === 'baya' ? 'var(--blue)' : 'var(--muted)',
                boxShadow: tab === 'baya' ? '0 0 12px rgba(102,179,232,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <GitBranch size={14} /> {lang === 'en' ? '2. Baya DAG Lineage' : '২. বায়া খতিয়ান ও দলিল ধারাবাহিকতা (DAG)'}
            </button>

            <button 
              onClick={() => setTab('farayez')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: tab === 'farayez' ? '#142735' : 'transparent',
                color: tab === 'farayez' ? 'var(--blue)' : 'var(--muted)',
                boxShadow: tab === 'farayez' ? '0 0 12px rgba(102,179,232,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Scale size={14} /> {lang === 'en' ? '3. Farayez Calculator' : '৩. ফারায়েজ বণ্টন ক্যালকুলেটর'}
            </button>
          </div>

          {/* SCENARIO SWITCHER (RIGHT) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px' }}>
              {lang === 'bn' ? 'পরিস্থিতি:' : 'SCENARIO:'}
            </span>
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
            {/* ROLE PERSPECTIVE BANNER */}
            <div style={{
              background: role === 'Sub-Registrar' ? '#0d1d16' : role === 'Bank Underwriter' ? '#0e1824' : '#1c150b',
              border: `1px solid ${role === 'Sub-Registrar' ? '#184533' : role === 'Bank Underwriter' ? '#1a3a54' : '#573a14'}`,
              color: role === 'Sub-Registrar' ? 'var(--green)' : role === 'Bank Underwriter' ? 'var(--blue)' : 'var(--amber)',
              borderRadius: '7px',
              padding: '7px 14px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              {role === 'Sub-Registrar' ? <ShieldCheck size={15} /> : role === 'Bank Underwriter' ? <BadgeCheck size={15} /> : <UserRound size={15} />}
              <span>
                <strong>
                  {role === 'Sub-Registrar' 
                    ? (lang === 'bn' ? 'সরকারি সাব-রেজিস্ট্রি ডেস্ক' : 'GOVERNMENT SUB-REGISTRY DESK') 
                    : role === 'Bank Underwriter' 
                    ? (lang === 'bn' ? 'বাণিজ্যিক ব্যাংক মর্টগেজ ডেস্ক' : 'COMMERCIAL BANK MORTGAGE DESK') 
                    : (lang === 'bn' ? 'নাগরিক ও প্রবাসী ভূমি যাচাই পোর্টাল' : 'CITIZEN & NRB LAND VERIFICATION DESK')}:
                </strong>{' '}
                {role === 'Sub-Registrar' 
                  ? (lang === 'bn' 
                      ? 'সংবিধিবদ্ধ নিবন্ধন কর্তৃপক্ষ ভিউ। সেকশন ২২এ আইনি ভেটো, বায়া দলিলের অবিচ্ছিন্নতা এবং উত্তরাধিকার কোটা বিশ্লেষণ করা হচ্ছে।' 
                      : 'Statutory registration authority view. Evaluating hard veto triggers, Baya continuity, and automated quota compliance.')
                  : role === 'Bank Underwriter'
                  ? (lang === 'bn'
                      ? 'বন্ধকী জামানত ক্লিয়ারেন্স ভিউ। ঋণের জামানত মূল্যায়ন (৪৫,০০,০০০ টাকা), স্বত্ব ঝুঁকি ও সিআইবি রেকর্ড যাচাই করা হচ্ছে।'
                      : 'Mortgage collateral clearance view. Assessing title risk, loan security value (BDT 45,00,000), and duplicate lien status.')
                  : (lang === 'bn'
                      ? 'জমি ক্রেতা ও প্রবাসী বাংলাদেশিদের জন্য ক্রয়পূর্ব অডিট। টাকা লেনদেন ও চুক্তি স্বাক্ষরের পূর্বে বিক্রেতার নিষ্কণ্টক মালিকানা নিশ্চিত করা হচ্ছে।'
                      : 'Pre-purchase due diligence view for buyers & non-resident Bangladeshis. Ensuring seller has clean title before monetary exchange.')}
              </span>
            </div>

            <div className="case-strip">
              <span>
                <span className="case-label">
                  {role === 'Sub-Registrar' 
                    ? (lang === 'bn' ? 'দলিল নথি' : 'DEED FILE') 
                    : role === 'Bank Underwriter' 
                    ? (lang === 'bn' ? 'বন্ধকী নথি' : 'MORTGAGE FILE') 
                    : (lang === 'bn' ? 'ক্রেতা অডিট' : 'BUYER AUDIT')}
                </span>
                <b className="mono">
                  {role === 'Sub-Registrar' ? 'TD-2026-014872' : role === 'Bank Underwriter' ? 'MORT-2026-8812' : 'CITIZEN-AUDIT-992'}
                </b>
              </span>
              <span>
                <BookOpen size={13} /> {role === 'Bank Underwriter' ? (lang === 'bn' ? 'জামানত ধরন' : 'Loan Security') : t('deedType')}{' '}
                <em>{role === 'Bank Underwriter' ? (lang === 'bn' ? 'গৃহ ঋণ জামানত (৪৫ লাখ টাকা)' : 'Home Loan Collateral (BDT 45L)') : t('deedType')}</em>
              </span>
              <span><Globe2 size={13} /> {t('location')}</span>
              <span className="muted">{t('lodged')}</span>
              <span style={{ marginLeft: 'auto', color: role === 'Bank Underwriter' ? 'var(--blue)' : 'var(--green)' }}>
                {role === 'Sub-Registrar' 
                  ? (lang === 'bn' ? '● সাব-রেজিস্ট্রি সরাসরি সংযুক্ত' : '● Sub-Registry Live Connected') 
                  : role === 'Bank Underwriter' 
                  ? (lang === 'bn' ? '● কোর ব্যাংকিং সিবিএস সংযুক্ত (API)' : '● Core Banking CBS Connected (API)') 
                  : (lang === 'bn' ? '● পাবলিক ল্যান্ড ট্রাস্ট গেটওয়ে' : '● Public Land Integrity Gateway')}
              </span>
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
                      <small>{lang === 'bn' ? 'দাবিকৃত জমি' : 'CLAIMED'}</small>
                      <strong className={scenario === 'fraud' ? 'bad-text' : ''}>
                        {current.claimed} <small>{t('shatak')}</small>
                      </strong>
                    </div>
                    <div className="compare-arrow">vs</div>
                    <div>
                      <small>{lang === 'bn' ? 'বৈধ প্রাপ্য' : 'ENTITLED'}</small>
                      <strong className="good-text">14 <small>{t('shatak')}</small></strong>
                    </div>
                  </div>
                  <div className="formula">{t('estateFormula')}</div>
                  <button 
                    className="outline-button" 
                    onClick={() => setTab('farayez')}
                    style={{ marginTop: '10px', width: '100%' }}
                  >
                    {lang === 'bn' ? 'ফারায়েজ বণ্টন ক্যালকুলেটরে দেখুন' : 'Open Full Farayez Sandbox'} <ArrowRight size={13} />
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
                    <div><Check size={12} /> {lang === 'bn' ? 'মালিকানার ধারাবাহিকতা' : 'Party continuity'}</div>
                    <div><Check size={12} /> {lang === 'bn' ? 'জমির পরিমাণের সমতা' : 'Area conservation'}</div>
                    <div className={scenario === 'fraud' ? 'bad-text' : ''}>
                      {scenario === 'fraud' ? <X size={12} /> : <Check size={12} />} {lang === 'bn' ? 'নামজারি ডিসিআর (DCR) বিদ্যমান' : 'Mutation DCR present'}
                    </div>
                  </div>
                  <button 
                    className="outline-button" 
                    onClick={() => setTab('baya')}
                    style={{ width: '100%' }}
                  >
                    {lang === 'bn' ? 'বায়া ধারাবাহিকতা DAG ট্রেসারে দেখুন' : 'Open Full Lineage DAG Visualizer'} <ArrowRight size={13} />
                  </button>
                </Interceptor>

                {/* LOCK MANAGER CARD */}
                <Interceptor 
                  icon={LockKeyhole} 
                  title={t('lockManager')} 
                  status={scenario === 'valid' ? 'PASS' : 'WARNING'} 
                  verdict={scenario === 'valid' ? t('freshLock') : (lang === 'bn' ? 'ধামরাই সাব-রেজিস্ট্রিতে লক সক্রিয় · দ্বৈত আবেদন বাতিল' : 'Active lock held by Dhamrai · duplicate rejected')} 
                  open={open === 'lock'} 
                  onOpen={() => setOpen(open === 'lock' ? '' : 'lock')}
                >
                  <div className="lock-key mono">Savar_Ashulia_JL87_Khatian412_Daag1893</div>
                  <div className="lock-grid">
                    <div className="countdown">
                      <strong>{scenario === 'valid' ? '45' : '36'}</strong>
                      <small>{lang === 'bn' ? 'দিন বাকি' : 'DAYS LEFT'}</small>
                    </div>
                    <div>
                      <div className="lock-state">
                        <LockKeyhole size={13} /> {current.lock} · {scenario === 'valid' ? (lang === 'bn' ? 'সাব-রেজিস্ট্রি সাভার' : 'Sub-Registry Savar') : (lang === 'bn' ? 'সাব-রেজিস্ট্রি ধামরাই' : 'Sub-Registry Dhamrai')}
                      </div>
                      <div className="lock-log">
                        {lang === 'bn' ? (
                          <>১৭ অক্টো · সাভার · লক সক্রিয়<br />০৮ অক্টো · ধামরাই · দাখিল গ্রহণ<br />০৮ অক্টো · ধামরাই · লক তৈরি</>
                        ) : (
                          <>17 Oct · Savar · acquired<br />08 Oct · Dhamrai · filing accepted<br />08 Oct · Dhamrai · lock created</>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="lock-note">{t('lockRelease')}</div>
                </Interceptor>

                <Card className="consistency">
                  <div className="consistency-title">
                    <KeyRound size={14} /> {t('nidConsistency')}
                    <Pill tone={scenario === 'valid' ? 'warn' : 'bad'}>
                      {scenario === 'valid' ? (lang === 'bn' ? 'পর্যালোচনা' : 'REVIEW') : (lang === 'bn' ? 'সতর্কতা' : 'ALERT')}
                    </Pill>
                  </div>
                  <div className="consistency-grid">
                    <span><Check size={12} /> {t('sellerNid')}</span>
                    <span><Check size={12} /> {t('porchaMatch')}</span>
                    <span className={scenario === 'fraud' ? 'bad-text' : ''}>
                      {scenario === 'fraud' ? <X size={12} /> : <Check size={12} />} {t('biometricLog')}
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
                  <div className="card-title">
                    {role === 'Sub-Registrar' 
                      ? (lang === 'bn' ? 'বাধ্যতামূলক আইনি ভেটো (Hard Veto)' : t('hardVeto')) 
                      : role === 'Bank Underwriter' 
                      ? (lang === 'bn' ? 'ক্রেডিট ঝুঁকি ও লিয়েন ভেটো' : 'Credit Risk & Lien Vetoes') 
                      : (lang === 'bn' ? 'ক্রেতার জন্য ঝুঁকি ও সতর্কতা' : 'Buyer Risk Warnings')}
                  </div>
                  <div className="veto-row">
                    <span>
                      <GitBranch size={13} />{' '}
                      {role === 'Bank Underwriter' 
                        ? (lang === 'bn' ? 'ত্রুটিপূর্ণ দলিল চেইন (Defective Title)' : 'Defective Chain-of-Title') 
                        : role === 'Citizen-NRB' 
                        ? (lang === 'bn' ? 'জাল বা ভুয়া দলিল ট্রেইল' : 'Fake / Broken Deed Trail') 
                        : t('brokenBaya')}
                    </span>
                    <Pill tone={scenario === 'fraud' ? 'bad' : 'good'}>
                      {scenario === 'fraud' 
                        ? (role === 'Bank Underwriter' 
                            ? (lang === 'bn' ? 'ডিফল্ট ঝুঁকি' : 'DEFAULT RISK') 
                            : role === 'Citizen-NRB' 
                            ? (lang === 'bn' ? 'জালিয়াতির ঝুঁকি' : 'FRAUD RISK') 
                            : t('triggered')) 
                        : t('clear')}
                    </Pill>
                  </div>
                  <div className="veto-row">
                    <span>
                      <AlertTriangle size={13} />{' '}
                      {role === 'Bank Underwriter' 
                        ? (lang === 'bn' ? 'দেওয়ানি আদালতের স্থগিতাদেশ' : 'Civil Court Injunction') 
                        : role === 'Citizen-NRB' 
                        ? (lang === 'bn' ? 'আদালতের নিষেধাজ্ঞা বা স্টে-অর্ডার' : 'Court Stay Order') 
                        : t('injunction')}{' '}
                      <small>{t('orderRules')}</small>
                    </span>
                    <Pill tone="good">{t('clearStatus')}</Pill>
                  </div>
                </Card>

                <Card className={`decision-card ${scenario === 'fraud' ? 'decision-bad' : ''}`}>
                  {role === 'Sub-Registrar' ? (
                    scenario === 'valid' ? (
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
                          <button className="danger-button" onClick={() => toast(lang === 'bn' ? 'এসিল্যান্ডের নিকট এস্কেলেশন ফাইল প্রেরিত' : 'Escalation packet prepared for AC (Land)')}>
                            {t('escalate')}
                          </button>
                          <button className="outline-button" onClick={() => toast(lang === 'bn' ? '৩ জন সহ-উত্তরাধিকারীকে নোটিশ পাঠানো হয়েছে' : 'Notification queued for 3 co-heirs')}>
                            {t('notifyCoheirs')}
                          </button>
                        </div>
                      </>
                    )
                  ) : role === 'Bank Underwriter' ? (
                    scenario === 'valid' ? (
                      <>
                        <div className="decision-icon" style={{ background: 'rgba(102,179,232,0.15)', color: 'var(--blue)' }}>
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <div className="decision-title" style={{ color: 'var(--blue)' }}>
                            {lang === 'bn' ? 'বন্ধকী জামানত অনুমোদন (Sanction Collateral)' : 'Sanction Mortgage Collateral'}
                          </div>
                          <div className="card-sub">
                            {lang === 'bn' 
                              ? '১৯২১ সিএস হতে স্বত্ব নিষ্কণ্টক · ঋণ বিতরণের জন্য নিরাপদ (৪৫ লাখ টাকা)' 
                              : 'Title clear for loan disbursal (Security: BDT 45,00,000)'}
                          </div>
                        </div>
                        <button className="primary-button" style={{ background: 'var(--blue)', borderColor: 'var(--blue)' }} onClick={() => toast.success(lang === 'bn' ? 'সাব-রেজিস্ট্রি এপিআই-তে লিয়েন নিবন্ধিত' : 'Mortgage lien registered with Sub-Registry API')}>
                          {lang === 'bn' ? 'জামানত অনুমোদন করুন' : 'Clear Loan Collateral'} <ArrowRight size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="decision-icon"><X size={20} /></div>
                        <div>
                          <div className="decision-title" style={{ color: 'var(--red)' }}>
                            {lang === 'bn' ? 'বন্ধকী জামানত প্রত্যাখ্যান (Decline Collateral)' : 'Decline Loan Collateral'}
                          </div>
                          <div className="card-sub">
                            {lang === 'bn' 
                              ? 'মারাত্মক ঝুঁকি: ২০০৯ বায়া দলিলে স্বত্ব বিচ্ছিন্ন · ঋণ খেলাপি হওয়ার ঝুঁকি' 
                              : 'CRITICAL: Defective title in 2009 Baya · High loan default risk'}
                          </div>
                        </div>
                        <div className="decision-actions">
                          <button className="danger-button" onClick={() => toast.error(lang === 'bn' ? 'ঋণ বাতিল। সিআইবি (CIB) ডেটাবেজে ঝুঁকি রিপোর্ট করা হয়েছে' : 'Loan rejected. Risk flagged in Credit Information Bureau (CIB)')}>
                            {lang === 'bn' ? 'ঋণ আবেদন বাতিল' : 'Decline Application'}
                          </button>
                          <button className="outline-button" onClick={() => toast(lang === 'bn' ? 'আন্ডাররাইটার অডিট মেমো সংরক্ষিত' : 'Underwriter audit memo saved')}>
                            {lang === 'bn' ? 'সিআইবি-তে রিপোর্ট' : 'Flag in CIB'}
                          </button>
                        </div>
                      </>
                    )
                  ) : (
                    // Citizen-NRB
                    scenario === 'valid' ? (
                      <>
                        <div className="decision-icon" style={{ background: 'rgba(246,189,85,0.15)', color: 'var(--amber)' }}>
                          <Check size={20} />
                        </div>
                        <div>
                          <div className="decision-title" style={{ color: 'var(--amber)' }}>
                            {lang === 'bn' ? 'জমিটি ক্রয় করা সম্পূর্ণ নিরাপদ' : 'Verified Safe to Purchase'}
                          </div>
                          <div className="card-sub">
                            {lang === 'bn' 
                              ? '১০০ বছরের অবিচ্ছিন্ন বায়া চেইন ও নিখুঁত ফারায়েজ অংশ যাচাইকৃত' 
                              : 'Unbroken 100-yr lineage · Clean Quranic share verified'}
                          </div>
                        </div>
                        <button className="primary-button" style={{ background: 'var(--amber)', color: '#000', borderColor: 'var(--amber)' }} onClick={() => toast.success(lang === 'bn' ? 'ক্রেতা সুরক্ষা সনদ প্রস্তুত হয়েছে!' : 'Buyer Verification Dossier generated!')}>
                          {lang === 'bn' ? 'নিরাপদে জমি কিনুন' : 'Safe to Buy'} <ArrowRight size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="decision-icon"><X size={20} /></div>
                        <div>
                          <div className="decision-title" style={{ color: 'var(--red)' }}>
                            {lang === 'bn' ? 'জমিটি কিনবেন না: চরম প্রতারণার ঝুঁকি' : 'DO NOT BUY: High Risk Fraud'}
                          </div>
                          <div className="card-sub">
                            {lang === 'bn' 
                              ? 'বিক্রেতা অন্যের জমি বিক্রির চেষ্টা করছে · জমি কিনলে মামলায় জড়াবেন' 
                              : 'Seller attempting to sell unowned land · Severe title dispute'}
                          </div>
                        </div>
                        <div className="decision-actions">
                          <button className="danger-button" onClick={() => toast.error(lang === 'bn' ? 'ভূমি মন্ত্রণালয়ের হটলাইনে (১৬১২২) অভিযোগ পাঠানো হয়েছে' : 'Fraud complaint dispatched to Land Ministry hotline 16122')}>
                            {lang === 'bn' ? 'প্রতারণার অভিযোগ (১৬১২২)' : 'Report Fraud'}
                          </button>
                          <button className="outline-button" onClick={() => toast(lang === 'bn' ? 'সরকারি আইনি সহায়তা হেল্পলাইনে (১৬৪৩০) সংযোগ হচ্ছে' : 'Connecting to Government Legal Aid Helpline (16430)')}>
                            {lang === 'bn' ? 'আইনি সহায়তা (১৬৪৩০)' : 'Legal Aid Helpline'}
                          </button>
                        </div>
                      </>
                    )
                  )}
                </Card>

                <Card className="certificate">
                  <div className="certificate-head">
                    <div>
                      <div className="card-title">
                        {role === 'Sub-Registrar' 
                          ? t('certificateTitle') 
                          : role === 'Bank Underwriter' 
                          ? (lang === 'bn' ? 'বন্ধকী স্বত্ব ক্লিয়ারেন্স সনদ' : 'Mortgage Title Clearance') 
                          : (lang === 'bn' ? 'নাগরিক ক্রয়পূর্ব ট্রাস্ট সনদ' : 'Citizen Buyer Due-Diligence')}
                      </div>
                      <div className="card-sub">
                        {role === 'Sub-Registrar' 
                          ? t('certificateSubtitle') 
                          : role === 'Bank Underwriter' 
                          ? (lang === 'bn' ? 'ক্রেডিট রিস্ক বিভাগ · বাংলাদেশ ব্যাংক জামানত অডিট' : 'Credit Risk Division · Bangladesh Bank Collateral Audit') 
                          : (lang === 'bn' ? 'পাবলিক সার্বভৌম ভূমি সুরক্ষা সিল' : 'Public Sovereign Land Integrity Trust Seal')}
                      </div>
                    </div>
                    <FileCheck2 size={19} className={scenario === 'valid' ? 'good-text' : 'bad-text'} />
                  </div>
                  {scenario === 'valid' ? (
                    <>
                      <div className="cert-valid">
                        <BadgeCheck size={13} /> 
                        {role === 'Sub-Registrar' 
                          ? (lang === 'bn' ? 'বৈধ ডিজিটাল সনদ' : 'VALID STATUTORY CERTIFICATE') 
                          : role === 'Bank Underwriter' 
                          ? (lang === 'bn' ? 'অনুমোদিত জামানত: কোনো দায় নেই' : 'MORTGAGE APPROVED: ZERO LIEN') 
                          : (lang === 'bn' ? 'যাচাইকৃত নিষ্কণ্টক জমি' : 'VERIFIED SAFE PROPERTY')}
                      </div>
                      <div className="cert-body">
                        <div className="qr">
                          <svg viewBox="0 0 80 80">
                            {Array.from({length: 64}, (_, i) => (
                              <rect key={i} x={(i%8)*10} y={Math.floor(i/8)*10} width="7" height="7" fill={(i*17+3)%5 < 2 ? 'currentColor' : 'transparent'} />
                            ))}
                          </svg>
                        </div>
                        <div className="cert-meta">
                          <span>{t('certificateId')} <b className="mono">
                            {role === 'Sub-Registrar' ? 'TD-CERT-014872' : role === 'Bank Underwriter' ? 'TD-MORT-8812' : 'TD-TRUST-9921'}
                          </b></span>
                          <span>SHA-256 <b className="mono hash">a9e4b1d7…c02f7a91</b>
                            <button className="icon-button" onClick={copyHash} aria-label={t('copyHash')}><Copy size={12} /></button>
                          </span>
                          <span>{t('signedBy')} <b>
                            {role === 'Sub-Registrar' 
                              ? (lang === 'bn' ? 'সাব-রেজিস্ট্রার, সাভার (ভূমি নিবন্ধন)' : 'Sub-Registrar, Savar') 
                              : role === 'Bank Underwriter' 
                              ? (lang === 'bn' ? 'সিনিয়র আন্ডাররাইটার, ক্রেডিট রিস্ক বিভাগ' : 'Senior Underwriter, Credit Risk Division') 
                              : (lang === 'bn' ? 'ট্রুডিড সার্বভৌম ল্যান্ড ভেরিফায়ার' : 'TrueDeed Public Trust Verifier')}
                          </b></span>
                        </div>
                      </div>
                      <button className="download-button" onClick={() => toast.success(lang === 'bn' ? 'সনদপত্র ডাউনলোড সম্পন্ন!' : 'Certificate downloaded successfully!')}>
                        {t('downloadPdf')} <ArrowRight size={13} />
                      </button>
                    </>
                  ) : (
                    <div className="withheld">
                      <LockKeyhole size={18} />
                      <strong>
                        {role === 'Sub-Registrar' 
                          ? (lang === 'bn' ? 'সনদপত্র স্থগিত ও বাজেয়াপ্ত' : 'Certificate withheld') 
                          : role === 'Bank Underwriter' 
                          ? (lang === 'bn' ? 'বন্ধকী জামানত বাতিল' : 'Mortgage Security Rejected') 
                          : (lang === 'bn' ? 'জমিটি কালো তালিকাভুক্ত' : 'Property Blacklisted')}
                      </strong>
                      <span>
                        {role === 'Sub-Registrar' 
                          ? (lang === 'bn' ? 'জালিয়াতির প্রতিবেদন তৈরি হয়েছে · কেস এসিল্যান্ডের নিকট প্রেরিত' : 'Fraud report issued · Case escalated') 
                          : role === 'Bank Underwriter' 
                          ? (lang === 'bn' ? 'উচ্চ ঝুঁকির জামানত সিআইবি (CIB) ডেটাবেজে তালিকাভুক্ত' : 'High risk collateral flagged in CIB database') 
                          : (lang === 'bn' ? 'চরম জালিয়াতির ঝুঁকি · টাকা লেনদেন করবেন না' : 'High fraud probability · Do not transfer funds')}
                      </span>
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
            {/* BACK BUTTON */}
            <div style={{ marginBottom: '14px' }}>
              <button 
                onClick={() => setTab('cockpit')}
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px', 
                  background: 'none', border: 'none', color: 'var(--blue)', 
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 
                }}
              >
                {lang === 'bn' ? '← কমান্ড সেন্টারে ফিরে যান' : '← Back to Command Center'}
              </button>
            </div>

            {/* ROLE PERSPECTIVE BANNER FOR BAYA */}
            <div style={{
              background: role === 'Sub-Registrar' ? '#0d1d16' : role === 'Bank Underwriter' ? '#0e1824' : '#1c150b',
              border: `1px solid ${role === 'Sub-Registrar' ? '#184533' : role === 'Bank Underwriter' ? '#1a3a54' : '#573a14'}`,
              color: role === 'Sub-Registrar' ? 'var(--green)' : role === 'Bank Underwriter' ? 'var(--blue)' : 'var(--amber)',
              borderRadius: '7px',
              padding: '8px 14px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
              transition: 'all 0.3s ease'
            }}>
              {role === 'Sub-Registrar' ? <ShieldCheck size={15} /> : role === 'Bank Underwriter' ? <BadgeCheck size={15} /> : <UserRound size={15} />}
              <span>
                <strong>
                  {role === 'Sub-Registrar' 
                    ? (lang === 'bn' ? 'সরকারি সাব-রেজিস্ট্রি অডিট' : 'GOVERNMENT REGISTRATION AUDIT') 
                    : role === 'Bank Underwriter' 
                    ? (lang === 'bn' ? 'ব্যাংক মর্টগেজ ঝুঁকি অডিট' : 'BANK MORTGAGE RISK AUDIT') 
                    : (lang === 'bn' ? 'নাগরিক ক্রয়পূর্ব অডিট' : 'CITIZEN PRE-PURCHASE AUDIT')}:
                </strong>{' '}
                {role === 'Sub-Registrar'
                  ? (lang === 'bn' 
                      ? 'রেজিস্ট্রেশন আইন ১৯০৮-এর ধারা ২২এ অনুযায়ী ১৯২১ সিএস হতে ২০২৬ বর্তমান দলিল পর্যন্ত অবিচ্ছিন্ন বায়া চেইন বিশ্লেষণ।' 
                      : 'Tracing statutory unbroken chain of title from 1921 CS to 2026 deed under Registration Act Sec 22A.')
                  : role === 'Bank Underwriter'
                  ? (lang === 'bn'
                      ? 'প্রথম-চার্জ জামানত নিরাপত্তা যাচাই; দলিলের কোনো একটি লিংকে ত্রুটি থাকলে আদালতে ঋণ আদায় সম্ভব হবে না।'
                      : 'Assessing first-charge collateral security; any broken link invalidates bank mortgage recovery in court.')
                  : (lang === 'bn'
                      ? 'বায়না চুক্তি বা টাকা হস্তান্তরের পূর্বে নিশ্চিত হওয়া যে বিক্রেতার পূর্ববর্তী মালিকানা নিষ্কণ্টক ছিল কিনা।'
                      : 'Verifying seller actually owns the title before transferring earnest money or signing purchase agreement.')}
              </span>
            </div>

            <Card style={{ padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                    {lang === 'bn' ? '🌲 ডিরেক্টেড অ্যাসাইক্লিক গ্রাফ (DAG) বায়া ধারাবাহিকতা ট্রেসার' : '🌲 Directed Acyclic Graph (DAG) Baya Lineage Tracer'}
                  </h2>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0' }}>
                    {lang === 'bn' 
                      ? 'মূল ১৯২১ ক্যাডাস্ট্রাল সার্ভে (সিএস) হতে বর্তমান ২০২৬ দলিল পর্যন্ত গাণিতিক স্বত্ব ধারাবাহিকতা যাচাই' 
                      : 'Mathematical Chain-of-Title verification from original 1921 Cadastral Survey down to current 2026 deed lodgment'}
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setScenario('valid')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                      background: scenario === 'valid' ? '#123128' : '#080d12',
                      border: `1px solid ${scenario === 'valid' ? 'var(--green)' : 'var(--line)'}`,
                      color: scenario === 'valid' ? 'var(--green)' : 'var(--muted)'
                    }}
                  >
                    <Check size={12} /> {lang === 'bn' ? '✓ অবিচ্ছিন্ন চেইন (৯৪%)' : 'Valid Chain (94%)'}
                  </button>
                  <button 
                    onClick={() => setScenario('fraud')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                      background: scenario === 'fraud' ? '#281216' : '#080d12',
                      border: `1px solid ${scenario === 'fraud' ? 'var(--red)' : 'var(--line)'}`,
                      color: scenario === 'fraud' ? 'var(--red)' : 'var(--muted)'
                    }}
                  >
                    <AlertTriangle size={12} /> {lang === 'bn' ? '⚠ ত্রুটিযুক্ত চেইন (১৮%)' : 'Fraud Chain (18%)'}
                  </button>
                  <Pill tone={scenario === 'valid' ? 'good' : 'bad'}>
                    {scenario === 'valid' 
                      ? (lang === 'bn' ? '৫টি নোডই অবিচ্ছিন্ন ও যাচাইকৃত' : 'ALL 5 NODES CONTINUOUS & VERIFIED') 
                      : (lang === 'bn' ? 'মারাত্মক জালিয়াতি: বায়া চেইনে বিচ্যুতি শনাক্ত' : 'CRITICAL FRAUD: BROKEN LINEAGE DETECTED')}
                  </Pill>
                </div>
              </div>

              {/* VERTICAL VISUAL DAG TREE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '850px', margin: '0 auto' }}>
                {/* NODE 1: CS */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)' }}>
                      {lang === 'bn' ? '১৯২১ খ্রি.' : '1921 A.D.'}
                    </span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
                      {lang === 'bn' ? 'ব্রিটিশ ভারত ভূমি জরিপ' : 'British Raj Survey'}
                    </div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: 'var(--green)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
                  </div>
                  <div style={{ flex: 1, background: '#0b131d', border: '1px solid #1a2f42', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
                        {lang === 'bn' ? 'নোড ১: সিএস খতিয়ান #১০২ (ক্যাডাস্ট্রাল সার্ভে বেসলাইন)' : 'Node 1: CS Khatian #102 (Cadastral Survey Baseline)'}
                      </strong>
                      <Pill tone="good">{lang === 'bn' ? 'রাষ্ট্রীয় বেসলাইন' : 'STATE BASELINE'}</Pill>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                      {lang === 'bn' ? (
                        <>
                          রেকর্ডভুক্ত মালিক: <b>জনাব আলী শেখ</b> · মৌজা: আশুলিয়া (জে.এল ৮৭) · দাগ: ১৮৯৩<br/>
                          মূল জরিপকৃত জমি: <b style={{ color: 'var(--green)' }}>১২০.০০ শতক (১.২০ একর)</b> · বেঙ্গল ডিস্ট্রিক্ট গেজেট দ্বারা সত্যায়িত।
                        </>
                      ) : (
                        <>
                          Recorded Proprietor: <b>Jonab Ali Sheikh</b> · Mouza: Ashulia (JL 87) · Daag: 1893<br/>
                          Baseline Survey Acreage: <b style={{ color: 'var(--green)' }}>120.00 Shatak (1.20 Acres)</b> · Gazetted in Bengal District Gazette.
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* CONNECTOR 1 -> 2 */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '-4px 0' }}>
                  <div style={{ width: '130px' }} />
                  <div style={{ width: '2px', height: '22px', background: 'var(--green)' }} />
                  <div style={{ fontSize: '10px', color: 'var(--muted)', background: '#070d13', border: '1px solid #142433', padding: '2px 8px', borderRadius: '4px' }}>
                    {lang === 'bn' ? '↓ ওয়ারিশসূত্রে বণ্টন (১২০ শতক → ৬০ শতক) · জমির পরিমাণ সংরক্ষিত ✓' : '↓ Inheritance Partition (120 Stk → 60 Stk) · Area Conserved ✓'}
                  </div>
                </div>

                {/* NODE 2: SA */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)' }}>
                      {lang === 'bn' ? '১৯৬২ খ্রি.' : '1962 A.D.'}
                    </span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
                      {lang === 'bn' ? 'পূর্ব পাকিস্তান ভূমি জরিপ' : 'East Pakistan Survey'}
                    </div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: 'var(--green)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--green)' }} />
                  </div>
                  <div style={{ flex: 1, background: '#0b131d', border: '1px solid #1a2f42', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
                        {lang === 'bn' ? 'নোড ২: এসএ খতিয়ান #২০৪ (স্টেট অ্যাকুইজিশন সার্ভে)' : 'Node 2: SA Khatian #204 (State Acquisition Survey)'}
                      </strong>
                      <Pill tone="good">{lang === 'bn' ? 'নামজারি নিশ্চিত' : 'MUTATION CONFIRMED'}</Pill>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                      {lang === 'bn' ? (
                        <>
                          হস্তান্তর: ওয়ারিশসূত্রে বণ্টন (জনাব আলী শেখ → রহিম উল্লাহ শেখ)<br/>
                          হস্তান্তরিত জমি: <b style={{ color: 'var(--green)' }}>৬০.০০ শতক</b> (জমির সমতা: ৬০ &lt;= ১২০) · রেকর্ড রুম খণ্ড ১৪, পৃষ্ঠা ৮৮।
                        </>
                      ) : (
                        <>
                          Conveyance: Inheritance Partition (Jonab Ali Sheikh → Rahim Ullah Sheikh)<br/>
                          Transferred Area: <b style={{ color: 'var(--green)' }}>60.00 Shatak</b> (Area Conserved: 60 &lt;= 120) · Record Room Vol. 14, Page 88.
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* CONNECTOR 2 -> 3 */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '-4px 0' }}>
                  <div style={{ width: '130px' }} />
                  <div style={{ width: '2px', height: '22px', background: 'var(--green)' }} />
                  <div style={{ fontSize: '10px', color: 'var(--muted)', background: '#070d13', border: '1px solid #142433', padding: '2px 8px', borderRadius: '4px' }}>
                    {lang === 'bn' ? '↓ আরএস রেকর্ড বন্দোবস্ত (৬০ শতক → ৪০ শতক) · সক্রিয় পর্চা #৪১২ ✓' : '↓ RS Settlement (60 Stk → 40 Stk) · Active Porcha #412 ✓'}
                  </div>
                </div>

                {/* NODE 3: RS */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)' }}>
                      {lang === 'bn' ? '১৯৮৭ খ্রি.' : '1987 A.D.'}
                    </span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
                      {lang === 'bn' ? 'বাংলাদেশ রিভিশনাল জরিপ' : 'Bangladesh Revisional'}
                    </div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: 'var(--green)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
                  </div>
                  <div style={{ flex: 1, background: '#0b131d', border: '1px solid #1a2f42', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
                        {lang === 'bn' ? 'নোড ৩: আরএস খতিয়ান #৪১২ (রিভিশনাল সার্ভে)' : 'Node 3: RS Khatian #412 (Revisional Survey)'}
                      </strong>
                      <Pill tone="good">{lang === 'bn' ? 'সক্রিয় পর্চা' : 'ACTIVE PORCHA'}</Pill>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                      {lang === 'bn' ? (
                        <>
                          রেকর্ডভুক্ত মালিক: <b>মরহুম রহিম উল্লাহ শেখ</b> · নামজারি কেস নং ১১৮/১৯৮৭<br/>
                          নির্ধারিত জমির পরিমাণ: <b style={{ color: 'var(--green)' }}>৪০.০০ শতক</b> (অবশিষ্ট ২০ শতক সহ-অংশীদারকে প্রদান)।
                        </>
                      ) : (
                        <>
                          Recorded Holder: <b>Late Rahim Ullah Sheikh</b> · Mutation Case No. 118/1987<br/>
                          Settled Land Area: <b style={{ color: 'var(--green)' }}>40.00 Shatak</b> (Remaining 20 shatak conveyed to co-sharer).
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* CONNECTOR 3 -> 4 (FRACTURE POINT ON FRAUD) */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '-4px 0' }}>
                  <div style={{ width: '130px' }} />
                  <div style={{ width: '2px', height: '26px', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)' }} />
                  {scenario === 'valid' ? (
                    <div style={{ fontSize: '10px', color: 'var(--green)', background: '#081712', border: '1px solid #163e2c', padding: '3px 8px', borderRadius: '4px' }}>
                      {lang === 'bn' ? '↓ সাফ-কবলা দলিল #৮৯২১ (ভলিউম ৪১২, পৃষ্ঠা ১৮ · ডিসিআর যাচাইকৃত ✓)' : '↓ Saf-Kabla Deed #8921 (Vol 412, Pg 18 · DCR Verified ✓)'}
                    </div>
                  ) : (
                    <div style={{ fontSize: '10px', color: '#ffb3b8', background: '#260e13', border: '1px solid #8e3946', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <AlertTriangle size={12} color="var(--red)" />{' '}
                      {lang === 'bn' 
                        ? '⚡ মারাত্মক ত্রুটিযুক্ত সংযোগ: ভলিউম ৪১২ ফাঁকা · সাব-রেজিস্ট্রি রেকর্ডে ডিসিআর (DCR) অনুপস্থিত ✕' 
                        : '⚡ CRITICAL FRACTURE POINT: Volume 412 Blank · DCR Missing ✕'}
                    </div>
                  )}
                </div>

                {/* NODE 4: BAYA DEED 2009 (THE FRACTURE POINT IN FRAUD SCENARIO) */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: scenario === 'valid' ? 'var(--blue)' : 'var(--red)' }}>
                      {lang === 'bn' ? '২০০৯ খ্রি.' : '2009 A.D.'}
                    </span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
                      {lang === 'bn' ? 'মধ্যবর্তী হস্তান্তর' : 'Intermediate Transfer'}
                    </div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)', boxShadow: scenario === 'fraud' ? '0 0 12px var(--red)' : 'none' }} />
                  </div>
                  <div style={{ flex: 1, background: scenario === 'valid' ? '#0b131d' : '#231217', border: `1px solid ${scenario === 'valid' ? '#1a2f42' : '#8e3946'}`, borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: scenario === 'valid' ? 'var(--text)' : 'var(--red)' }}>
                        {lang === 'bn' ? 'নোড ৪: বায়া সাফ-কবলা দলিল #৮৯২১ (সাভার সাব-রেজিস্ট্রি)' : 'Node 4: Baya Saf-Kabla Deed #8921 (Savar Sub-Registry)'}
                      </strong>
                      <Pill tone={scenario === 'valid' ? 'good' : 'bad'}>
                        {scenario === 'valid' 
                          ? (lang === 'bn' ? 'ডিসিআর দ্বারা যাচাইকৃত' : 'VERIFIED WITH DCR') 
                          : (lang === 'bn' ? '🚨 ভুয়া মধ্যবর্তী দলিল' : '🚨 FAKE INTERMEDIATE DEED')}
                      </Pill>
                    </div>
                    {scenario === 'valid' ? (
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                        {lang === 'bn' ? (
                          <>
                            দাতা: রহিম উল্লাহ শেখ → গ্রহীতা: <b>মোঃ আব্দুল করিম</b> (বর্তমান বিক্রেতা)<br/>
                            জমির পরিমাণ: <b>১৪.০০ শতক</b> · সাব-রেজিস্ট্রি ভলিউম: ৪১২, পৃষ্ঠা: ১৮ · ডিসিআর রসিদ: অনুমোদিত (#DCR-90412)।
                          </>
                        ) : (
                          <>
                            Seller: Rahim Ullah Sheikh → Buyer: <b>Md. Abdul Karim</b> (Current Seller)<br/>
                            Acreage: <b>14.00 Shatak</b> · Sub-Registry Volume: 412, Page: 18 · DCR Receipt: Verified (#DCR-90412).
                          </>
                        )}
                      </div>
                    ) : (
                      <div style={{ fontSize: '11px', color: '#ffb3b8', marginTop: '6px', lineHeight: '1.6' }}>
                        {lang === 'bn' ? (
                          <>
                            <b>মারাত্মক বিচ্যুতি:</b> সাভার সাব-রেজিস্ট্রি ভলিউম ৪১২, পৃষ্ঠা ১৮ ফাঁকা অথবা অন্য কোনো মৌজার নামে নিবন্ধিত!<br/>
                            সহকারী কমিশনার (ভূমি) কার্যালয়ের নামজারি ডিসিআর রসিদ অনুপস্থিত। এই ধাপে বায়া চেইন সম্পূর্ণ বিচ্ছিন্ন।
                          </>
                        ) : (
                          <>
                            <b>CRITICAL BREAK:</b> Sub-Registry Volume 412, Page 18 is blank or registered to a different Mouza!<br/>
                            Missing Mutation DCR receipt from AC Land office. Chain-of-Title broken at this transition.
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* CONNECTOR 4 -> 5 */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '-4px 0' }}>
                  <div style={{ width: '130px' }} />
                  <div style={{ width: '2px', height: '26px', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)' }} />
                  {scenario === 'valid' ? (
                    <div style={{ fontSize: '10px', color: 'var(--green)', background: '#081712', border: '1px solid #163e2c', padding: '3px 8px', borderRadius: '4px' }}>
                      {lang === 'bn' 
                        ? '↓ প্রস্তাবিত সাফ-কবলা হস্তান্তর #১২১৪ (দাবিকৃত ১২.০০ শতক <= ১৪.০০ শতক ✓)' 
                        : '↓ Target Conveyance #1214 (Claimed 12.00 Stk <= 14.00 Stk ✓)'}
                    </div>
                  ) : (
                    <div style={{ fontSize: '10px', color: '#ffb3b8', background: '#260e13', border: '1px solid #8e3946', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <X size={12} color="var(--red)" />{' '}
                      {lang === 'bn' 
                        ? '⛔ দলিল সম্পাদন নিষিদ্ধ: আইনি ভেটোর কারণে মালিকানা চেইন বিচ্ছিন্ন ✕' 
                        : '⛔ EXECUTION BLOCKED: Chain of Title Severed by Hard Veto ✕'}
                    </div>
                  )}
                </div>

                {/* NODE 5: CURRENT 2026 DEED */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '130px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: scenario === 'valid' ? 'var(--green)' : 'var(--red)' }}>
                      {lang === 'bn' ? '২০২৬ খ্রি.' : '2026 A.D.'}{' '}
                      {scenario === 'valid' 
                        ? (lang === 'bn' ? '(বর্তমান)' : '(NOW)') 
                        : (lang === 'bn' ? '(স্থগিত)' : '(BLOCKED)')}
                    </span>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
                      {lang === 'bn' ? 'বর্তমান দাখিলকৃত দলিল' : 'Current Lodgment'}
                    </div>
                  </div>
                  <div style={{ width: '2px', height: '100%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)', minHeight: '80px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: scenario === 'valid' ? 'var(--green)' : 'var(--red)', boxShadow: scenario === 'fraud' ? '0 0 12px var(--red)' : 'none' }} />
                  </div>
                  <div style={{ flex: 1, background: scenario === 'valid' ? '#0b131d' : '#1c0f13', border: `1px solid ${scenario === 'valid' ? '#205340' : '#8e3946'}`, borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: scenario === 'valid' ? 'var(--text)' : 'var(--red)' }}>
                        {lang === 'bn' 
                          ? 'নোড ৫: প্রস্তাবিত সাফ-কবলা দলিল TD-2026-014872 (যাচাই প্রক্রিয়াধীন)' 
                          : 'Node 5: Target Saf-Kabla Deed #1214 (Under Review)'}
                      </strong>
                      <Pill tone={scenario === 'valid' ? 'good' : 'bad'}>
                        {scenario === 'valid' 
                          ? (lang === 'bn' ? 'সম্পাদনের জন্য প্রস্তুত' : 'READY FOR EXECUTION') 
                          : (lang === 'bn' ? 'সম্পাদন স্থগিত ও নিষিদ্ধ' : 'EXECUTION BLOCKED')}
                      </Pill>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: '1.6' }}>
                      {lang === 'bn' ? (
                        <>
                          বিক্রেতা: মোঃ আব্দুল করিম → ক্রেতা: মোঃ শামীম রেজা · দলিলে উল্লিখিত জমি: <b>{scenario === 'valid' ? '১২.০০ শতক' : '২২.০০ শতক'}</b><br/>
                          ফলাফল: {scenario === 'valid' ? '১৯২১ সিএস জরিপ পর্যন্ত অবিচ্ছিন্ন ধারাবাহিকতা প্রমাণিত।' : 'মধ্যবর্তী নোডে ত্রুটির কারণে নিবন্ধন আইনত বাতিল ও প্রত্যাখ্যাত।'}
                        </>
                      ) : (
                        <>
                          Seller: Md. Abdul Karim → Buyer: Md. Shamim Reza · Deeded Area: <b>{scenario === 'valid' ? '12.00 Shatak' : '22.00 Shatak'}</b><br/>
                          Verdict: {scenario === 'valid' ? 'Continuity verified back to 1921 CS survey.' : 'REGISTRATION REJECTED due to broken intermediate node.'}
                        </>
                      )}
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
            {/* BACK BUTTON */}
            <div style={{ marginBottom: '14px' }}>
              <button 
                onClick={() => setTab('cockpit')}
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px', 
                  background: 'none', border: 'none', color: 'var(--blue)', 
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 
                }}
              >
                {lang === 'bn' ? '← কমান্ড সেন্টারে ফিরে যান' : '← Back to Command Center'}
              </button>
            </div>

            {/* ROLE PERSPECTIVE BANNER FOR FARAYEZ */}
            <div style={{
              background: role === 'Sub-Registrar' ? '#0d1d16' : role === 'Bank Underwriter' ? '#0e1824' : '#1c150b',
              border: `1px solid ${role === 'Sub-Registrar' ? '#184533' : role === 'Bank Underwriter' ? '#1a3a54' : '#573a14'}`,
              color: role === 'Sub-Registrar' ? 'var(--green)' : role === 'Bank Underwriter' ? 'var(--blue)' : 'var(--amber)',
              borderRadius: '7px',
              padding: '8px 14px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
              transition: 'all 0.3s ease'
            }}>
              {role === 'Sub-Registrar' ? <ShieldCheck size={15} /> : role === 'Bank Underwriter' ? <BadgeCheck size={15} /> : <UserRound size={15} />}
              <span>
                <strong>
                  {role === 'Sub-Registrar' 
                    ? (lang === 'bn' ? 'সরকারি উত্তরাধিকার অডিট' : 'GOVERNMENT INHERITANCE AUDIT') 
                    : role === 'Bank Underwriter' 
                    ? (lang === 'bn' ? 'ব্যাংক ঋণগ্রহীতা ইকুইটি অডিট' : 'BANK BORROWER EQUITY AUDIT') 
                    : (lang === 'bn' ? 'নাগরিক সহ-ওয়ারিশ সুরক্ষা অডিট' : 'CITIZEN CO-HEIR PROTECTION AUDIT')}:
                </strong>{' '}
                {role === 'Sub-Registrar'
                  ? (lang === 'bn' 
                      ? 'মুসলিম পারিবারিক আইন অধ্যাদেশ ১৯৬১ ও শরিয়াহ অনুযায়ী বিক্রেতার বৈধ উত্তরাধিকার কোটা যাচাই।' 
                      : 'Verifying statutory inheritance quota under Muslim Personal Law (Shariat) to prevent illegal over-sale.')
                  : role === 'Bank Underwriter'
                  ? (lang === 'bn'
                      ? 'ঋণগ্রহীতার সুনির্দিষ্ট নিষ্কণ্টক অংশ নির্ধারণ, যাতে অন্য কোনো সহ-ওয়ারিশের অংশ বন্ধক হিসেবে না পড়ে।'
                      : 'Calculating exact unencumbered equity share to ensure borrower cannot pledge co-heirs’ property as loan collateral.')
                  : (lang === 'bn'
                      ? 'বিক্রেতা তার মা বা বোনদের কোরআনিক অংশ ফাঁকি দিয়ে অতিরিক্ত জমি বিক্রি করছে কিনা তা নিখুঁতভাবে যাচাই।'
                      : 'Validating that seller is not attempting to sell their sisters’ or mother’s Quranic shares to an unsuspecting buyer.')}
              </span>
            </div>

            {/* HEADER BANNER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '9px', letterSpacing: '1.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {lang === 'bn' ? 'উত্তরাধিকার কর্মশালা · মুসলিম পারিবারিক আইন অধ্যাদেশ ১৯৬১' : 'SUCCESSION WORKBENCH · BD-1961'}
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 2px', color: 'var(--text)' }}>
                  {lang === 'bn' ? 'ফারায়েজ উত্তরাধিকার বণ্টন ক্যালকুলেটর' : 'Farayez Calculator Sandbox'}
                </h1>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                  {lang === 'bn' 
                    ? 'বাংলাদেশ ল্যান্ড রেজিস্ট্রেশন ও মুসলিম উত্তরাধিকার আইনের নির্ভুল গাণিতিক সিমুলেটর।' 
                    : 'Exact fractional inheritance math for Bangladesh land succession review.'}
                </p>
              </div>

              <div style={{ 
                border: '1px solid #714a1a', background: '#1c150a', 
                color: '#f6bd55', borderRadius: '20px', padding: '6px 14px', 
                fontSize: '11px', fontWeight: 600 
              }}>
                {lang === 'bn' ? 'সুন্নি (হানাফি) ফিকহ ও বণ্টন বিধিমালা' : 'Sunni (Hanafi) rules, as applied in Bangladesh'}
              </div>
            </div>

            {/* PRESETS ROW */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1.2px' }}>
                  {lang === 'bn' ? 'প্রিসেটসমূহ' : 'PRESETS'}
                </span>

                <button 
                  onClick={setTypicalPreset}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', fontSize: '11px',
                    background: activePreset === 'typical' ? '#142735' : '#0c131a',
                    border: `1px solid ${activePreset === 'typical' ? 'var(--blue)' : 'var(--line)'}`,
                    color: activePreset === 'typical' ? 'var(--text)' : 'var(--muted)',
                    cursor: 'pointer'
                  }}
                >
                  <b>{lang === 'bn' ? 'সাধারণ পরিবার' : 'Typical family'}</b>{' '}
                  <small style={{ opacity: 0.7 }}>
                    {lang === 'bn' ? 'স্ত্রী · ১ পুত্র · ৩ কন্যা' : 'widow · 1 son · 3 daughters'}
                  </small>
                </button>

                <button 
                  onClick={setDaughtersPreset}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', fontSize: '11px',
                    background: activePreset === 'daughters' ? '#142735' : '#0c131a',
                    border: `1px solid ${activePreset === 'daughters' ? 'var(--blue)' : 'var(--line)'}`,
                    color: activePreset === 'daughters' ? 'var(--text)' : 'var(--muted)',
                    cursor: 'pointer'
                  }}
                >
                  <b>{lang === 'bn' ? 'শুধুমাত্র কন্যারা' : 'Daughters only'}</b>
                </button>

                <button 
                  onClick={setAulPreset}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', fontSize: '11px',
                    background: activePreset === 'aul' ? '#142735' : '#0c131a',
                    border: `1px solid ${activePreset === 'aul' ? 'var(--blue)' : 'var(--line)'}`,
                    color: activePreset === 'aul' ? 'var(--text)' : 'var(--muted)',
                    cursor: 'pointer'
                  }}
                >
                  <b>{lang === 'bn' ? 'আওল পরিস্থিতি' : 'Aul case'}</b>{' '}
                  <small style={{ opacity: 0.7 }}>
                    {lang === 'bn' ? 'স্বামী · মা · ২ বোন' : 'husband · mother · 2 sisters'}
                  </small>
                </button>

                <button 
                  onClick={setTypicalPreset}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '6px', fontSize: '11px',
                    background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={12} /> {lang === 'bn' ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* INLINE SCENARIO SWITCHER ON PAGE 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>
                  {lang === 'bn' ? 'পরিস্থিতি:' : 'SCENARIO:'}
                </span>
                <button 
                  onClick={() => setScenario('valid')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                    background: scenario === 'valid' ? '#123128' : '#080d12',
                    border: `1px solid ${scenario === 'valid' ? 'var(--green)' : 'var(--line)'}`,
                    color: scenario === 'valid' ? 'var(--green)' : 'var(--muted)'
                  }}
                >
                  <Check size={11} /> {lang === 'bn' ? '✓ বৈধ (১২ শতক)' : 'Valid (12 Stk)'}
                </button>
                <button 
                  onClick={() => setScenario('fraud')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                    background: scenario === 'fraud' ? '#281216' : '#080d12',
                    border: `1px solid ${scenario === 'fraud' ? 'var(--red)' : 'var(--line)'}`,
                    color: scenario === 'fraud' ? 'var(--red)' : 'var(--muted)'
                  }}
                >
                  <AlertTriangle size={11} /> {lang === 'bn' ? '⚠ জালিয়াতি (২২ শতক লঙ্ঘন)' : 'Fraud (22 Stk Breach)'}
                </button>
              </div>
            </div>

            {/* 2-COLUMN MAIN WORKBENCH */}
            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '18px' }}>
              {/* LEFT CARD: INPUTS */}
              <div style={{ background: '#0b1118', border: '1px solid var(--line)', borderRadius: '10px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {lang === 'bn' ? 'ইনপুট' : 'INPUTS'}
                    </span>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '2px 0 0', color: 'var(--text)' }}>
                      {lang === 'bn' ? 'মোট সম্পত্তি ও পরিবার' : 'Estate & family'}
                    </h3>
                  </div>
                  <Scale size={18} style={{ color: 'var(--blue)' }} />
                </div>

                {/* ESTATE AREA */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>
                    {lang === 'bn' ? 'মোট সম্পত্তির পরিমাণ' : 'Estate area'}
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input 
                      type="number" 
                      value={estateArea} 
                      onChange={(e) => setEstateArea(Math.max(1, Number(e.target.value)))}
                      style={{ flex: 1, background: '#060a0f', border: '1px solid var(--line)', color: 'var(--text)', padding: '8px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 700 }}
                    />
                    <select style={{ background: '#060a0f', border: '1px solid var(--line)', color: 'var(--text)', padding: '0 8px', borderRadius: '6px', fontSize: '11px' }}>
                      <option>{lang === 'bn' ? 'শতক' : 'Shatak'}</option>
                      <option>{lang === 'bn' ? 'ডেসিমাল' : 'Decimal'}</option>
                      <option>{lang === 'bn' ? 'কাঠা' : 'Katha'}</option>
                      <option>{lang === 'bn' ? 'একর' : 'Acre'}</option>
                    </select>
                  </div>
                </div>

                {/* CLAIMED SALE */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <label style={{ fontSize: '10px', color: 'var(--muted)' }}>
                      {sellerTitle}{lang === 'bn' ? '-এর দাবিকৃত বিক্রয় (শতক)' : '\'s claimed sale (shatak)'}
                    </label>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: isClaimLegal ? 'var(--green)' : 'var(--red)' }}>
                      {isClaimLegal 
                        ? (lang === 'bn' ? `✓ বৈধ (<= ${sellerLegalShare.toFixed(2)} শতক)` : `✓ Legal (<= ${sellerLegalShare.toFixed(2)} Stk)`) 
                        : (lang === 'bn' ? `🚨 কোটা লঙ্ঘন (+${excessShatak.toFixed(2)} শতক)` : `🚨 Quota Breach (+${excessShatak.toFixed(2)} Stk)`)}
                    </span>
                  </div>
                  <input 
                    type="number" 
                    value={claimedSale} 
                    onChange={(e) => setClaimedSale(Number(e.target.value))}
                    style={{ 
                      width: '100%', 
                      background: isClaimLegal ? '#060a0f' : '#231014', 
                      border: `1px solid ${isClaimLegal ? 'var(--line)' : 'var(--red)'}`, 
                      color: isClaimLegal ? 'var(--text)' : '#ffb3b8', 
                      padding: '8px 10px', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      fontWeight: 700 
                    }}
                  />
                </div>

                {/* DECEASED GENDER */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>
                    {lang === 'bn' ? 'মৃত ব্যক্তির লিঙ্গ' : 'Deceased gender'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button 
                      onClick={() => { setDeceasedGender('male'); setHusbandCount(0); setWifeCount(1) }}
                      style={{
                        padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                        background: deceasedGender === 'male' ? '#123128' : 'transparent',
                        border: `1px solid ${deceasedGender === 'male' ? 'var(--green)' : 'var(--line)'}`,
                        color: deceasedGender === 'male' ? 'var(--green)' : 'var(--muted)'
                      }}
                    >
                      {lang === 'bn' ? 'পুরুষ' : 'Male'}
                    </button>
                    <button 
                      onClick={() => { setDeceasedGender('female'); setWifeCount(0); setHusbandCount(1) }}
                      style={{
                        padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                        background: deceasedGender === 'female' ? '#123128' : 'transparent',
                        border: `1px solid ${deceasedGender === 'female' ? 'var(--green)' : 'var(--line)'}`,
                        color: deceasedGender === 'female' ? 'var(--green)' : 'var(--muted)'
                      }}
                    >
                      {lang === 'bn' ? 'নারী' : 'Female'}
                    </button>
                  </div>
                </div>

                {/* HEIRS LIST */}
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                    {lang === 'bn' ? 'পরিবারের উত্তরাধিকারীগণ' : 'Heirs in family'}
                  </span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {deceasedGender === 'male' ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#070c12', padding: '6px 10px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '11px' }}>{lang === 'bn' ? 'বিধবা স্ত্রী' : 'Wife / বিধবা স্ত্রী'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button onClick={() => setWifeCount(Math.max(0, wifeCount - 1))} style={{ padding: '2px 7px', background: '#14202c', border: 'none', color: 'var(--text)', borderRadius: '3px', cursor: 'pointer' }}>-</button>
                          <b style={{ minWidth: '14px', textAlign: 'center', fontSize: '11px' }}>{wifeCount}</b>
                          <button onClick={() => setWifeCount(wifeCount + 1)} style={{ padding: '2px 7px', background: '#14202c', border: 'none', color: 'var(--text)', borderRadius: '3px', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#070c12', padding: '6px 10px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '11px' }}>{lang === 'bn' ? 'স্বামী' : 'Husband / স্বামী'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button onClick={() => setHusbandCount(Math.max(0, husbandCount - 1))} style={{ padding: '2px 7px', background: '#14202c', border: 'none', color: 'var(--text)', borderRadius: '3px', cursor: 'pointer' }}>-</button>
                          <b style={{ minWidth: '14px', textAlign: 'center', fontSize: '11px' }}>{husbandCount}</b>
                          <button onClick={() => setHusbandCount(husbandCount + 1)} style={{ padding: '2px 7px', background: '#14202c', border: 'none', color: 'var(--text)', borderRadius: '3px', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#070c12', padding: '6px 10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px' }}>{lang === 'bn' ? 'পুত্র সন্তান' : 'Sons / পুত্র'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button onClick={() => setSonCount(Math.max(0, sonCount - 1))} style={{ padding: '2px 7px', background: '#14202c', border: 'none', color: 'var(--text)', borderRadius: '3px', cursor: 'pointer' }}>-</button>
                        <b style={{ minWidth: '14px', textAlign: 'center', fontSize: '11px' }}>{sonCount}</b>
                        <button onClick={() => setSonCount(sonCount + 1)} style={{ padding: '2px 7px', background: '#14202c', border: 'none', color: 'var(--text)', borderRadius: '3px', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#070c12', padding: '6px 10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px' }}>{lang === 'bn' ? 'কন্যা সন্তান' : 'Daughters / কন্যা'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button onClick={() => setDaughterCount(Math.max(0, daughterCount - 1))} style={{ padding: '2px 7px', background: '#14202c', border: 'none', color: 'var(--text)', borderRadius: '3px', cursor: 'pointer' }}>-</button>
                        <b style={{ minWidth: '14px', textAlign: 'center', fontSize: '11px' }}>{daughterCount}</b>
                        <button onClick={() => setDaughterCount(daughterCount + 1)} style={{ padding: '2px 7px', background: '#14202c', border: 'none', color: 'var(--text)', borderRadius: '3px', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#070c12', padding: '6px 10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px' }}>{lang === 'bn' ? 'মাতা' : 'Mother / মাতা'}</span>
                      <input type="checkbox" checked={hasMother} onChange={(e) => setHasMother(e.target.checked)} style={{ cursor: 'pointer' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#070c12', padding: '6px 10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '11px' }}>{lang === 'bn' ? 'পিতা' : 'Father / পিতা'}</span>
                      <input type="checkbox" checked={hasFather} onChange={(e) => setHasFather(e.target.checked)} style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT CARD: OUTPUT & DONUT CHART */}
              <div style={{ background: '#0b1118', border: '1px solid var(--line)', borderRadius: '10px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {lang === 'bn' ? `লাইভ ফলাফল · ${estateArea.toFixed(2)} শতক` : `LIVE OUTPUT · ${estateArea.toFixed(2)} SHATAK`}
                    </span>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '2px 0 0', color: 'var(--text)' }}>
                      {lang === 'bn' ? 'সম্পত্তি বণ্টন বিবরণ' : 'Inheritance split'}
                    </h3>
                  </div>
                  <button 
                    onClick={() => { 
                      navigator.clipboard?.writeText(`Estate: ${estateArea} shatak, Son: ${sonAcreage.toFixed(2)} shatak`); 
                      toast.success(lang === 'bn' ? 'হিসাব ক্লিপবোর্ডে কপি করা হয়েছে!' : 'Calculation copied to clipboard!') 
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: 'none', color: 'var(--blue)', fontSize: '11px', cursor: 'pointer' }}
                  >
                    <Copy size={13} /> {lang === 'bn' ? 'ফলাফল কপি করুন' : 'Copy result'}
                  </button>
                </div>

                {/* DONUT CHART & LEGEND */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', padding: '10px 0 20px', flexWrap: 'wrap' }}>
                  {/* SVG DONUT */}
                  <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#16222f" strokeWidth="16" />
                      {donutSlices.map((slice, idx) => (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth="16"
                          strokeDasharray={slice.strokeDasharray}
                          strokeDashoffset={slice.strokeDashoffset}
                          style={{ transition: 'all 0.4s ease' }}
                        />
                      ))}
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <strong style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', display: 'block', lineHeight: 1 }}>
                        {activePreset === 'typical' ? '13/20' : `${Math.min(100, Math.round(heirRows.reduce((acc, h) => acc + h.percent, 0)))}%`}
                      </strong>
                      <span style={{ fontSize: '8px', color: 'var(--muted)', letterSpacing: '0.5px' }}>
                        {lang === 'bn' ? 'সম্পত্তি বণ্টিত' : 'estate allocated'}
                      </span>
                    </div>
                  </div>

                  {/* LEGEND */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', minWidth: '220px' }}>
                    {heirRows.map((heir, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: heir.color, flexShrink: 0 }} />
                          <span style={{ color: heir.isSeller ? 'var(--blue)' : 'var(--text)', fontWeight: heir.isSeller ? 600 : 400 }}>{heir.name}</span>
                        </span>
                        <b className="mono">{heir.percent.toFixed(2)}%</b>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RULES TABLE */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'left', marginTop: '10px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--muted)' }}>
                      <th style={{ padding: '6px 4px' }}>{lang === 'bn' ? 'উত্তরাধিকারী' : 'Heir'}</th>
                      <th style={{ padding: '6px 4px' }}>{lang === 'bn' ? 'ভগ্নাংশ' : 'Fraction'}</th>
                      <th style={{ padding: '6px 4px' }}>{lang === 'bn' ? 'শতাংশ' : 'Percent'}</th>
                      <th style={{ padding: '6px 4px' }}>{lang === 'bn' ? 'শতক' : 'Shatak'}</th>
                      <th style={{ padding: '6px 4px' }}>{lang === 'bn' ? 'প্রযুক্ত আইনি বিধি' : 'Rule applied'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heirRows.map((heir, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #14202c', background: heir.isSeller ? '#0e1f2b' : 'transparent' }}>
                        <td style={{ padding: '7px 4px' }}>
                          <b style={{ color: heir.isSeller ? 'var(--blue)' : 'inherit' }}>{heir.name}</b>
                        </td>
                        <td style={{ padding: '7px 4px' }} className="mono">{heir.fraction}</td>
                        <td style={{ padding: '7px 4px' }} className="mono">{heir.percent.toFixed(2)}%</td>
                        <td style={{ padding: '7px 4px', color: heir.color }} className="mono"><b>{heir.shatak.toFixed(2)}</b></td>
                        <td style={{ padding: '7px 4px', color: 'var(--muted)' }}>{heir.rule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* VERDICT BANNER */}
                <div style={{ 
                  marginTop: '16px', padding: '12px', borderRadius: '6px',
                  background: isClaimLegal ? '#10251f' : '#28161d',
                  border: `1px solid ${isClaimLegal ? '#205340' : '#8e3946'}`
                }}>
                  <strong style={{ fontSize: '12px', color: isClaimLegal ? 'var(--green)' : 'var(--red)', display: 'block', marginBottom: '3px' }}>
                    {isClaimLegal 
                      ? (lang === 'bn' ? '✅ উত্তরাধিকার কোটা যাচাই উত্তীর্ণ' : '✅ Quota Verification Passed') 
                      : (lang === 'bn' ? '❌ মারাত্মক জালিয়াতি: কোটা লঙ্ঘন' : '❌ Critical Fraud: Quota Breach')}
                  </strong>
                  <div style={{ fontSize: '10px', color: 'var(--text)', lineHeight: '1.4' }}>
                    {lang === 'bn' ? (
                      <>
                        বিক্রেতার বৈধ প্রাপ্যতা: <b>{sellerLegalShare.toFixed(2)} শতক</b> | দাবিকৃত বিক্রয়: <b>{claimedSale.toFixed(2)} শতক</b>।
                        {isClaimLegal ? (
                          <span style={{ color: 'var(--green)', display: 'block', marginTop: '2px' }}>
                            নিবন্ধনযোগ্য ও নিরাপদ। প্রস্তাবিত হস্তান্তর মুসলিম পারিবারিক আইন অধ্যাদেশ ১৯৬১ ও কোরআনিক কোটার মধ্যে রয়েছে।
                          </span>
                        ) : (
                          <span style={{ color: 'var(--red)', display: 'block', marginTop: '2px' }}>
                            মারাত্মক জালিয়াতি: বিক্রেতা তার বৈধ প্রাপ্যতার চেয়ে <b>{(claimedSale - sellerLegalShare).toFixed(2)} শতক</b> জমি অতিরিক্ত বিক্রির চেষ্টা করছে, যা অন্যান্য সহ-উত্তরাধিকারীদের অধিকার হরণ করে!
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        Seller legal entitlement: <b>{sellerLegalShare.toFixed(2)} Shatak</b> | Attempted sale: <b>{claimedSale.toFixed(2)} Shatak</b>.
                        {isClaimLegal ? (
                          <span style={{ color: 'var(--green)', display: 'block', marginTop: '2px' }}>
                            Safe to proceed. Sale is within inherited quota under Muslim Family Laws Ordinance 1961.
                          </span>
                        ) : (
                          <span style={{ color: 'var(--red)', display: 'block', marginTop: '2px' }}>
                            CRITICAL FRAUD: Seller is attempting to sell <b>{(claimedSale - sellerLegalShare).toFixed(2)} Shatak</b> in excess, depriving co-heirs!
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer>
          {t('footerDisclaimer')} 
          <span>
            {lang === 'bn' 
              ? 'বিল্ড ২০২৬.১০.১৭ · সুরক্ষিত সেশন · DIU LandTech Innovation Hackathon 2026 (LA-72)' 
              : 'Build 2026.10.17 · Secure session · DIU LandTech 2026 (LA-72)'}
          </span>
        </footer>
      </main>
    </>
  )
}
