import axios from 'axios';
import { Button, useToast } from "@chakra-ui/react";
import '/public/css/paid/Payment.css';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

const Payment = () => {
    const toast = useToast();
    const account = useContext(LoginContext);
    const navigate = useNavigate();
    const [reservationStatus, setReservationStatus] = useState('');
    const [spaceIdResult, setSpaceId] = useState('');
    const { reservationId } = useParams();
    const [totalPrice, setTotalPrice] = useState(0);
    const [member,setMember] = useState(null);

    useEffect(() => {
        axios.get("/api/reservation/" + reservationId)
            .then((res) => {
                setReservationStatus(res.data.status);
                setSpaceId(res.data.spaceId);
                setTotalPrice(res.data.totalPrice); // 총 금액 설정
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => { }, [spaceIdResult]);

    useEffect(() => {
        const jquery = document.createElement("script");
        jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        return () => {
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
        };
    }, []);

    useEffect(() => {
        axios.get("/api/member/" + account.id)
            .then((res) => {
                setMember(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account.id]);

    useEffect(() => {
    }, [member]);
    const requestPay = () => {
        if (reservationStatus !== 'ACCEPT') {
            toast({
                status: "warning",
                description: "예약이 승인되지 않아 결제할 수 없습니다.",
                position: "top",
                duration: 1000,
            });
            return;
        }

        const { IMP } = window;
        IMP.init('imp61364323');
        IMP.request_pay({
            pg: 'html5_inicis.INIpayTest',
            pay_method: 'card',
            merchant_uid: new Date().getTime(),
            name: '원용님 결제 전용',
            // amount: totalPrice, // 총 금액 사용
            amount: 100, // 총 금액 사용
            buyer_email: member.email,
            buyer_name: member.nickname,
        }, async (rsp) => {
            console.log(rsp);
            if (rsp.success == true) {
                axios
                    .post("/api/paid/write", {
                        "spaceId": spaceIdResult,
                        "reservationId": reservationId,
                        "memberId": account.id,
                        "totalPrice": totalPrice // 총 금액 사용
                    })
                    .then((res) => {
                        toast({
                            status: "success",
                            description: "결제가 완료되었습니다.",
                            position: "top",
                            duration: 1000,
                        });
                        navigate("/paid/myPaymentList")
                    })
                    .catch((err) => {
                        toast({
                            status: "error",
                            description: "결제를 실패하였습니다.",
                            position: "top",
                            duration: 1000,
                        });
                    });

            } else {
                alert("결제 실패");
            }
        });
    };

    return (
        <div>

            <div className="titleArea">
                <p className="title">결제 상태 페이지</p>
            </div>
            <div className="titleArea">
                <p className="title">회원 고유번호 : {account.id}</p>

            </div>

            <div className="paidArea">

                <Button
                    colorScheme='blue'
                    className="paidButton"
                    onClick={requestPay}
                    isDisabled={reservationStatus !== 'ACCEPT'}
                >
                    결제하기
                </Button>
            </div>

            <div className="paidArea">
                {reservationStatus === 'COMPLETE_PAYMENT' ? (
                    <p className="statusComplete">결제가 완료되었습니다.</p>
                ) : reservationStatus !== 'ACCEPT' ? (
                    <p className="statusAccept">호스트가 결제를 수락하지 않았습니다.</p>
                ) : null}
            </div>
        </div>
    );
};

export default Payment;
