import React, {useContext, useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import {CloseIcon, HamburgerIcon} from '@chakra-ui/icons';
import {useNavigate} from "react-router-dom";
import {LoginContext} from "../component/LoginProvider.jsx";
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faChartBar,
  faCog,
  faDollarSign,
  faExchangeAlt,
  faHome,
  faList,
  faMapMarkerAlt,
  faSignInAlt,
  faSignOutAlt,
  faStar,
  faUser,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import spaceImage from '/img/space.png';

const Header = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [member, setMember] = useState({});
  const [timestamp, setTimestamp] = useState(Date.now());

  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const toast = useToast();

  useEffect(() => {
    if (account.id) {
      axios.get(`/api/member/${account.id}`)
        .then((res) => {
          setMember(res.data);
        })
        .catch(() => {
          navigate("/member/signup");
        });
    }
  }, [account, navigate]);

  const updateImage = () => setTimestamp(Date.now());

  function SwitchHost() {
    axios.post("/api/member/nullcheck", {
      memberId: account.id
    })
      .then(res => {
        const data = res.data;
        const {key1, key2, key3} = data;
        if (key1 === null || key2 === null || key3 === null) {
          navigate(`/member/hostinfo/:accountId`);
        } else {
          axios.put("/api/member/host", {
            memberId: account.id,
          })
            .then((res) => {
              account.login(res.data.token);
              navigate("/host/dashboard");
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

  const handleMenuClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Box>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="0.5rem 0.5rem"
        bg="black"
        color="white"
        height="12vh"
      >
        <Box width="33%">
          <IconButton
            icon={<HamburgerIcon/>}
            onClick={onOpen}
            variant="outline"
            color="whitesmoke"
            aria-label="Open Menu"
            fontSize="2rem"
            h="5vh"
            w="5vh"
            _hover={{bg: "yellow.400", color: "black"}}
            ml={8}
          />
        </Box>

        <Flex align="center" justify="center" width="33%">
          <Image
            src={spaceImage}
            alt="Space Image"
            height="12vh"
            mr={3}
            onClick={() => navigate("/")}
            cursor="pointer"
          />
          <Text
            fontFamily="TTLaundryGothicB"
            fontSize="2.75rem"
            fontWeight="bold"
            onClick={() => navigate("/")}
            cursor="pointer"
            lineHeight="12vh"
          >
            Space<Text as="span" color="yellow.400">Hub</Text>
          </Text>
        </Flex>

        <Flex align="center" justify="flex-end" width="33%">
          {account.isLoggedOut() && (
            <Button
              colorScheme="yellow"
              variant="outline"
              mr={4}
              onClick={() => navigate(`/host/signup`)}
              fontSize="lg"
              h="4vh"
            >
              호스트 회원가입
            </Button>
          )}
          {account.isUser() && (
            <Button
              colorScheme="yellow"
              variant="outline"
              mr={4}
              onClick={SwitchHost}
              fontSize="lg"
              h="4vh"
            >
              호스트로 전환
            </Button>
          )}
          {account.isHost() && (
            <Button
              colorScheme="yellow"
              variant="outline"
              mr={4}
              onClick={SwitchUser}
              fontSize="lg"
              h="4vh"
            >
              유저로 전환
            </Button>
          )}
          <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
              <Avatar
                src={`${member.profileImage}?t=${timestamp}`}
                alt="Profile"
                size="lg"
                h="6vh"
                w="6vh"
                mr={6}
                showBorder="true"
                borderColor="white"
              />
            </MenuButton>
            <MenuList borderColor="gray.800">
              <MenuItem
                color="gray.800"
                _hover={{bg: "gray.700", color: "yellow.400"}}
                icon={<FontAwesomeIcon icon={faList}/>}
                onClick={() => navigate("/board/list")}>
                공지사항
              </MenuItem>
              <MenuItem
                color="gray.800"
                _hover={{bg: "gray.700", color: "yellow.400"}}
                icon={<FontAwesomeIcon icon={faMapMarkerAlt}/>}
                onClick={() => navigate(`member/hostSpaceList/${account.id}`)}>
                나의 공간리스트
              </MenuItem>
              <MenuItem
                color="gray.800"
                _hover={{bg: "gray.700", color: "yellow.400"}}
                icon={<FontAwesomeIcon icon={faStar}/>}
                onClick={() => navigate(`member/myFavoritesList`)}>
                즐겨찾기
              </MenuItem>
              <MenuItem
                color="gray.800"
                _hover={{bg: "gray.700", color: "yellow.400"}}
                icon={<FontAwesomeIcon icon={faCalendarAlt}/>}
                onClick={() => navigate(`member/myReservationList/${account.id}`)}>
                예약리스트
              </MenuItem>
              <MenuItem
                color="gray.800"
                _hover={{bg: "gray.700", color: "yellow.400"}}
                icon={<FontAwesomeIcon icon={faDollarSign}/>}
                onClick={() => navigate(`paid/myPaymentList`)}>
                결제내역
              </MenuItem>
              <MenuItem
                color="gray.800"
                _hover={{bg: "gray.700", color: "yellow.400"}}
                icon={<FontAwesomeIcon icon={faUser}/>}
                onClick={() => navigate(`member/info/${account.id}`)}>
                마이페이지
              </MenuItem>
              <MenuItem
                color="gray.800"
                _hover={{bg: "gray.700", color: "yellow.400"}}
                icon={<FontAwesomeIcon icon={faSignOutAlt}/>}
                onClick={() => {
                  account.logout();
                  navigate("/");
                }}>로그아웃
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent bg="gray.900">
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
            <Flex justify="space-between" align="center">
              <Text color="white" fontWeight="bold">메뉴</Text>
              <IconButton
                icon={<CloseIcon/>}
                onClick={onClose}
                variant="ghost"
                color="white"
                aria-label="Close Menu"
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch">
              {account.isLoggedIn() && (
                <Box py={4} bg="gray.800" borderRadius="md" textAlign="center">
                  <Avatar
                    src={`${member.profileImage}?t=${timestamp}`}
                    alt="Profile"
                    size="xl"
                  />
                  <Text fontWeight="bold" fontSize="xl" color="white" mt={2}>{account.nickname}</Text>
                </Box>
              )}
              <Divider borderColor="gray.700"/>
              <Button
                leftIcon={<FontAwesomeIcon icon={faHome}/>}
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => handleMenuClick("/")}
                color="white"
                _hover={{bg: "gray.700", color: "yellow.400"}}
              >
                홈
              </Button>
              {account.isLoggedOut() && (
                <>
                  <Button leftIcon={<FontAwesomeIcon icon={faSignInAlt}/>} variant="ghost" justifyContent="flex-start"
                          _hover={{bg: "gray.700", color: "yellow.400"}}
                          onClick={() => handleMenuClick("/member/login")} color="white">로그인</Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faUserPlus}/>} variant="ghost" justifyContent="flex-start"
                          _hover={{bg: "gray.700", color: "yellow.400"}}
                          onClick={() => handleMenuClick("/member/signup")} color="white">회원가입</Button>
                </>
              )}
              <Button leftIcon={<FontAwesomeIcon icon={faList}/>} variant="ghost" justifyContent="flex-start"
                      _hover={{bg: "gray.700", color: "yellow.400"}}
                      onClick={() => handleMenuClick("/board/list")} color="white">게시판</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faMapMarkerAlt}/>} variant="ghost" justifyContent="flex-start"
                      _hover={{bg: "gray.700", color: "yellow.400"}}
                      onClick={() => handleMenuClick("/space/register")} color="white">공간등록</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faCog}/>} variant="ghost" justifyContent="flex-start"
                      _hover={{bg: "gray.700", color: "yellow.400"}}
                      onClick={() => handleMenuClick("/space/type")} color="white">공간유형</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faCog}/>} variant="ghost" justifyContent="flex-start"
                      _hover={{bg: "gray.700", color: "yellow.400"}}
                      onClick={() => handleMenuClick("/space/option")} color="white">공간옵션</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faDollarSign}/>} variant="ghost" justifyContent="flex-start"
                      _hover={{bg: "gray.700", color: "yellow.400"}}
                      onClick={() => handleMenuClick("/paid/payment")} color="white">결제상태</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faChartBar}/>} variant="ghost" justifyContent="flex-start"
                      _hover={{bg: "gray.700", color: "yellow.400"}}
                      onClick={() => handleMenuClick("/dashboard/admin")} color="white">관리자 페이지</Button>
              {account.isLoggedIn() && (
                <>
                  <Divider borderColor="gray.700"/>
                  <Button leftIcon={<FontAwesomeIcon icon={faUser}/>} variant="ghost" justifyContent="flex-start"
                          _hover={{bg: "gray.700", color: "yellow.400"}} color="white"
                          onClick={() => handleMenuClick(`/member/info/${account.id}`)}>마이페이지</Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faExchangeAlt}/>} variant="ghost" justifyContent="flex-start"
                          _hover={{bg: "gray.700", color: "yellow.400"}}
                          onClick={() => handleMenuClick("/host/dashboard")} color="white">호스트센터</Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faSignOutAlt}/>} variant="ghost" justifyContent="flex-start"
                          _hover={{bg: "gray.700", color: "yellow.400"}} color="white"
                          onClick={() => {
                            account.logout();
                            handleMenuClick("/");
                          }}
                  >
                    로그아웃
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
