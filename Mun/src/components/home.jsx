// import Navbar from './Navbar';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Objectives from './Objectives';
import Footer from './footer';
import Contact from './contact';
const home = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <Header/>
        <Hero />
        <About />
        <Objectives />
        <Contact />
        <Footer />
    </div>
  )
}

export default home
