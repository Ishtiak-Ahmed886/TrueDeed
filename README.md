# TrueDeed (LA-72)
### AI-Powered Land Record Digitization, Fraud Prevention & Instant Verification Platform
**Event:** DIU LandTech Innovation Hackathon 2026  
**Track:** Digital Land Records, Verification & Digitization  
**Team Code:** LA-72  
**Domain:** GovTech / LegalTech / PropTech  

---

## 📌 Executive Overview
Over 70% of all civil litigations in Bangladesh stem from land disputes. Existing government portals (e-Porcha, e-Namjari) serve as passive archives of historical records rather than proactive fraud detection systems.

**TrueDeed** bridges the structural institutional void between the **Ministry of Law (Sub-Registry Offices)** and the **Ministry of Land (AC Land Offices)**. It provides an automated, sub-second verification layer that evaluates land documents against statutory inheritance quotas, chain-of-title lineage, and active transaction locks before fraudulent transfers occur.

---

## 🏗️ System Architecture & Data Flow Diagrams

All 10 architecture and data flow diagrams are available in the [`Architecture_and Data_flow/`](./Architecture_and%20Data_flow/) folder:

| Module | Architecture Blueprint | End-to-End Data Flow |
| :--- | :--- | :--- |
| **1. Farayez Inheritance Fraud Prevention** | [`Architecture SVG`](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Dataflow.svg) |
| **2. Baya Deed Lineage (Chain of Ownership)** | [`Architecture SVG`](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Dataflow.svg) |
| **3. Double-Selling Prevention (Plot Lock)** | [`Architecture SVG`](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Dataflow.svg) |
| **4. Bangla Legal Document OCR** | [`Architecture SVG`](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Dataflow.svg) |
| **5. TrueDeed Composite Trust Score** | [`Architecture SVG`](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Dataflow.svg) |

---

## 🎯 The 5 Core Problems Solved by TrueDeed

### 1. Inheritance Over-Selling (Farayez Violation)
* **Problem:** Heirs inheriting fractional rights (e.g., 20 decimals out of 60 decimals) forge heir certificates and sell 30+ decimals without co-heirs' knowledge.
* **TrueDeed Engine:** Implements Muslim Family Laws Ordinance 1961 algorithms ($1 \text{ Son} = 2 \text{ Daughters}$). If `Selling_Amount > Legal_Share`, triggers an instant **Critical Over-Selling Fraud Alert**.

### 2. Broken Baya Lineage (Chain of Title)
* **Problem:** Fraudsters produce counterfeit intermediate deeds with fake sub-registry book volumes.
* **TrueDeed Engine:** Constructs a Directed Acyclic Graph (DAG) connecting CS &rarr; SA &rarr; RS &rarr; Current Deed. Enforces 3 mathematical invariants: Temporal Consistency, Party Continuity, and Area Conservation.

### 3. Double-Selling Scam (45-Day Mutation Window)
* **Problem:** Mutation (Namjari) takes 30-45 days after deed execution at the Sub-Registry. Fraudulent sellers exploit this delay to sell the same plot to multiple buyers.
* **TrueDeed Engine:** Enforces an atomic 45-day temporal lock on the composite geographic key (`District_Upazila_Mouza_Khatian_Daag`). Secondary sales fire an immediate **Concurrent Transfer Alert**.

### 4. Bangla Legal Document OCR
* **Problem:** Physical deeds contain dense, archaic Bengali legal jargon spanning 10-15 pages.
* **TrueDeed Engine:** Multimodal Vision-Language Model extracts structured entities: Mouza, JL No, CS/SA/RS Khatian, Haal/Sabek Daag, Chouhaddi (boundaries), and transferred area.

### 5. TrueDeed Trust Score (0-100%)
* **Problem:** Buyers and mortgage banks lack an objective metric to assess title risk.
* **TrueDeed Engine:** Computes an aggregated score:
  * **Baya Chain Integrity:** 35%
  * **Farayez Math Compliance:** 25%
  * **Plot Lock Status:** 25%
  * **Identity Match:** 15%
  * **Hard Veto:** Active Section 144 court injunction triggers an immediate fail-safe collapse to &lt; 30%.

---

## 📁 Repository Structure

```
TrueeDeed/
├── Architecture_and Data_flow/       # 10 Complete Architecture & Dataflow SVGs
│   ├── 1.Inheritance_Fraud_Prevention_Architecture.svg
│   ├── 1.Inheritance_Fraud_Prevention_Dataflow.svg
│   ├── 2.Chain_of_Ownership_Verification_Architecture.svg
│   ├── 2.Chain_of_Ownership_Verification_Dataflow.svg
│   ├── 3.Double_Selling_Prevention_Architecture.svg
│   ├── 3.Double_Selling_Prevention_Dataflow.svg
│   ├── 4.Bangla_Legal_OCR_Architecture.svg
│   ├── 4.Bangla_Legal_OCR_Dataflow.svg
│   ├── 5.TrueDeed_Trust_Score_Architecture.svg
│   └── 5.TrueDeed_Trust_Score_Dataflow.svg
├── Project analysis.docx              # Initial Project Analysis & Scope
├── TrueDeed problem and solve.md     # Detailed Problem & Solution Breakdown
├── TrueDeed_Official_Submission_Proposal.md # Full Competition Proposal Draft
└── README.md                         # Main Project Documentation
```

---

## 👥 Team & Submission Information
* **Team Name:** TrueDeed
* **Team Code:** LA-72
* **Hackathon:** DIU LandTech Innovation Hackathon 2026
* **Track:** Digital Land Records, Verification & Digitization
