package com.backend.mapper;

import com.backend.domain.OptionList;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OptionListMapper {

    @Insert("""
            INSERT INTO OPTION_LIST (name) VALUES (#{name})
            """)
    int insertOptionList(OptionList optionList);
}
