import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Flex, Image, Text, Button, Menu, MenuButton, MenuList, MenuItem,
  useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,
  useToast, VStack, HStack, IconButton, Divider, useColorModeValue
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faSignInAlt, faUserPlus, faCog, faList, faMapMarkerAlt,
  faDollarSign, faChartBar, faUser, faSignOutAlt, faExchangeAlt, faStar, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import spaceImage from '/img/space.png';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [member, setMember] = useState({});
  const [timestamp, setTimestamp] = useState(Date.now());

  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const toast = useToast();

  const bgColor = useColorModeValue("black", "gray.900");
  const textColor = useColorModeValue("white", "gray.100");
  const accentColor = useColorModeValue("yellow.400", "yellow.200");
  const drawerBgColor = useColorModeValue("white", "gray.800");
  const drawerTextColor = useColorModeValue("black", "white");

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
        console.log(key1, key2, key3);

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
        padding="1rem"
        bg={bgColor}
        color={textColor}
        height="12vh"
        boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      >
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="outline"
          color={accentColor}
          aria-label="Open Menu"
          _hover={{ bg: 'rgba(255,255,255,0.1)' }}
        />

        <Flex align="center" justify="center" flex={1}>
          <Image
            src={spaceImage}
            alt="Space Image"
            height="8vh"
            mr={2}
            onClick={() => navigate("/")}
            cursor="pointer"
            transition="transform 0.3s"
            _hover={{ transform: 'scale(1.05)' }}
          />
          <Text
            fontFamily="TTLaundryGothicB"
            fontSize="1.8rem"
            fontWeight="bold"
            onClick={() => navigate("/")}
            cursor="pointer"
            transition="color 0.3s"
            _hover={{ color: accentColor }}
          >
            Space<Text as="span" color={accentColor}>hub</Text>
          </Text>
        </Flex>

        <Flex align="center">
          {account.isLoggedOut() && (
            <Button
              colorScheme="yellow"
              variant="solid"
              mr={4}
              onClick={() => navigate(`/host/signup`)}
            >
              호스트 회원가입
            </Button>
          )}
          {account.isUser() && (
            <Button
              colorScheme="yellow"
              variant="solid"
              mr={4}
              onClick={SwitchHost}
            >
              호스트로 전환
            </Button>
          )}
          {account.isHost() && (
            <Button
              colorScheme="yellow"
              variant="solid"
              mr={4}
              onClick={SwitchUser}
            >
              유저로 전환
            </Button>
          )}
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Image
                src={`${member.profileImage}?t=${timestamp}`}
                alt="Profile"
                borderRadius="full"
                boxSize="40px"
                border="2px solid"
                borderColor={accentColor}
              />
            </MenuButton>
            <MenuList bg={drawerBgColor} borderColor={accentColor} boxShadow="xl">
              <MenuItem icon={<FontAwesomeIcon icon={faList} />} onClick={() => navigate("/board/list")} _hover={{ bg: accentColor }}>공지사항</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faMapMarkerAlt} />} onClick={() => navigate(`member/hostSpaceList/${account.id}`)} _hover={{ bg: accentColor }}>나의 공간리스트</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faStar} />} onClick={() => navigate(`member/myFavoritesList`)} _hover={{ bg: accentColor }}>즐겨찾기</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faCalendarAlt} />} onClick={() => navigate(`member/myReservationList/${account.id}`)} _hover={{ bg: accentColor }}>예약리스트</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faDollarSign} />} onClick={() => navigate(`paid/myPaymentList`)} _hover={{ bg: accentColor }}>결제내역</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faUser} />} onClick={() => navigate(`member/info/${account.id}`)} _hover={{ bg: accentColor }}>마이페이지</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faSignOutAlt} />} onClick={() => { account.logout(); navigate("/"); }} _hover={{ bg: accentColor }}>로그아웃</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={drawerBgColor}>
          <DrawerHeader borderBottomWidth="1px" borderColor={accentColor}>
            <Flex justify="space-between" align="center">
              <Text color={drawerTextColor} fontWeight="bold" fontSize="xl">메뉴</Text>
              <IconButton
                icon={<CloseIcon />}
                onClick={onClose}
                variant="ghost"
                color={drawerTextColor}
                aria-label="Close Menu"
                _hover={{ bg: accentColor }}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch">
              {account.isLoggedIn() && (
                <Box py={6} bg={useColorModeValue("gray.100", "gray.700")} borderRadius="md" boxShadow="md">
                  <VStack>
                    <Image
                      src={`${member.profileImage}?t=${timestamp}`}
                      alt="Profile"
                      borderRadius="full"
                      boxSize="120px"
                      border="3px solid"
                      borderColor={accentColor}
                    />
                    <Text fontWeight="bold" fontSize="2xl" color={drawerTextColor}>{account.nickname}</Text>
                  </VStack>
                </Box>
              )}
              <Divider borderColor={accentColor} />
              <Button leftIcon={<FontAwesomeIcon icon={faHome} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>홈</Button>
              {account.isLoggedOut() && (
                <>
                  <Button leftIcon={<FontAwesomeIcon icon={faSignInAlt} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/member/login")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>로그인</Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faUserPlus} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/member/signup")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>회원가입</Button>
                </>
              )}
              <Button leftIcon={<FontAwesomeIcon icon={faList} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/board/list")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>게시판</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faMapMarkerAlt} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/space/register")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>공간등록</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faCog} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/space/type")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>공간유형</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faCog} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/space/option")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>공간옵션</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faDollarSign} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/paid/payment")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>결제상태</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faChartBar} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/dashboard/admin")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>관리자 페이지</Button>
              {account.isLoggedIn() && (
                <>
                  <Divider borderColor={accentColor} />
                  <Button leftIcon={<FontAwesomeIcon icon={faUser} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick(`/member/info/${account.id}`)} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>마이페이지</Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faExchangeAlt} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/host/dashboard")} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>호스트센터</Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faSignOutAlt} />} variant="ghost" justifyContent="flex-start" onClick={() => { account.logout(); handleMenuClick("/"); }} color={drawerTextColor} _hover={{ bg: accentColor }} fontSize="lg" py={6}>로그아웃</Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
export default Header;