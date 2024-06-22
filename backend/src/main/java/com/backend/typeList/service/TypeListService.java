package com.backend.typeList.service;

import com.backend.dto.TypeListResponseDto;
import com.backend.typeList.domain.TypeList;

import java.util.List;

public interface TypeListService {

    void insertTypeList(List<TypeList> typeLists);


    List<TypeListResponseDto> selectAll();

    void deleteSpaceType(int typeListId);

    void update(TypeList typeList);
}
