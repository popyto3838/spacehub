package com.backend.space.service.impl;

import com.backend.dto.FindResponseSpaceJoinDTO;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.space.domain.Space;
import com.backend.space.mapper.SpaceMapper;
import com.backend.space.service.SpaceService;
import com.backend.dto.OptionListDTO;
import edu.emory.mathcs.backport.java.util.Collections;
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
        FindResponseSpaceJoinDTO spaceDto = new FindResponseSpaceJoinDTO();
        spaceDto.setSpace(spaceMapper.selectBySpaceId(spaceId));
        if (spaceDto == null) {
            return null;
        }
        List<File> files = fileMapper.selectFileByDivisionAndParentId("SPACE", spaceId);
        if (files != null && !files.isEmpty()) {
            spaceDto.setSpaceImgFiles(files); // 모든 이미지 파일 가져오기
        }
        List<OptionListDTO> options = spaceMapper.selectOptionListBySpaceId(spaceId);
        spaceDto.setOptionList(options);
        return spaceDto;
    }

    @Override
    public List<FindResponseSpaceJoinDTO> getAllSpacesWithThumbnails() {
        List<Space> spaces = spaceMapper.selectAll();
        List<FindResponseSpaceJoinDTO> spaceWithThumnailList = new ArrayList<>();

        for (Space space : spaces) {
            FindResponseSpaceJoinDTO dto = new FindResponseSpaceJoinDTO();
            dto.setSpace(space);

            List<File> files = fileMapper.selectFileByDivisionAndParentId("SPACE", space.getSpaceId());
            if (!files.isEmpty()) {
                dto.setSpaceImgFiles(Collections.singletonList(files.get(0))); // 첫 번째 파일만 추가
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

    @Override
    public List<OptionListDTO> getOptionListBySpaceId(Integer spaceId) {
        return spaceMapper.selectOptionListBySpaceId(spaceId);
    }
}
