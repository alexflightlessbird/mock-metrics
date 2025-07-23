# MockMetrics 🏛️⚖️

**Ballot Analysis for Competitive Mock Trial Teams**  
*Data-driven insights to elevate your AMTA performance*

[![Contributing](https://img.shields.io/badge/Contributions-Welcome-%23FF8300)](CONTRIBUTING.md)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Security](https://img.shields.io/badge/Security-Policy-%2344CC11)](SECURITY.md)

![MockMetrics Screenshot](https://via.placeholder.com/800x400?text=MockMetrics+UI+Screenshot)  
*(Replace with actual screenshot)*

## 🔍 What is MockMetrics?
A specialized analytics platform that helps **college mock trial teams**:
- 📊 Visualize scoring patterns from AMTA ballots
- 🎯 Identify strengths/weaknesses across case details, witnesses, and attorneys
- 🔄 Compare performance across tournaments
- � Optimize strategy using empirical data

*Note: This is an independent tool not affiliated with the American Mock Trial Association (AMTA).*

## 🚀 Key Features
- **Ballot Breakdowns** - Heatmaps of scoring categories
- **Trend Analysis** - Performance evolution across tournaments
- **Role Comparisons** - Witness/attorney effectiveness metrics
- **Custom Reports** - Exportable data visualizations
- **Privacy-First** - All data processed client-side (optional server sync)

## 💎 Premium Features (Optional)
- **AI-Assisted Strategy Suggestions** *Coming Soon* - Get customized recommendations
- **AI-Assisted Ballot Image Inputs** - Use pictures to upload ballots, rather than typing everything out
- **Advanced Analytics** *Coming Soon* - Deeper trend analysis across seasons
- **Priority Support** - Faster response times

*AI features use Azure Cognitive Services and may incur API costs for local development. No AMTA data is used to train models created by MockMetrics.*
*All core functionality remains free forever. Premium features help sustain development.*

## 🛠️ Tech Stack
- **Frontend**: React + Mantine UI
- **Authentication**: Supabase
- **Hosting**: Render

## ⚖️ Legal Disclaimer
MockMetrics:
1. Is **not endorsed by or affiliated with AMTA**
2. Uses **no copyrighted AMTA materials** 
3. Processes only **user-uploaded ballot data**
4. Complies with FERPA for student data protection
5. Complies with GDPR for individual data privacy

## 🤝 Contributing
We welcome contributions! Please read our [Contribution Guidelines](CONTRIBUTING.md) before submitting changes.

[![Contributing Guide](https://img.shields.io/badge/Guide-CONTRIBUTING.md-blue)](CONTRIBUTING.md)

## 🏗️ Development Setup
```bash
git clone https://github.com/alexflightlessbird/mock-metrics.git
cd mock-metrics
cp .env.example .env # Update with your own values
npm install
npm run dev
```

## 💻 Requirements for Development
- Node.js v18+
- npm v9+
- Supabase account

[![Project Status](https://img.shields.io/badge/status-active-brightgreen)]()
[![Open Issues](https://img.shields.io/github/issues-raw/alexflightlessbird/mock-metrics)]()
