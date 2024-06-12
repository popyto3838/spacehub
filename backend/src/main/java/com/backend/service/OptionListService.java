package com.backend.service;

import com.backend.domain.OptionList;
import com.backend.mapper.OptionListMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class OptionListService {

    private final OptionListMapper mapper;


    public void insertOptionList(List<OptionList> optionLists) {
        for (OptionList optionList : optionLists) {
            mapper.insertOptionList(optionList);
        }
    }
}
