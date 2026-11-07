import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ImpactStats from './components/ImpactStats'
import Introduction from './components/Introduction'
import Mission from './components/Mission'
import Solutions from './components/Solutions'
import Innovations from './components/Innovations'
import EcoJourney from './components/eco-journey/EcoJourney'
import EcoArcade from './components/eco-arcade/EcoArcade'
import TakeAction from './components/TakeAction'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-[#041A12] text-[#F3F7EF] flex flex-col selection:bg-[#B8F34A] selection:text-[#041A12] w-full max-w-full">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-full">
        {/* Hero Section */}
        <Hero />

        {/* Impact Statistics */}
        <ImpactStats />

        {/* Introduction / Why Sustainability Matters */}
        <Introduction />

        {/* Our Mission Section */}
        <Mission />

        {/* Solutions Section */}
        <Solutions />

        {/* Green Innovations Section */}
        <Innovations />

        {/* Eco Journey Gamification System */}
        <EcoJourney />

        {/* Eco Arcade Interactive Cleanup Mini-Game */}
        <EcoArcade />

        {/* Take Action Section */}
        <TakeAction />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
