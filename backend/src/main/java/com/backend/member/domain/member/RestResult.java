package com.backend.member.domain.member;


public class RestResult {
    private String status;
    private String errorCode;
    private Object data;

    // Getters and Setters

    public RestResult setStatus(String status) {
        this.status = status;
        return this;
    }

    public RestResult setErrorCode(String errorCode) {
        this.errorCode = errorCode;
        return this;
    }

    public RestResult setData(Object data) {
        this.data = data;
        return this;
    }

    // ToString, Equals, HashCode 등 필요한 메서드 추가
}