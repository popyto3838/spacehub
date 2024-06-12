package com.backend.service;

import com.backend.mapper.SpaceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class SpaceService {

    private final SpaceMapper mapper;

    public void add() {
        mapper.insert();
    }
}
