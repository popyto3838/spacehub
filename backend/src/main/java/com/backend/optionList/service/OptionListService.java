package com.backend.optionList.service;

import com.backend.dto.ItemListResponseDto;
import com.backend.optionList.domain.OptionList;

import java.util.List;

public interface OptionListService {

    void insertOptionList(List<OptionList> optionLists);

    void deleteSpaceOption(int optionListId);

    void update(OptionList optionList);

    List<ItemListResponseDto> selectAll();

}
