package com.backend.space.service;

import com.backend.space.domain.FindResponseSpaceJoinDTO;
import com.backend.space.domain.Space;

public interface SpaceService {


    int insertSpace(Space space);

    FindResponseSpaceJoinDTO view(Integer spaceId);
}
