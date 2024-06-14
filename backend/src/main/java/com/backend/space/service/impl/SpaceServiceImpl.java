package com.backend.space.service.impl;

import com.backend.space.mapper.SpaceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class SpaceServiceImpl {

    private final SpaceMapper mapper;

    public void add() {
        mapper.insert();
    }
}
