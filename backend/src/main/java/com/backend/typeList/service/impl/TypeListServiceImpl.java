package com.backend.typeList.service.impl;

import com.backend.dto.TypeListResponseDto;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.typeList.domain.TypeList;
import com.backend.typeList.mapper.TypeListMapper;
import com.backend.typeList.service.TypeListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class TypeListServiceImpl implements TypeListService {

    private final TypeListMapper typeListMapper;
    private final FileMapper fileMapper;

    @Override
    public void insertTypeList(List<TypeList> typeLists) {
        for (TypeList typeList : typeLists) {
            typeListMapper.insertTypeList(typeList);
        }
    }

    @Override
    public List<TypeListResponseDto> selectAll() {
        List<TypeList> typeLists = typeListMapper.selectAll();

        return typeLists.stream().map(typeList -> {
            TypeListResponseDto dto = new TypeListResponseDto();
            dto.setTypeListId(typeList.getTypeListId());
            dto.setName(typeList.getName());
            dto.setActive(typeList.isActive());

            File iconFile = fileMapper.selectFileByParentIdAndDivision(typeList.getTypeListId(), "TYPE");
            dto.setIconFile(iconFile);

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteSpaceType(int typeListId) {
        typeListMapper.deleteByTypeListId(typeListId);
    }

    @Override
    public void update(TypeList typeList) {
        typeListMapper.update(typeList);
    }

}
