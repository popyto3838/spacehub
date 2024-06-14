package com.backend.member.domain.member;

public class ErrorCode {
    public static class rest {
        public static final String DUPLICATE_DATA = "ERR_DUPLICATE_DATA";
        public static final String INVALID_TOKEN = "ERR_INVALID_TOKEN";
        public static final String USER_NOT_FOUND = "ERR_USER_NOT_FOUND";
        // 필요에 따라 더 많은 에러 코드를 추가할 수 있습니다.
    }
}