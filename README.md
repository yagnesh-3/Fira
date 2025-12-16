# FIRA 🎉

**FIRA** - Your ultimate platform for discovering venues and creating unforgettable parties.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)

## 🚀 Overview

FIRA is an event management platform that connects party organizers with venue owners. Whether you want to host a private celebration or discover the hottest events in town, FIRA makes it simple and elegant.

## ✨ Features (Phase 1 - Landing Page)

- **🎨 Stunning UI** - Modern dark theme with party light effects
- **📱 Responsive Design** - Works beautifully on all devices
- **🎯 Animated Hero** - Dynamic text animation (FIRA/Celebrate)
- **🎪 Parties Section** - Browse upcoming events
- **🏢 Venue Owner Section** - Information for venue partners
- **🎸 Brand/Band Section** - Features for verified artists
- **🔄 Smooth Scrolling** - Seamless navigation between sections

## 🛠️ Tech Stack

### Frontend (client/)
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### Backend (server/)
- **Node.js** - Runtime environment
- **Express.js** - Web framework

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yash-0006/Fira.git
   cd Fira
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Run the development server**
   ```bash
   # In client directory
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
Fira/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   └── components/    # React components
│   │       ├── Hero.tsx
│   │       ├── Navbar.tsx
│   │       ├── PartiesSection.tsx
│   │       ├── CreatePartySection.tsx
│   │       ├── BrandBandSection.tsx
│   │       ├── VenueOwnerSection.tsx
│   │       ├── CTASection.tsx
│   │       └── Footer.tsx
│   └── package.json
├── server/                 # Express backend
│   └── package.json
└── README.md
```

## 🗺️ Roadmap

- [x] **Phase 1** - Landing Page
- [ ] **Phase 2** - Authentication (User & Owner roles)
- [ ] **Phase 3** - Owner Dashboard (Venue posting with Google Maps)
- [ ] **Phase 4** - User Dashboard & Event System
- [ ] **Phase 5** - Verification System (Brands/Bands badges)
- [ ] **Phase 6** - Discovery (Nearby venues/parties)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ for party lovers
