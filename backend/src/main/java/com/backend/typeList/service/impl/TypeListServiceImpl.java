package com.backend.typeList.service.impl;

import com.backend.dto.ItemListResponseDto;
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
    public List<ItemListResponseDto> selectAll() {
        List<TypeList> typeLists = typeListMapper.selectAll();

        return typeLists.stream().map(typeList -> {
            ItemListResponseDto dto = new ItemListResponseDto();
            dto.setItemId(typeList.getTypeListId());
            dto.setName(typeList.getName());
            dto.setActive(typeList.isActive());

            List<File> iconFiles = fileMapper.selectFileByDivisionAndParentId("TYPE", typeList.getTypeListId());
            if (iconFiles != null && !iconFiles.isEmpty()) {
                dto.setIconFile(iconFiles.get(0)); // 여러 개의 파일 중 첫 번째 파일을 설정
            } else {
                dto.setIconFile(null); // 파일이 없을 경우 null로 설정
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteSpaceType(int typeListId) {
        typeListMapper.deleteByTypeListId(typeListId);
    }

    @Override
    public void update(TypeList typeList) {
        typeListMapper.updateTypelist(typeList);
    }

}
