package com.backend.typeList.mapper;

import com.backend.typeList.domain.TypeList;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TypeListMapper {

    @Insert("""
            INSERT INTO TYPE_LIST (name) VALUES (#{name})
            """)
    int insertTypeList(TypeList typeList);


    @Select("""
            SELECT *
            FROM TYPE_LIST
            ORDER BY TYPE_LIST_ID DESC 
            """)
    List<TypeList> selectAll();

    @Delete("""
            DELETE FROM TYPE_LIST
            WHERE TYPE_LIST_ID = #{typeListId}
            """)
    int deleteByTypeListId(int typeListId);

    @Update("""
            UPDATE TYPE_LIST
            SET IS_ACTIVE = #{isActive}
            WHERE TYPE_LIST_ID = #{typeListId}
            """)
    int update(TypeList typeListId);
}
