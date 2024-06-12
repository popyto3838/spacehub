package com.backend.mapper;


import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO member(email, password, nick_name, role)
            VALUES (#{email}, #{password}, #{nickName}, #{role})
            """)
    int add(Member member);


    @Select("""
            SELECT*
            FROM member
            WHERE email = #{email}
            """)
    Member checkByEmail(String email);


    @Select("""
            SELECT*
            FROM member
            WHERE nick_name = #{nickName}
            """)
    Member checkBynickName(String nickName);

    @Select("""
            SELECT id,
                    email,
                    nick_name,
                    inserted,
                    role
             FROM member
             ORDER BY id ASC 
             """)
    List<Member> list();

    @Select("""
            SELECT*
            FROM member
            WHERE id = #{id}
             """)
    Member selectById(int id);

    @Delete("""
            DELETE FROM member
            WHERE id = #{id}
            """)
    int deleteById(Integer id);


    @Select("""
            SELECT *
            FROM member
            WHERE email = #{email}
            """)
    Member selectByEmail(String email);


    @Select("""
            SELECT role
            FROM member
            WHERE id = #{id}
            """)
    String selectAuthorityByMemberId(Integer id);

    @Update("""
            UPDATE member 
             SET
                 password = #{password},
                 nick_name = #{nickName}
             WHERE id = #{id}
              """)
    int update(Member member);
}
