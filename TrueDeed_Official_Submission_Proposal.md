# TRUEDEED: PROJECT PROPOSAL
**AI-Powered Land Record Digitization, Fraud Prevention & Instant Verification Platform**  
*DIU LandTech Innovation Hackathon 2026*  

---

### Project Metadata
* **Team Name:** TrueDeed
* **Team Code:** LA-72
* **Competition Track:** Digital Land Records, Verification & Digitization
* **Domain:** GovTech / LegalTech / PropTech
* **Target Objective:** Zero-Fraud Land Conveyancing & Verification

---

## 1. Executive Summary

Over **70% of all civil litigations in Bangladesh** stem from land disputes, entangling over 3 million citizens in generational court battles and paralyzing billions of takas in national economic wealth. While the Ministry of Land has developed digital record initiatives (such as *e-Porcha* and *e-Namjari*), current government portals remain **passive repositories of static data**. They lack real-time algorithmic fraud detection, cannot parse complex unstructured legal Bengali deeds, and fail to prevent illegal transactions before deeds are registered.

**TrueDeed** is an intelligent, automated verification and fraud-prevention infrastructure engineered to bridge the critical void between citizens, Sub-Registry offices, and AC Land offices. By unifying **Bangla Legal Document OCR**, an automated **Farayez (Inheritance Math) Engine**, a **Baya Deed Lineage Graph (DAG)**, and a real-time **45-day Active Plot Lock**, TrueDeed empowers citizens, banks, and legal officers to verify land ownership legitimacy in under five seconds, outputting an objective **TrueDeed Trust Score (0–100%)**.

---

## 2. Problem Statement & Systemic Root Causes in Bangladesh

Land fraud in Bangladesh is not merely caused by deceptive individuals; it is fundamentally enabled by a **structural institutional disconnect** within public administration:

> **The Dual-Ministry Void:** Deed Registration is governed by the *Ministry of Law (Directorate of Registration)*, whereas Land Records (Khatian, Survey Records, Mutation) are governed by the *Ministry of Land*. Because these two ministries operate without a synchronized, real-time transaction validation layer, fraudsters easily execute forged or disputed deed transfers.

### The Three Critical Fraud Vectors Solved by TrueDeed:

1. **Inheritance Share Over-Selling (ওয়ারিশান ফাঁকি ও অতিরিক্ত অংশ বিক্রয়):**  
   Following a landowner's demise, heirs inherit strictly defined fractional shares. Dishonest heirs routinely forge local heir certificates or conceal siblings (particularly female heirs) to sell 30 to 40 decimals from an estate where their legitimate legal share is only 15 decimals. Innocent buyers purchase these invalid titles and face subsequent civil lawsuits from legitimate heirs.

2. **Broken Baya Deed Continuity (বায়া দলিলের ধারাবাহিকতাহীনতা):**  
   Legitimate land ownership requires an unbroken historical chain of title dating back to initial state surveys (CS → SA → RS → Mutation). Fraud syndicates fabricate intermediate "Baya deeds" (preceding deeds) featuring fictitious sub-registry volume numbers, making manual verification virtually impossible for ordinary buyers.

3. **Double-Selling Scam & The 45-Day Mutation Latency (দ্বৈত বিক্রয় জালিয়াতি):**  
   In Bangladesh, finalizing a Mutation (নামজারি) at the AC Land office takes 30 to 45 days after deed execution. During this latency window, government databases still reflect the original seller's name. Dishonest sellers exploit this blindspot to execute duplicate sales of the same plot to multiple unsuspecting buyers.

---

## 3. The TrueDeed Solution Architecture

TrueDeed operates as an automated 4-engine verification pipeline:

```
[ USER INPUT: DEED SCAN / PDF / PHOTO ]
                   │
                   ▼
[ ENGINE 1: BANGLA LEGAL OCR & MULTIMODAL ENTITY PARSER ]
Extracts: Mouza | JL | Khatian (CS/SA/RS) | Daag | Chouhaddi | Area | Heirs
                   │
         ┌─────────┼─────────────────────────┐
         ▼                                   ▼
[ ENGINE 2: FARAYEZ MATH CORE ]     [ ENGINE 3: BAYA DAG GRAPH ]     [ ENGINE 4: ACTIVE PLOT LOCK ]
Computes strict 1:2 inheritance      Validates CS->SA->RS->Deed       Enforces 45-day mutex lock on
shares; flags over-selling.         Chronology, Party & Area.        Mouza+Daag to stop double sales.
         │                                   │                                     │
         └─────────┬─────────────────────────┴─────────────────────────────────────┘
                   ▼
[ MASTER AGGREGATOR: TRUEDEED TRUST SCORE (0–100%) ]
Formula: (Baya_Chain * 0.35) + (Farayez * 0.25) + (Lock * 0.25) + (Identity * 0.15)
Fail-Safe Veto: Active Court Injunction (Sec 144) = Hard Failure (<30%)
                   │
                   ▼
[ OUTPUT: AUDIT REPORT & TAMPER-EVIDENT QR VERIFICATION CERTIFICATE ]
🟢 Grade A (90-100%): Safe / Bank Ready
🟡 Grade B (60-89%): Caution / Pending Mutation
🔴 Grade C (<60%): Critical Fraud Alert
```

### Detailed Breakdown of the 4 Engines:

