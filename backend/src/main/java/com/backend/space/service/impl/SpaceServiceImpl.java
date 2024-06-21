package com.backend.space.service.impl;

import com.backend.space.domain.FindResponseSpaceJoinDTO;
import com.backend.space.domain.Space;
import com.backend.space.mapper.SpaceMapper;
import com.backend.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
public class SpaceServiceImpl implements SpaceService {

    private final SpaceMapper spaceMapper;

    @Override
    public int insertSpace(Space space) {

        // 1. space 등록 mapper 실행
        spaceMapper.insert(space);
        // 2. 등록 완료 시 생성 되는 id값을 반환
        // 3. 생성된 space_id 값을 space_config 테이블에 spaceId, optionList 활용해서 space_config 테이블에 데이터 생성
        System.out.println("space.getSpaceId() = " + space.getSpaceId());
        return space.getSpaceId();
    }

    @Override
    public FindResponseSpaceJoinDTO view(Integer spaceId) {
        log.info("space.getSpaceId() = " + spaceId);
        return spaceMapper.selectBySpaceId(spaceId);
    }
}
