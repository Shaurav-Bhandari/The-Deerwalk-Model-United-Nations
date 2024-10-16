import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Objectives from './components/Objectives';
import Footer from './components/footer';
import Contact from './components/contact';

const App = () => {
    return(
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

export default App;