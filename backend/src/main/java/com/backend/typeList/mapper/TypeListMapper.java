package com.backend.typeList.mapper;

import com.backend.dto.ItemListResponseDto;
import com.backend.typeList.domain.TypeList;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TypeListMapper {

    @Insert("""
            INSERT INTO TYPE_LIST (NAME) VALUES (#{name})
            """)
    int insertTypeList(TypeList typeList);


    @Select("""
            SELECT *
            FROM TYPE_LIST
            """)
    List<TypeList> selectAll();

    @Delete("""
            DELETE FROM TYPE_LIST
            WHERE TYPE_LIST_ID = #{typeListId}
            """)
    int deleteByTypeListId(int typeListId);

    @Update("""
            UPDATE TYPE_LIST
            SET NAME = #{name}, ACTIVE = #{active}
            WHERE TYPE_LIST_ID = #{typeListId}
            """)
    int updateTypelist(TypeList typeListId);
}
