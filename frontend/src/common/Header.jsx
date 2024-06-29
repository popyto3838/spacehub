import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Flex, Image, Text, Button, Menu, MenuButton, MenuList, MenuItem,
  useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,
  useToast, VStack, IconButton, Divider, Avatar
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
        const { key1, key2, key3 } = data;
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
      .put("/api/member/user", { memberId: account.id })
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
        bg="black"
        color="white"
        height="12vh"
      >
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="outline"
          color="yellow.400"
          aria-label="Open Menu"
          fontSize="1.5rem"
          _hover={{ bg: "yellow.400", color: "black" }}
        />

        <Flex align="center" justify="center" flex={1}>
          <Image src={spaceImage} alt="Space Image" height="8vh" mr={2} onClick={() => navigate("/")} cursor="pointer" />
          <Text
            fontFamily="TTLaundryGothicB"
            fontSize="1.5rem"
            fontWeight="bold"
            onClick={() => navigate("/")}
            cursor="pointer"
          >
            Space<Text as="span" color="yellow.400">hub</Text>
          </Text>
        </Flex>

        <Flex align="center">
          {account.isLoggedOut() && (
            <Button colorScheme="yellow" variant="outline" mr={4} onClick={() => navigate(`/host/signup`)}>
              호스트 회원가입
            </Button>
          )}
          {account.isUser() && (
            <Button colorScheme="yellow" variant="outline" mr={4} onClick={SwitchHost}>
              호스트로 전환
            </Button>
          )}
          {account.isHost() && (
            <Button colorScheme="yellow" variant="outline" mr={4} onClick={SwitchUser}>
              유저로 전환
            </Button>
          )}
          <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
              <Avatar
                src={`${member.profileImage}?t=${timestamp}`}
                alt="Profile"
                size="sm"
              />
            </MenuButton>
            <MenuList bg="white" borderColor="yellow.400">
              <MenuItem icon={<FontAwesomeIcon icon={faList} />} onClick={() => navigate("/board/list")}>공지사항</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faMapMarkerAlt} />} onClick={() => navigate(`member/hostSpaceList/${account.id}`)}>나의 공간리스트</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faStar} />} onClick={() => navigate(`member/myFavoritesList`)}>즐겨찾기</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faCalendarAlt} />} onClick={() => navigate(`member/myReservationList/${account.id}`)}>예약리스트</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faDollarSign} />} onClick={() => navigate(`paid/myPaymentList`)}>결제내역</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faUser} />} onClick={() => navigate(`member/info/${account.id}`)}>마이페이지</MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faSignOutAlt} />} onClick={() => { account.logout(); navigate("/"); }}>로그아웃</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="gray.900">
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
            <Flex justify="space-between" align="center">
              <Text color="white" fontWeight="bold">메뉴</Text>
              <IconButton
                icon={<CloseIcon />}
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
              <Divider borderColor="gray.700" />
              <Button leftIcon={<FontAwesomeIcon icon={faHome} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/")} color="white">홈</Button>
              {account.isLoggedOut() && (
                <>
                  <Button leftIcon={<FontAwesomeIcon icon={faSignInAlt} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/member/login")} color="white">로그인</Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faUserPlus} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/member/signup")} color="white">회원가입</Button>
                </>
              )}
              <Button leftIcon={<FontAwesomeIcon icon={faList} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/board/list")} color="white">게시판</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faMapMarkerAlt} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/space/register")} color="white">공간등록</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faCog} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/space/type")} color="white">공간유형</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faCog} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/space/option")} color="white">공간옵션</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faDollarSign} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/paid/payment")} color="white">결제상태</Button>
              <Button leftIcon={<FontAwesomeIcon icon={faChartBar} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/dashboard/admin")} color="white">관리자 페이지</Button>
              {account.isLoggedIn() && (
                <>
                  <Divider borderColor="gray.700" />
                  <Button leftIcon={<FontAwesomeIcon icon={faUser} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick(`/member/info/${account.id}`)} color="white">마이페이지</Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faExchangeAlt} />} variant="ghost" justifyContent="flex-start" onClick={() => handleMenuClick("/host/dashboard")} color="white">호스트센터</Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faSignOutAlt} />} variant="ghost" justifyContent="flex-start" onClick={() => { account.logout(); handleMenuClick("/"); }} color="white">로그아웃</Button>
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
