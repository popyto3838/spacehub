package com.backend.space.service.impl;

import com.backend.space.domain.FindResponseSpaceJoinDTO;
import com.backend.space.domain.Space;
import com.backend.space.mapper.SpaceMapper;
import com.backend.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
public class SpaceServiceImpl implements SpaceService {

    private final SpaceMapper spaceMapper;

    @Override
    public List<Space> selectAll() {
        return spaceMapper.selectAll();
    }

    @Override
    public void insertSpace(Space space) {
        spaceMapper.insert(space);
    }

    @Override
    public FindResponseSpaceJoinDTO view(Integer spaceId) {
        return spaceMapper.selectBySpaceId(spaceId);
    }
}
