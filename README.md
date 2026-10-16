# TrueDeed (LA-72)
### Algorithmic Land Fraud & Double-Selling Prevention Platform
**Event:** LandTech 2026 Innovation Hackathon  
**Track:** Digital Land Records, Verification & Digitization  
**Problem Chosen:** `P3: Catch Fraud & Double-Selling` (Rule Book Section 5)  
**Team Code:** LA-72  
**Domain:** GovTech / LegalTech / PropTech  

---

## 📌 1. Project Overview & Problem Chosen (P3)
Over **70% of all civil litigations in Bangladesh** stem from land disputes. Existing government portals (such as *e-Porcha* and *e-Namjari*) act as passive archives of historical records rather than proactive fraud detection systems.

Under **Problem P3: Catch Fraud & Double-Selling**, **TrueDeed** resolves the foundational institutional void between the **Ministry of Law (Sub-Registry Offices)** and the **Ministry of Land (AC Land Offices)**. It provides an automated, sub-second verification layer that evaluates land documents against statutory inheritance quotas, chain-of-title lineage, and active transaction locks before fraudulent transfers occur.

---

## 🏗️ 2. System Architecture & Data Flow Blueprints

All 10 architecture and data flow diagrams are available in the [`Architecture_and Data_flow/`](./Architecture_and%20Data_flow/) directory:

| Module | Architecture Blueprint | End-to-End Data Flow |
| :--- | :--- | :--- |
| **1. Farayez Inheritance Fraud Prevention** | [`Architecture SVG`](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/1.Inheritance_Fraud_Prevention_Dataflow.svg) |
| **2. Baya Deed Lineage (Chain of Ownership)** | [`Architecture SVG`](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/2.Chain_of_Ownership_Verification_Dataflow.svg) |
| **3. Double-Selling Prevention (Plot Lock)** | [`Architecture SVG`](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/3.Double_Selling_Prevention_Dataflow.svg) |
| **4. Bangla Legal Document OCR** | [`Architecture SVG`](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/4.Bangla_Legal_OCR_Dataflow.svg) |
| **5. TrueDeed Composite Trust Score** | [`Architecture SVG`](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Architecture.svg) | [`Data Flow SVG`](./Architecture_and%20Data_flow/5.TrueDeed_Trust_Score_Dataflow.svg) |

---

## 🎯 3. Core Verification Engines

1. **Multimodal Bangla Legal OCR:** Extracts structured legal entities (Mouza, JL, Khatian, Daag, Chouhaddi, Area) directly from physical deed scans without manual data entry.
2. **Algorithmic Farayez (Inheritance Math) Engine:** Enforces statutory ratios under the *Muslim Family Laws Ordinance 1961* ($1 \text{ Son} = 2 \text{ Daughters}$). Flags immediate alerts if deeded selling area exceeds the seller's maximum legal entitlement.
3. **Directed Acyclic Graph (DAG) for Baya Lineage:** Mathematically verifies historical chain-of-title from original state surveys (CS/SA/RS) enforcing temporal consistency, party continuity, and area conservation.
4. **45-Day Temporal Active Plot Lock:** Places an atomic mutex lock on the composite geographic key (`District_Upazila_Mouza_Khatian_Daag`) upon registration, completely eliminating double-selling scams during the mutation latency window.
5. **TrueDeed Trust Score (0–100%):** Standardized, defensible risk score for citizens, expatriates, and mortgage loan underwriters.

---

## 🔒 4. Data Sources & Privacy Compliance (Rule Book Section 10)
In strict compliance with **Section 10 (Do's and Don'ts)** and **Section 14 (FAQ)** of the LandTech 2026 Rule Book:
* **No Real Personal Data Used:** This project **does not** use real people's names, NID numbers, phone numbers, or real land records.
* **Synthetic Dummy Data Only:** All demonstration datasets, Khatian entries, and sample deed documents are **100% synthetically generated dummy data** modeled after standard Sub-Registry deed templates (সাফ কবলা) and public survey structures (CS, SA, RS, e-Porcha schemas).
* **Zero Government Scraping:** No data was scraped or bulk-downloaded from government websites, nor were any live government servers tested or accessed.

---

## 🤖 5. AI Tools Disclosure (Rule Book Section 8 & 10)
In full transparency as required by the LandTech 2026 Rule Book:
* **Google Gemini 2.0 Flash Vision API:** Used for Multimodal Vision-Language entity extraction from unstructured legal Bengali deed images.
* **OpenCV:** Open-source computer vision library for image preprocessing (adaptive binarization, deskewing, noise filtering).
* **Antigravity & ChatGPT:** Utilized as AI pair-programming and documentation assistants for algorithmic refinement, Farayez ratio logic formulation, and system architecture design.

---

## 🚀 6. How to Run the Project Locally

### Prerequisites
* Python 3.10+
* Git

### Installation & Execution
```bash
# 1. Clone the repository
git clone https://github.com/Ishtiak-Ahmed886/TrueDeed.git
cd TrueDeed

# 2. View Architecture & Concept Note
# Open TrueDeed_Concept_Note_4Pages.html in any modern browser to view or print the official 4-page submission concept note.
```

---

## 👥 7. Team & Mentorship (Rule Book Section 6)
* **Team Name:** TrueDeed
* **Team Code:** LA-72
* **Student 1 (Team Leader):** Ishtiak Ahmed (DIU Student)
* **Student 2 (Core Member):** [Teammate Name] (DIU Student)
* **Faculty Mentor:** [Faculty Mentor Name] (Department of CSE, DIU)
* **Industry Mentor:** [Industry Mentor Name] (Industry Expert)