* **Engine 1: Bangla Legal OCR & Entity Extractor (Perception Layer):**  
  Utilizes an adaptive computer vision and Multimodal Vision-Language Model (VLM) pipeline tailored for antiquated, yellowed, and handwritten Bangladeshi legal deeds. Eliminates manual data entry by extracting structural entities: Mouza, JL Number, Khatian classification (CS/SA/RS/BS), Haal and Sabek Daag numbers, directional four-boundary specifications (চৌহদ্দি), and fractional decimal acreage.

* **Engine 2: Algorithmic Farayez Inheritance Validator (Mathematical Layer):**  
  Implements statutory Farayez inheritance distribution algorithms. Upon inputting the deceased ancestor's total land volume and surviving heirs, the engine computes exact 16-Ana fractions ($1 \text{ Son} = 2 \text{ Daughters}$). If a deed specifies transferred land exceeding the seller's mathematical ceiling, the engine triggers an immediate **Critical Over-Selling Fraud Flag**.

* **Engine 3: Directed Acyclic Graph (DAG) for Baya Lineage (Lineage Layer):**  
  Constructs a historical chain of title as a Directed Acyclic Graph connecting original survey records (CS/SA) through intermediary transfer deeds to the present seller. The engine enforces three mathematical invariants: (1) Temporal Consistency, (2) Party Continuity, and (3) Area Conservation. Any broken link immediately isolates the fraudulent document.

* **Engine 4: Temporal Active Plot Lock (Security Layer):**  
  Introduces a distributed concurrency control mechanism to land conveyancing. Whenever a deed verification or transfer is registered, TrueDeed instantiates a 45-day temporary mutex lock on the composite geographic key (`District_Upazila_Mouza_Khatian_Daag`). Any secondary transaction attempted on the identical plot within the mutation window triggers an immediate **Concurrent Transfer Alert**, eliminating the double-selling loophole.

---

## 4. The TrueDeed Trust Score (0–100%) & Evaluation Matrix

| Evaluation Metric | Weightage | Algorithmic Verification Criteria |
| :--- | :---: | :--- |
| **Baya Chain Integrity** | **35 Points** | Unbroken DAG continuity from state survey (CS/SA/RS) to current deed with verified party and date sequence. |
| **Farayez Share Accuracy** | **25 Points** | Transferred acreage is strictly $\le$ calculated mathematical inheritance allocation based on statutory heir formulas. |
| **Plot Lock Status** | **25 Points** | Zero conflicting transfer transactions registered on the specified Daag within the active 45-day latency window. |
| **Registry & Identity Match** | **15 Points** | Optical entity consistency across Seller NID, Namjari record, and Sub-Registry transaction log. |
| **Hard Veto Override** | **FAIL-SAFE** | Active Section 144 injunction or ongoing court litigation automatically overrides score to **< 30% (Critical Risk)**. |

---

## 5. Technical Architecture & Zero-Cost Implementation Feasibility

* **Frontend UI:** Next.js 14, React, and Tailwind CSS. Modern, responsive dashboard designed for non-technical citizens and bank loan underwriters.
* **Backend API Gateway:** Python FastAPI implementing lightweight, asynchronous REST microservices for sub-second execution.
* **Computer Vision & OCR:** OpenCV preprocessing (deskewing, binarization) integrated with Google Gemini Vision API (Free Tier: 1,500 daily requests) and EasyOCR for offline processing.
* **Database & Concurrency Ledger:** SQLite for embedded zero-config prototyping and PostgreSQL schemas for spatial plot coordinates.
* **Security & Verification:** SHA-256 cryptographic hashing to generate tamper-evident verification certificates accessible via secure QR codes.
* **Zero Capital Expenditure:** 100% buildable using open-source libraries and production free tiers.

---

## 6. Stakeholder Value Proposition & Social Impact

| Stakeholder | Measurable Impact Delivered by TrueDeed |
| :--- | :--- |
| **Citizens & Buyers** | Eliminates land purchase risks in 5 seconds before token money is surrendered; neutralizes dependence on corrupt middle-men. |
| **Expatriates (প্রবাসী)** | Enables non-resident Bangladeshis to conduct authentic, remote title due diligence on ancestral and prospective properties from abroad. |
| **Mortgage Banks & NBFIs** | Compresses collateral title verification cycles from 21 days down to seconds, reducing Non-Performing Loans (NPLs) backed by defective mortgages. |
| **Judicial System & Govt** | Addresses the root cause of 70% of civil litigations, significantly unburdening the court system and fulfilling the national *Smart Bangladesh Land Management* mandate. |

---

## 7. Hackathon Execution Roadmap

* **Round 1 (Preliminary Submission):** Formalize system architecture, mathematical Farayez algorithmic proofs, DAG lineage specifications, and complete technical proposal documentation.
* **Round 2 (Working Prototype & Final Presentation):** Deploy live, interactive demonstration dashboard featuring: (1) Instant deed image drag-and-drop parsing, (2) Live Farayez over-selling fraud detection, (3) Interactive visual Baya Lineage DAG timeline, and (4) Dynamic Trust Score generation with printable verification audit certificates.
* **Post-Hackathon Production Pilot:** Integration with the Ministry of Land Open API initiatives to pilot TrueDeed across model upazila sub-registry and AC Land offices.

---
**Submitted by:** Team TrueDeed (LA-72)  
**Event:** DIU LandTech Innovation Hackathon 2026
