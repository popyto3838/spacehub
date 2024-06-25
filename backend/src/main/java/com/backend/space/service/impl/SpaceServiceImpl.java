package com.backend.space.service.impl;

import com.backend.dto.SpaceWithThumbnailDTO;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.space.domain.FindResponseSpaceJoinDTO;
import com.backend.space.domain.Space;
import com.backend.space.mapper.SpaceMapper;
import com.backend.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
public class SpaceServiceImpl implements SpaceService {

    private final SpaceMapper spaceMapper;
    private final FileMapper fileMapper;

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

    @Override
    public List<SpaceWithThumbnailDTO> getAllSpacesWithThumnails() {
        List<Space> spaces = spaceMapper.selectAll();
        List<SpaceWithThumbnailDTO> spaceWithThumnailList = new ArrayList<>();

        for (Space space : spaces) {
            SpaceWithThumbnailDTO dto = new SpaceWithThumbnailDTO();
            dto.setSpace(space);

            List<File> files = fileMapper.selectFileByDivisionAndParentId("SPACE", space.getSpaceId());
            if (!files.isEmpty()) {
                dto.setThumbnailPath(files.getFirst().getFileName());
            }

            spaceWithThumnailList.add(dto);
        }

        return spaceWithThumnailList;
    }

    @Override
    public void insertSpaceConfig(int spaceId, List<Integer> optionList) {
        for (Integer optionId : optionList) {
            spaceMapper.insertSpaceConfig(spaceId, optionId);
        }
    }
}
