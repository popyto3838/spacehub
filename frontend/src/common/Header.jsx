import React, {useState} from 'react';
import spaceImage from '/img/space.png';
import '/public/css/common/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="header">
            <img src={spaceImage} alt="Space Image" className="headerImg"/>
            <span> <p className="headerTitle title1">Space</p></span>
            <span> <p className="headerTitle title2">hub</p></span>

            <header className="header">
                <div className="hamburger" onClick={toggleMenu}>
                    <div className={isOpen ? 'bar open' : 'bar'}></div>
                    <div className={isOpen ? 'bar open' : 'bar'}></div>
                    <div className={isOpen ? 'bar open' : 'bar'}></div>
                </div>
                <nav className={isOpen ? 'menu open' : 'menu'}>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">로그인</a></li>
                        <li><a href="#services">공간등록</a></li>
                        <li><a href="#contact">공간예약</a></li>
                    </ul>
                </nav>
            </header>
        </div>

    )
}
export default Header;