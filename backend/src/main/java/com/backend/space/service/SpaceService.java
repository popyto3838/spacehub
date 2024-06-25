package com.backend.space.service;

import com.backend.dto.SpaceWithThumbnailDTO;
import com.backend.space.domain.FindResponseSpaceJoinDTO;
import com.backend.space.domain.Space;

import java.util.List;

public interface SpaceService {
    
    void insertSpace(Space space);

    List<Space> selectAll();

    FindResponseSpaceJoinDTO view(Integer spaceId);

    List<SpaceWithThumbnailDTO> getAllSpacesWithThumnails();

    void insertSpaceConfig(int spaceId, List<Integer> optionList);
}
