package com.backend.space.service;

import com.backend.space.domain.FindResponseSpaceJoinDTO;
import com.backend.space.domain.Space;

import java.util.List;

public interface SpaceService {
    
    void insertSpace(Space space);

    List<Space> selectAll();

    FindResponseSpaceJoinDTO view(Integer spaceId);
}
