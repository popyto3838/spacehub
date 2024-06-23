package com.backend.optionList.service.impl;

import com.backend.dto.ItemListResponseDto;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.optionList.domain.OptionList;
import com.backend.optionList.mapper.OptionListMapper;
import com.backend.optionList.service.OptionListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class OptionListServiceImpl implements OptionListService {

    private final OptionListMapper optionListMapper;
    private final FileMapper fileMapper;

    @Override
    public void insertOptionList(List<OptionList> optionLists) {
        for (OptionList optionList : optionLists) {
            optionListMapper.insertOptionList(optionList);
        }
    }

    @Override
    public List<ItemListResponseDto> selectAll() {
        List<OptionList> optionLists = optionListMapper.selectAll();

        return optionLists.stream().map(optionList -> {
            ItemListResponseDto dto = new ItemListResponseDto();
            dto.setItemId(optionList.getOptionListId());
            dto.setName(optionList.getName());
            dto.setActive(optionList.isActive());

            List<File> iconFiles = fileMapper.selectFileByDivisionAndParentId("OPTION", optionList.getOptionListId());
            if (iconFiles != null && !iconFiles.isEmpty()) {
                dto.setIconFile(iconFiles.get(0)); // 여러 개의 파일 중 첫 번째 파일을 설정
            } else {
                dto.setIconFile(null); // 파일이 없을 경우 null로 설정
            }


            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteSpaceOption(int optionListId) {
        optionListMapper.deleteByOptionId(optionListId);
    }

    @Override
    public void update(OptionList optionList) {
        optionListMapper.update(optionList);
    }

}
