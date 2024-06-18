import React, { useEffect } from 'react';
import axios from 'axios';
import {Button} from "@chakra-ui/react";
import '/public/css/paid/Payment.css';


const Payment = () => {
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

    const requestPay = () => {
        const { IMP } = window;
        IMP.init('imp61364323');

        IMP.request_pay({
            pg: 'tosspay.tosstest',
            pay_method: 'card',
            merchant_uid: new Date().getTime(),
            name: '테스트 상품',
            amount: 100,
            buyer_email: 'dlehddud60@naver.com',
            buyer_name: '이동영',
            buyer_tel: '010-3275-5687',
            buyer_addr: '서울특별시',
            buyer_postcode: '123-456',
        }, async (rsp) => {
            console.log("==========================================")
            console.log("==========================================",rsp)
            try {
                const { data } = await axios.post('http://localhost:8080/api/payment/verifyIamport/' + rsp.imp_uid);

                console.log("============================",data)
                if (rsp.paid_amount === data.response.amount) {
                    alert('결제 성공');
                } else {
                    alert('결제 실패');
                }
            } catch (error) {
                console.error('Error while verifying payment:', error);
                alert('결제 실패');
            }
        });
    };

    return (
        <div>

            <div className="titleArea">
                <p className="title">결제 상태 페이지</p>
            </div>
            <div className="paidArea">
                <Button colorScheme='blue' className="paidButton" onClick={requestPay}>결제하기</Button>
            </div>
        </div>
    );
};

export default Payment;