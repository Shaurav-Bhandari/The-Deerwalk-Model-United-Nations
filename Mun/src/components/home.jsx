import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Objectives from './Objectives';
import Footer from './footer';
import Contact from './contact';
import Register from './register';
const home = () => {
  return (
    <div>
      <Navbar />
        <Hero />
        <About />
        <Objectives />
        <Contact />
        <Register />
        <Footer />
    </div>
  )
}

export default home
