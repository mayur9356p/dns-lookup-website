# 🌐 DNS Lookup — Modern Web-Based DNS Intelligence Tool

A modern, fast, cybersecurity-inspired DNS Lookup web application that allows users to inspect live Domain Name System (DNS) records in real-time. Powered by Google Public DNS-over-HTTPS (DoH) API, this full-stack application resolves live internet records securely and transparently.

Designed to be beginner-friendly, lightweight, and suitable for college project demonstrations, networking labs, and cybersecurity courses.

---

## 📸 Overview & Key Highlights

- **Real DNS Resolution**: Queries real-time authoritative DNS records via Google Public DNS (RFC 8484 DNS-over-HTTPS).
- **8 Supported Query Modes**: `A`, `AAAA`, `MX`, `NS`, `TXT`, `CNAME`, `SOA`, and comprehensive `ALL` spectrum mode.
- **Cybersecurity Dark / Light Theme**: Dark navy interface with blue/cyan gradient accents, smooth transitions, and instant theme toggling.
- **Interactive Results Dashboard**:
  - Displays queried domain, query mode, DNS resolver status (`NOERROR`, `NXDOMAIN`, `SERVFAIL`), response latency (in ms), and record count.
  - Formatted tables with readable TTL (`300s (5m)`), MX mail exchange priorities (`★ 10`), and TXT SPF/Verification tags.
  - Interactive tabs to filter records by type when querying `ALL`.
- **Export & Productivity Utilities**:
  - 📋 **Copy individual record values** with instant visual feedback.
  - 📋 **Copy all records** formatted for documentation.
  - 💾 **Download JSON** payload.
  - 📊 **Download CSV** spreadsheet.
  - 🔄 **Refresh** active lookup.
- **Search History**: LocalStorage-backed query history with one-click re-querying.
- **Educational DNS Academy**: Plain-English explanations and real-world analogies for each DNS record type.
- **Architecture Pipeline**: Visual flowchart explaining DNS resolution flow and why DNS-over-HTTPS protects against ISP snooping and MITM attacks.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Modern reactive component architecture & instant HMR |
| **Icons** | Lucide React | High-tech cybersecurity and utility icons |
| **Styling** | Modern CSS3 (Variables) | Glassmorphism, cyan/blue gradients, dark/light theme |
| **Backend Runtime** | Node.js (ES Modules) | High-performance asynchronous execution |
| **Backend Framework** | Express.js | REST API routing, domain sanitation, and error handling |
| **DNS Resolver** | Google Public DoH | RFC 8484 compliant HTTPS DNS queries (`https://dns.google/resolve`) |
| **Security & Utilities** | CORS & express-rate-limit | API abuse protection and cross-origin resource sharing |

---

## 📂 Project Structure

```text
DNS Lookup/
├── backend/
│   ├── routes/
│   │   └── dnsRoutes.js         # API endpoints (/api/dns, /api/health)
│   ├── services/
│   │   └── dnsService.js        # Google DoH service, normalization, record parsing
│   ├── .env.example             # Environment variable template
│   ├── .env                     # Local environment configuration
│   ├── package.json             # Backend dependencies and scripts
│   └── server.js                # Express app, CORS, rate limiting, error middleware
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AboutSection.jsx       # College project details & tech stack
│   │   │   ├── DnsLearningSection.jsx # Educational DNS record guides
│   │   │   ├── FeatureCards.jsx       # Quick lookup cards (IPv4, IPv6, MX, NS)
│   │   │   ├── Footer.jsx             # Footer with record links & copyright
│   │   │   ├── HeroSection.jsx        # Search bar, dropdown, and example shortcuts
│   │   │   ├── HowItWorks.jsx         # Visual 4-step DoH resolution pipeline
│   │   │   ├── Navbar.jsx             # Brand logo, nav links, DoH badge, theme toggle
│   │   │   ├── RecentSearches.jsx     # LocalStorage history bar
│   │   │   ├── ResultsDashboard.jsx   # Interactive table, stats, export tools
│   │   │   └── Toast.jsx              # Toast notification system
│   │   ├── services/
│   │   │   └── dnsApi.js              # API client, CSV/JSON export, clipboard helper
│   │   ├── App.jsx                    # Root state orchestrator
│   │   ├── index.css                  # Modern CSS variable design system
│   │   └── main.jsx                   # React DOM entry point
│   ├── index.html                     # HTML5 shell with Google Fonts
│   ├── package.json                   # Frontend dependencies
│   └── vite.config.js                 # Vite bundler configuration & backend proxy
├── package.json                       # Root script orchestrator
├── README.md                          # Full documentation & college demo guide
└── .gitignore                         # Git ignore configuration
```

