package com.backend.member.mapper;



import com.backend.member.domain.member.Host;
import com.backend.member.domain.member.Member;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {



    @Select("""
            SELECT*
            FROM MEMBER
            WHERE EMAIL = #{email}
            """)
    Member checkByEmail(String email);


    @Select("""
            SELECT*
            FROM MEMBER
            WHERE NICKNAME = #{nickName}
            """)
    Member checkBynickName(String nickName);

    @Select("""
            SELECT  MEMBER_ID,
                    EMAIL,
                    NICKNAME,
                    INPUT_DT,
                    AUTH_NAME
             FROM MEMBER
             ORDER BY MEMBER_ID ASC 
             """)
    List<Member> list();

    @Select("""
            SELECT  MEMBER_ID,
                    EMAIL,
                    NICKNAME,
                    INPUT_DT,
                    PASSWORD
            FROM MEMBER
            WHERE MEMBER_ID = #{memberId}
             """)
    Member selectById(Integer memberId);

    @Update("""
            UPDATE MEMBER
            SET WITHDRAWN='Y'
            WHERE MEMBER_ID = #{memberId}
            """)
    int deleteById(Integer memberId);


    @Select("""
            SELECT *
            FROM MEMBER
            WHERE EMAIL = #{email}
            """)
    Member selectByEmail(String email);


    @Select("""
            SELECT AUTH_NAME
            FROM MEMBER
            WHERE MEMBER_ID = #{memberId}
            """)
    List<String> selectAuthorityByMemberId(Integer memberId);

    @Update("""
            UPDATE MEMBER
             SET
                 PASSWORD = #{password},
                 NICKNAME = #{nickname}
             WHERE MEMBER_ID = #{memberId}
              """)
    int update(Member member);

// 테이블 바꾼 후 다시작성한 sql
    @Insert("""
           INSERT INTO MEMBER (EMAIL, PASSWORD, NICKNAME , AUTH_NAME)
            VALUES (#{email}, #{password}, #{nickname} , 'USER')
            """)
    @Options(useGeneratedKeys = true, keyProperty = "memberId")
    int insert(Member member);

    @Select("""
            SELECT MEMBER_ID
            FROM MEMBER 
            WHERE EMAIL = #{email}
            """)
    int selectByEmail2(Member member);


    @Select("""
            SELECT A.AUTH_NAME
            FROM MEMBER M JOIN AUTH A ON M.MEMBER_ID = A.MEMBER_ID
            WHERE M.MEMBER_ID = #{memberId}
            """)
    List<String> selectByMemberId(Integer memberId);


    @Select("""
        SELECT * 
        FROM MEMBER 
        WHERE email = #{email}
    """)
    Member findByEmail(String email);

    @Insert("""
        INSERT INTO MEMBER (EMAIL, PASSWORD, NICKNAME, NAVER_ID, INPUT_DT, AUTH, MOBILE , PROFILE_IMAGE)
        VALUES (#{email}, #{password}, #{nickname}, #{naverId}, #{inputDt}, #{auth} ,#{mobile} ,#{profileImage})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "memberId")
    void insertMember(Member member);

    @Insert("""
           INSERT INTO MEMBER (EMAIL, PASSWORD, NICKNAME , AUTH_NAME)
            VALUES (#{email}, #{password}, #{nickname} , 'HOST')
            """)
    @Options(useGeneratedKeys = true, keyProperty = "memberId")
    int inserthost(Member member);

    @Update("""
            UPDATE MEMBER
            SET AUTH ='HOST',
                AUTH_NAME ='HOST'
            WHERE MEMBER_ID = #{memberId}
            """)
    void switchHost(Member member);

    @Insert("""
            INSERT INTO HOST (BANK_NAME, ACCOUNT_NUMBER , MEMBER_ID)
            VALUES (#{bankName}, #{accountNumber}, #{memberId})
            """)
    void insertAccount(Host host);




    @Update("""
            UPDATE MEMBER
            SET AUTH ='USER',
                AUTH_NAME ='USER'
            WHERE MEMBER_ID = #{memberId}
            """)
    void switchUser(Member member);

    @Update("""
           UPDATE HOST 
           SET   BUSINESS_NUMBER=#{businessNumber}, 
                 BUSINESS_NAME=#{businessName}, 
                 REP_NAME=#{repName},
                 MEMBER_ID= #{memberId},
                 ACCOUNT_NUMBER= #{accountNumber},
                 BANK_NAME= #{bankName}
           WHERE MEMBER_ID = #{memberId}
           """)
    void addHostInfo(Host host);


    @Select("""
           SELECT NICKNAME
           FROM MEMBER
           WHERE MEMBER_ID = #{memberId}
           """)
    Object getNickNameByMemberId(Member member);

    @Select("""
            SELECT REP_NAME
            FROM HOST
            WHERE MEMBER_ID = #{memberId}
            """)
    Object checkHostRep(Host host);

    @Select("""
            SELECT BUSINESS_NUMBER
            FROM HOST
            WHERE MEMBER_ID = #{memberId}
            """)
    Object checkHostBusinessNumber(Host host);

    @Select("""
           SELECT BUSINESS_NAME
           FROM HOST
           WHERE MEMBER_ID = #{memberId}
           """)
    Object checkHostBusinessName(Host host);

    @Select("""
           SELECT EMAIL
           FROM MEMBER
           WHERE MOBILE=#{mobile}
           """)
    Member emailByMobile(String mobile);


    @Insert("""
            SELECT H.HOST_ID
            FROM MEMBER M JOIN HOST H ON M.MEMBER_ID = H.MEMBER_ID
            WHERE M.MEMBER_ID = #{memberId}
            """)
    int findHostIdByMemberId(int memberId);
}
