package com.backend.optionList.service.impl;

import com.backend.optionList.domain.OptionList;
import com.backend.optionList.mapper.OptionListMapper;
import com.backend.optionList.service.OptionListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class OptionListServiceImpl implements OptionListService {

    private final OptionListMapper mapper;


    @Override
    public void insertOptionList(List<OptionList> optionLists) {
        for (OptionList optionList : optionLists) {
            mapper.insertOptionList(optionList);
        }
    }

    @Override
    public List<OptionList> list() {
        return mapper.selectAll();
    }

    @Override
    public void deleteSpaceOption(int optionListId) {
        mapper.deleteByOptionId(optionListId);
    }

}
