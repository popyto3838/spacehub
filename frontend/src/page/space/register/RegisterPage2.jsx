import React, {useEffect, useState} from "react";
import {Box, FormControl, FormLabel, Heading, Input} from "@chakra-ui/react";
import AddressSearch from "../../../component/AddressSearch.jsx";
import KakaoMap from "../../../component/KakaoMap.jsx";

const RegisterPage2 = ({formData, setFormData}) => {
    const [addressInfo, setAddressInfo] = useState({
        zonecode: formData?.zonecode || '',
        address: formData?.address || '',
        detailAddress: formData?.detailAddress || '',
        extraAddress: formData?.extraAddress || '',
        latitude: formData?.latitude || '',
        longitude: formData?.longitude || '',
    });

    const handleAddressChange = (newAddress) => {
        setAddressInfo(newAddress);
        setFormData({
            ...formData,
            ...newAddress,
            location: newAddress.address + (newAddress.extraAddress || ''), // location 필드 업데이트
        });
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        const updatedAddress = {
            ...addressInfo,
            [name]: value,
        };

        setAddressInfo(updatedAddress);
        setFormData({...formData, ...updatedAddress});
    };

    useEffect(() => {
        if (addressInfo.address) {
            const fullAddress = addressInfo.address + (addressInfo.extraAddress || '');
            window.dispatchEvent(new CustomEvent('updateMap', {detail: fullAddress}));
        }
    }, [addressInfo]);

    return (
        <Box>
            <Heading>등록 공간 주소</Heading>
            <FormControl mb={4}>
                <FormLabel htmlFor="postcode">우편번호</FormLabel>
                <Input
                    id="postcode"
                    name="postcode"
                    placeholder="우편번호"
                    value={addressInfo.zonecode}
                    onChange={handleInputChange}
                />
                <AddressSearch onAddressChange={handleAddressChange}/>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel htmlFor="address">주소</FormLabel>
                <Input
                    id="address"
                    name="address"
                    placeholder="주소"
                    value={addressInfo.address}
                    onChange={handleInputChange}/>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel htmlFor="detailAddress">상세주소</FormLabel>
                <Input
                    id="detailAddress"
                    name="detailAddress"
                    placeholder="상세주소"
                    value={addressInfo.detailAddress}
                    onChange={handleInputChange}
                />
            </FormControl>
            <FormControl mb={4}>
                <FormLabel htmlFor="extraAddress">참고항목</FormLabel>
                <Input
                    id="extraAddress"
                    name="extraAddress"
                    placeholder="참고항목"
                    value={addressInfo.extraAddress}
                />
            </FormControl>
            <KakaoMap
                address={addressInfo.address + (addressInfo.extraAddress || '')}
                latitude={addressInfo.latitude}
                longitude={addressInfo.longitude}
            />
        </Box>
    );
};

export default RegisterPage2;
