import Header from "./common/Header.jsx";
import Content from "./common/Content.jsx";
import '../public/css/App.css';
import Footer from "./common/Footer.jsx";

function App() {
    return (
        <div>
            <div className="app">
                <Header/>
                <Content/>
                <Footer/>
            </div>
        </div>
    )
}

export default App