---

## 🚀 Getting Started (Installation & Run)

### Prerequisites
- **Node.js** v18.0.0 or higher (`node -v`)
- **npm** v9.0.0 or higher (`npm -v`)

---

### Step 1: Open Terminal in the Project Directory
In Windows PowerShell or Command Prompt, navigate to the project directory:
```powershell
cd "c:\Users\mayur\OneDrive\Desktop\DNS Lookup"
```

---

### Step 2: Install All Dependencies
You can install dependencies for root, backend, and frontend at once:
```powershell
npm run install:all
```
*(Or install them individually by running `npm install` inside `backend` and `frontend`)*

---

### Step 3: Run the Application

#### Option A: Run Both Frontend and Backend Concurrently (Recommended)
From the root directory, simply run:
```powershell
npm run dev
```
This boots:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

#### Option B: Run in Separate Terminals

**Terminal 1 (Backend):**
```powershell
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 API Reference

### 1. Health Check
Checks if the backend API and resolver service are active.
- **URL**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok",
  "service": "DNS Lookup API",
  "resolver": "Google Public DNS-over-HTTPS",
  "timestamp": "2026-10-24T07:45:00.000Z",
  "supportedTypes": ["A", "AAAA", "MX", "NS", "TXT", "CNAME", "SOA", "ALL"]
}
```

### 2. DNS Query
Resolves DNS records for a given domain name.
- **URL**: `GET /api/dns?domain={domain}&type={type}`
- **Parameters**:
  - `domain` *(required)*: e.g. `google.com`, `github.com`, `cloudflare.com`
  - `type` *(optional, default `A`)*: `A`, `AAAA`, `MX`, `NS`, `TXT`, `CNAME`, `SOA`, or `ALL`

#### Example Request:
```http
GET http://localhost:5000/api/dns?domain=google.com&type=MX
```

#### Example Response:
```json
{
  "success": true,
  "domain": "google.com",
  "queryType": "MX",
  "status": "NOERROR",
  "statusCode": 0,
  "statusDescription": "DNS Query completed successfully",
  "queryTimeMs": 38,
  "recordCount": 1,
  "records": [
    {
      "name": "google.com.",
      "type": "MX",
      "typeCode": 15,
      "ttl": 300,
      "value": "smtp.google.com.",
      "priority": 10,
      "parsedDetails": {
        "priority": 10,
        "exchange": "smtp.google.com."
      }
    }
  ]
}
```

### 3. Reverse DNS Query (IP → Hostname)
Performs reverse DNS resolution on an IPv4 or IPv6 address to retrieve PTR records.
- **URL**: `GET /api/reverse-dns?ip={ip}`
- **Parameters**:
  - `ip` *(required)*: e.g. `192.178.211.139`, `8.8.8.8`, `1.1.1.1`, or `2001:4860:4860::8888`

#### Example Request:
```http
GET http://localhost:5000/api/reverse-dns?ip=192.178.211.139
```

