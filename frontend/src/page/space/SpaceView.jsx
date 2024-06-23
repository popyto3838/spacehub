import React, {useState} from 'react';
import '/public/css/space/SpaceView.css';
import DatePicker from "../../component/DatePicker.jsx";
import {useEffect} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {useToast} from "@chakra-ui/react";
import {Link} from 'react-scroll';
import KakaoMap from "../../component/KakaoMap.jsx";
import ImageSlider from "../../component/ImageSlider.jsx";


function SpaceView() {
    const [space, setSpace] = useState({});
    const {spaceId} = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('공간소개');
    const [sticky, setSticky] = useState(false);


    const sections = [
        {id: 'introduceArea', name: '공간소개'},
        {id: 'facilityArea', name: '시설안내'},
        {id: 'noticeArea', name: '유의사항'},
        {id: 'QA', name: 'Q&A'},
        {id: 'comment', name: '이용후기'}
    ];

    useEffect(() => {


        axios
            .get(`/api/space/${spaceId}`)
            .then((res) => {
                setSpace(res.data)
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    toast({
                        status: "error",
                        description: "잘못된 페이지 요청입니다.",
                        position: "top",
                    });
                    navigate("/");
                }
            });

        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 1230) {  // 100px 이상 스크롤되면 sticky 적용
                setSticky(true);
            } else {
                setSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const images = [
        '/public/img/에도시대시부야.jpg',
        '/public/img/에도시대미녀.jpg',
        '/public/img/bg1.jpg',
        '/public/img/공간대여 사진.jpg',
        '/public/img/space.png',
        '/public/img/일본배경.jpg',
    ];

    return (
        <div>
            <div className="titleArea">
                <p className="title">{space.title}</p>
                <p className="subTitle">{space.subTitle}</p>

            </div>
            <div className="parentArea">
                <div className="spaceViewArea">
                    <div className="imgArea">
                        <ImageSlider images={images}></ImageSlider>
                    </div>
                    <div className="introduceArea">

                        <nav style={{
                            display: 'flex',
                            margin: '0 auto',
                            padding: 0,
                            width: '100%',
                            maxWidth: '1800px',
                            position: sticky ? 'fixed' : 'static',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                        }}>
                            {sections.map((section) => (
                                <Link
                                    key={section.id}
                                    to={section.id}
                                    spy={true}
                                    smooth={true}
                                    offset={-70}  // 네비게이션 바의 높이만큼 오프셋 설정
                                    duration={500}
                                    style={{
                                        padding: '10px 15px',
                                        margin: '0 2px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: activeSection === section.name ? '#463383' : '#6c5ce7',
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontSize: '1rem',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={() => setActiveSection(section.name)}
                                    className="linkSelect"
                                >
                                    {section.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="sectionArea">
                            <section id="introduceArea">
                                <h2>공간소개</h2>
                                <p className="introduce">{space.introduce}</p>
                            </section>

                            <section id="facilityArea">
                                <h2>시설안내</h2>
                                <p className="facility">{space.facility}</p>
                                <p className="address">주소 : {space.address} {space.detailAddress}</p>
                                {/* 시설안내 내용 */}
                            </section>

                            <section id="noticeArea">
                                <h2>유의사항</h2>
                                <p className="notice">
                                    {space.notice}
                                </p>
                            </section>

                            <section id="QA">
                                <h2>Q&A</h2>
                                {/* Q&A 내용 */}
                            </section>

                            <section id="comment">
                                <h2>이용후기</h2>
                                {/* 이용후기 내용 */}
                            </section>
                        </div>
                    </div>
                </div>
                <div className="reservationArea">
                    <DatePicker price={space.price} spaceId={spaceId}></DatePicker>
                    <KakaoMap latitude={space.latitude} longitude={space.longitude}></KakaoMap>
                </div>
            </div>

        </div>
    )
        ;
}

export default SpaceView;