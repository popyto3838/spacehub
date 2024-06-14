package com.backend.member.mapper;



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


//    @Select("""
//            SELECT  A.WITHDRAWN
//
//             FROM MEMBER M JOIN AUTH A ON M.MEMBER_ID = A.MEMBER_ID
//            WHERE M.MEMBER_ID = #{memberId}
//            """)
//   List<Auth> selectByEmail2(Integer memberId);

    @Select("""
            SELECT MEMBER_ID
            FROM MEMBER 
            WHERE EMAIL = #{email}
            """)
    Member selectByEmail3(String email);


    @Select("""
            SELECT A.AUTH_NAME
            FROM MEMBER M JOIN AUTH A ON M.MEMBER_ID = A.MEMBER_ID
            WHERE M.MEMBER_ID = #{memberId}
            """)
    List<String> selectByMemberId(Integer memberId);

//    @Insert("""
//INSERT INTO AUTH (AUTH_NAME)
//VALUES (#{auth_name})
//""")
//    int insert(Auth auth);
}
