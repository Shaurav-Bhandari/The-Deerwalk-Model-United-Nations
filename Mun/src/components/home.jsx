import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Objectives from './Objectives';
import Footer from './footer';
import Contact from './contact';
const home = () => {
  return (
    <div>
      <Navbar />
        <Hero />
        <About />
        <Objectives />
        <Contact />
        <Footer />
    </div>
  )
}

export default home
