package com.backend.space.service.impl;

import com.backend.space.domain.Space;
import com.backend.space.mapper.SpaceMapper;
import com.backend.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class SpaceServiceImpl implements SpaceService {

    private final SpaceMapper mapper;

    @Override
    public void insertSpace(Space space) {
        mapper.insert(space);
    }
}
