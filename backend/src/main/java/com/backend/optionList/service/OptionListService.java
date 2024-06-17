package com.backend.optionList.service;

import com.backend.optionList.domain.OptionList;

import java.util.List;

public interface OptionListService {

    void insertOptionList(List<OptionList> optionLists);


    List<OptionList> list();

    void deleteSpaceOption(int optionListId);

    void update(OptionList optionList);
}
