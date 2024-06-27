package com.backend.space.service;

import com.backend.dto.FindResponseSpaceJoinDTO;
import com.backend.space.domain.FindResponseSpaceMemberIdDto;
import com.backend.space.domain.Space;
import com.backend.dto.OptionListDTO;

import java.util.List;

public interface SpaceService {

    void insertSpace(Space space);

    List<Space> selectAll();

    FindResponseSpaceJoinDTO view(Integer spaceId);

    List<FindResponseSpaceJoinDTO> getAllSpacesWithThumbnails();

    void insertSpaceConfig(int spaceId, List<Integer> optionList);

    List<OptionListDTO> getOptionListBySpaceId(Integer spaceId);

    List<FindResponseSpaceMemberIdDto> selectAllByMemberId(Integer memberId);

}

