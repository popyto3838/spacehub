import React, {useContext, useEffect, useState} from 'react';
import spaceImage from '/img/space.png';
import '/public/css/common/Header.css';
import {
    Box,
    Button,
    Text,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Image, Center, useToast,
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {LoginContext, LoginProvider} from "../component/LoginProvider.jsx";
import axios from "axios";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {motion, AnimatePresence} from 'framer-motion';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [member, setMember] = useState({});

    const navigate = useNavigate();
    const account = useContext(LoginContext);
    const toast = useToast();

    const imageUrl = `${member.profileImage}`;
    const MotionMenuList = motion(MenuList);

    const toggleMenu = () => {
        setIsOpen(!isOpen);

    };
    const homeLink = () => {
        navigate("/");

    }

    useEffect(() => {
        if (account.id) {
            axios
                .get(`/api/member/${account.id}`)
                .then((res) => {
                    setMember(res.data);
                })
                .catch(() => {
                    navigate("/member/signup");
                });
        }
    }, [account]);

    function SwitchHost() {
        axios.post("/api/member/nullcheck", {
            memberId: account.id
        })
            .then(res => {
                const data = res.data;
                const {key1, key2, key3} = data;
                console.log(key1, key2, key3);

                if (key1 === null || key2 === null || key3 === null) {
                    navigate(`/member/hostinfo/:accountId`);
                } else {
                    axios.put("/api/member/host", {
                        memberId: account.id,
                    })
                        .then((res) => {

                            account.login(res.data.token);
                            navigate("/space/register");
                        })
                }
            })

    }

    function SwitchUser() {
        axios
            .put("/api/member/user", {memberId: account.id})
            .then((res) => {
                toast({
                    status: "success",
                    description: "유저로 전환되었습니다.",
                    position: "top"
                })

                account.login(res.data.token);
                navigate("/")
            })

    }


    return (
        <div className="header">
            <img src={spaceImage} alt="Space Image" className="headerImg" onClick={homeLink}/>
            <span onClick={homeLink}> <p className="headerTitle title1">Space</p></span>
            <span onClick={homeLink}> <p className="headerTitle title2">hub</p></span>
            <div className="profileArea">
                <Box top={4} right={4}>
                    <Menu>
                        {({isOpen}) => (
                            <>
                                    {account.isLoggedOut() && (
                                        <Center mb={4}>
                                            <Button
                                                onClick={() => navigate(`/host/signup`)}
                                                colorScheme={"purple"}
                                            >
                                                호스트 회원가입 하러 가기
                                            </Button>
                                        </Center>
                                    )}
                                    {account.isUser() && (
                                        <Center mb={4}>
                                            <Button onClick={SwitchHost} colorScheme={"purple"}>
                                                호스트로 전환하기
                                            </Button>
                                        </Center>
                                    )}
                                    {account.isHost() && (
                                        <Center mb={4}>
                                            <Button onClick={SwitchUser} colorScheme={"pink"}>
                                                유저로 전환하기
                                            </Button>
                                        </Center>
                                    )}
                                    <MenuButton as={Box} cursor="pointer">
                                        <Image
                                            src={`${member.profileImage}`}
                                            alt="Profile"
                                            borderRadius="full"
                                            boxSize="40px"
                                            style={{width: '50px',
                                                height: '50px'}}
                                        />
                                    </MenuButton>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <MotionMenuList
                                                initial={{opacity: 0, y: -20}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: -20}}
                                                transition={{duration: 0.1}}
                                                mt={2}
                                                border="none"
                                                boxShadow="md"
                                            >
                                                <MenuItem color="black">
                                                    <Text
                                                        onClick={() => {
                                                            navigate("/board/list")
                                                        }}
                                                        fontSize="sm">공지사항 </Text>
                                                </MenuItem>
                                                <MenuItem color="black">
                                                    <Text fontSize="sm">공간리스트 </Text>
                                                </MenuItem>
                                                <MenuItem color="black">
                                                    <Text fontSize="sm">예약리스트</Text>
                                                </MenuItem>
                                                <MenuItem color="black">
                                                    <Text
                                                        onClick={() => {
                                                            navigate("member/info/:accountId)")
                                                        }}
                                                        fontSize="sm">마이페이지</Text>
                                                </MenuItem>
                                                <MenuItem color="black">
                                                    <Text
                                                        onClick={() => {
                                                            account.logout();
                                                            navigate("/");
                                                        }}
                                                        fontSize="sm">로그아웃</Text>
                                                </MenuItem>
                                            </MotionMenuList>
                                        )}
                                    </AnimatePresence>
                            </>
                        )}
                    </Menu>
                </Box>
            </div>

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
                        <img

                            src={`${member.profileImage}`}
                            // src="/img/profile/1/일본배경.jpg"
                            alt="User Profile Image"
                            style={{
                                width: '70px',
                                height: '60px',
                                borderRadius: '50%', // 원형 모양으로 보이게 하기 위한 스타일
                                objectFit: 'cover', // 이미지가 잘리지 않고 채워지도록 함
                            }}
                        />
                        <li>{account.nickname}</li>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        {account.isLoggedOut() && <li>
                            <a href="/member/login">로그인</a>
                        </li>}
                        {account.isLoggedOut() && <li>
                            <a href="/member/signup">회원가입</a>
                        </li>}
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
                            <a href="/paid/payment">결제상태</a>
                        </li>
                        <li>
                            <a href="/dashboard/host">호스트 페이지</a>
                        </li>
                        <li>
                            <a href="/dashboard/admin">관리자 페이지</a>
                        </li>
                        {account.isLoggedIn() && <li>
                            <Button onClick={() => navigate(`/member/info/${account.id}`)}
                                    style={account.isHost() ? {
                                        color: 'white',
                                        backgroundColor: 'mediumblue'
                                    } : {color: 'white', backgroundColor: 'pink'}}>마이페이지
                            </Button>
                        </li>}
                        {account.isLoggedIn() && <li>
                            <a href="/member/host" style={{color: 'white', backgroundColor: 'mediumblue'}}>호스트센터로
                                이동하기</a>
                        </li>}
                        {account.isLoggedIn() && <li>
                            <Button

                                onClick={() => {
                                    account.logout();
                                    navigate("/");
                                }}
                            >로그아웃</Button>
                        </li>}
                    </ul>
                </nav>
            </header>
        </div>

    )
}
export default Header;