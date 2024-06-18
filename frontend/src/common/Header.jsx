import React, {useContext, useState} from 'react';
import spaceImage from '/img/space.png';
import '/public/css/common/Header.css';
import {Button} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {LoginContext, LoginProvider} from "../component/LoginProvider.jsx";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate= useNavigate();
    const account = useContext(LoginContext);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="header">
            <img src={spaceImage} alt="Space Image" className="headerImg"/>
            <span> <p className="headerTitle title1">Space</p></span>
            <span> <p className="headerTitle title2">hub</p></span>

            <header className="header">
                <div className="hamburgerArea" onClick={toggleMenu}>
                    <div className="hamburger">

                        <div className={isOpen ? 'bar open' : 'bar'}></div>
                        <div className={isOpen ? 'bar open' : 'bar'}></div>
                        <div className={isOpen ? 'bar open' : 'bar'}></div>
                    </div>
                </div>
                <nav className={isOpen ? 'menu open' : 'menu'}>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="/member/login">로그인</a></li>
                        <li><a href="/member/signup">회원가입</a></li>
                        <li><a href="/board/list">게시판</a></li>
                        <li><a href="#contact">공간예약</a></li>
                        <li><a href="/space/register">공간등록</a></li>
                        <li><a href="/space/type">공간유형</a></li>
                        <li><a href="/space/option">공간옵션</a></li>
                        <li><a href="/paid/payment">결제상태</a></li>
                        <li>
                            <a href="#home">Home</a>
                        </li>
                        <li>
                            <a href="/member/login">로그인</a>
                        </li>
                        <li>
                            <a href="/member/signup">회원가입</a>
                        </li>
                        <li>
                            <a href="/board/list">게시판</a>
                        </li>
                        <li>
                            <a href="#contact">공간예약</a>
                        </li>
                        <li>
                            <a href="/space/register">공간등록</a>
                        </li>
                        <li>
                            <a href="/space/type">공간유형</a>
                        </li>
                        <li>
                            <a href="/space/option">공간옵션</a>
                        </li>
                        <li>
                            <Button onClick={() => navigate(`/member/info/${account.id}`)} style={{color: 'white', backgroundColor: 'mediumblue'}}>마이페이지
                            </Button>
                        </li>
                        <li>
                            <a href="/member/host" style={{color: 'white', backgroundColor: 'mediumblue'}}>호스트센터로 이동하기
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
        </div>

    )
}
export default Header;