#### Example Response:
```json
{
  "success": true,
  "mode": "reverse",
  "ip": "192.178.211.139",
  "ipVersion": "IPv4",
  "arpa": "139.211.178.192.in-addr.arpa",
  "queryType": "PTR",
  "status": "NOERROR",
  "statusCode": 0,
  "statusDescription": "DNS Query completed successfully",
  "queryTimeMs": 28,
  "recordCount": 1,
  "hostnames": [
    "lcbomp-in-f139.1e100.net"
  ],
  "records": [
    {
      "name": "139.211.178.192.in-addr.arpa.",
      "type": "PTR",
      "typeCode": 12,
      "ttl": 1661,
      "value": "lcbomp-in-f139.1e100.net",
      "priority": null
    }
  ]
}
```

---

## 🔍 Supported DNS Records Explained

1. **A (IPv4 Address)**: Maps human-readable domain names to 32-bit IPv4 addresses (e.g., `142.251.220.78`).
2. **AAAA (IPv6 Address)**: Resolves next-generation 128-bit hexadecimal IPv6 addresses (e.g., `2607:f8b0:4004:837::200e`).
3. **MX (Mail Exchange)**: Routes incoming domain emails to authoritative mail servers with designated priority integers.
4. **NS (Name Server)**: Identifies the authoritative DNS servers delegated to manage the domain's DNS zone.
5. **TXT (Text)**: Carries verification strings and cryptographic security policies such as SPF, DKIM, and DMARC.
6. **CNAME (Canonical Name)**: Creates an alias pointing one domain name to another true canonical domain name.
7. **SOA (Start of Authority)**: Contains zone administrative metadata, including primary nameserver, admin email, serial number, and zone refresh timers.
8. **PTR (Pointer / Reverse DNS)**: Resolves an IPv4 or IPv6 address back into its canonical registered hostname via `in-addr.arpa` / `ip6.arpa`.
9. **ALL (Full Spectrum)**: Executes concurrent parallel queries across all supported record types and aggregates the results.


---

## 🛡️ Error Handling & Edge Cases

| Scenario | Handled Behavior | User Experience |
|---|---|---|
| **Non-Existent Domain (NXDOMAIN)** | Google DoH returns RCODE 3 | Clearly shows `NXDOMAIN (3)` with a helpful explanation. |
| **Valid Domain with No Records** | Google DoH returns RCODE 0 with 0 answers | Displays "No [Type] records found" with suggested alternatives. |
| **Malformed Domain Syntax** | Backend regex validation rejects input | Returns HTTP 400 with a descriptive hint without calling DoH. |
| **Network Timeout** | AbortSignal triggers after 6 seconds | Reports timeout error gracefully without crashing. |
| **API Rate Limiting** | Limit of 120 requests per 15 min per IP | Returns HTTP 429 with cooldown instructions. |
| **Stack Trace Privacy** | Centralized error middleware | Never leaks server stack traces or internal paths to clients. |

---

## 🎓 College Presentation Demo Guide

When presenting this project:
1. **Show Live Queries**:
   - Query `google.com` with `A` to show IPv4 addresses and TTL values.
   - Query `github.com` with `MX` to show how email priority ranking works (`★ 10`).
   - Query `cloudflare.com` with `ALL` to demonstrate parallel query aggregation and the interactive category filters.
2. **Demonstrate Error Handling**:
   - Enter an invalid domain like `thisdomaindoesnotexist999888.com` to demonstrate handling of `NXDOMAIN (3)`.
   - Enter `invalid..syntax` to show server-side input validation.
3. **Demonstrate Productive Utilities**:
   - Click the "Copy" button on an IP to show instant clipboard copy.
   - Click "Download CSV" to demonstrate generating a real spreadsheet file client-side.
   - Click "Download JSON" to show the raw payload.
4. **Demonstrate UI/UX**:
   - Toggle the Dark / Light theme switch.
   - Show recent query history chips that persist across page reloads.
   - Review the "DNS Academy" cards and the "How It Works" visual pipeline.

---

## 📄 License
This project is open-source and intended for educational and academic use.
