package com.backend.typeList.service.impl;

import com.backend.typeList.domain.TypeList;
import com.backend.typeList.mapper.TypeListMapper;
import com.backend.typeList.service.TypeListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class TypeListServiceImpl implements TypeListService {

    private final TypeListMapper mapper;

    @Override
    public void insertTypeList(List<TypeList> typeLists) {
        for (TypeList typeList : typeLists) {
            mapper.insertTypeList(typeList);
        }
    }

    @Override
    public List<TypeList> list() {
        return mapper.selectAll();
    }

    @Override
    public void deleteSpaceType(int typeListId) {
        mapper.deleteByTypeListId(typeListId);
    }

    @Override
    public void update(TypeList typeList) {
        mapper.update(typeList);
    }

}
