# Where Is My Money?
> A personal finance anomaly detector that helps you understand where your money actually goes.

Where Is My Money? is a smart, lightweight tool that analyzes your bank statements, auto-categorizes your spending, detects unusual financial patterns, and generates friendly, AI-based explanations for suspicious transactions.

This project was built in 24 hours during a hackathon.

---

## 🚨 Problem

Banks provide basic statements, but users rarely get intelligent insights into:

- Unexpected charges  
- Suspicious merchants  
- Spending spikes  
- Irregular financial behavior  
- Hidden overspending patterns  

Most people only realize spending issues *after* money is gone.

---

## 🎯 Solution — *Where Is My Money?*

This system transforms raw transaction data into *actionable financial awareness*.

### ✔ Imports CSV / PDF bank statements  
### ✔ Automatically categorizes transactions  
### ✔ Flags anomalies like:
- High-amount transactions  
- Sudden frequency spikes  
- New merchants  
- Behavior shifts  

### ✔ Generates explainable risk scores  
### ✔ Visualizes anomalies in a timeline  
### ✔ Provides LLM-powered insights  
- AI-based merchant categorization  
- AI-generated explanations for anomalies  

---

## 🧠 Features

-  **Upload CSV/PDF** bank statements  
-  **Rule-based + LLM-based categorization**  
-  **Anomaly detection engine**  
-  **Explainable risk scoring**  
-  **Recharts timeline visualization**  
-  **LLM-based explanation generator**  
-  **SQLite storage for transactions**  
-  **Clean React UI (no Tailwind)**  

---

## 🏗️ Tech Stack

### **Frontend**
- React + Vite  
- CSS Modules / Plain CSS  
- Recharts  
- Axios  

### **Backend**
- Node.js  
- Express.js  
- csv-parser  
- pdf-parse  
- sqlite3  

### **AI**
- OpenAI / Gemini API  
- Merchant categorizer  
- Anomaly explanation generator  

---

## 🧱 Architecture

```txt
                      +----------------------+
     CSV / PDF -----> |   Upload Endpoint    |
                      +----------------------+
                                 |
                                 v
                   +----------------------------+
                   |  Parsing Layer (CSV/PDF)   |
                   +----------------------------+
                                 |
                                 v
                 +--------------------------------+
                 |  Categorization Engine         |
                 |  - Rule-based matching         |
                 |  - UPI pattern detection       |
                 |  - LLM merchant classification |
                 +--------------------------------+
                                 |
                                 v
                   +----------------------------+
                   |  Anomaly Detection Engine  |
                   |  - Outliers                |
                   |  - Spikes                  |
                   |  - Behavioral shifts       |
                   +----------------------------+
                                 |
                                 v
                 +--------------------------------+
                 |  Risk Scoring + LLM Explanation |
                 +--------------------------------+
                                 |
                                 v
                       +-------------------+
                       |  SQLite Database  |
                       +-------------------+
                                 |
                                 v
                     +-------------------------+
                     |   React Frontend UI     |
                     |   - Dashboard           |
                     |   - Timeline            |
                     |   - Insights            |
                     +-------------------------+
