package com.backend.space.service;

import com.backend.dto.FindResponseSpaceJoinDTO;
import com.backend.space.domain.FindResponseSpaceMemberIdDto;
import com.backend.space.domain.Space;
import com.backend.dto.OptionListDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface SpaceService {

    void insertSpace(Space space);

    List<Space> selectAll();

    FindResponseSpaceJoinDTO view(Integer spaceId);

    List<FindResponseSpaceJoinDTO> getAllSpacesWithThumbnails();

    void insertSpaceConfig(int spaceId, List<Integer> optionList);

    List<OptionListDTO> getOptionListBySpaceId(Integer spaceId);

    List<FindResponseSpaceMemberIdDto> selectAllByMemberId(Integer memberId);

    void updateSpace(Integer spaceId, Space space, List<Integer> optionList, List<MultipartFile> files) throws IOException;
}

