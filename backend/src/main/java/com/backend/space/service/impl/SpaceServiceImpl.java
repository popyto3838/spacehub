package com.backend.space.service.impl;

import com.backend.dto.FindResponseSpaceJoinDTO;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.file.service.FileService;
import com.backend.file.service.impl.FileServiceImpl;
import com.backend.space.domain.FindResponseSpaceMemberIdDto;
import com.backend.space.domain.Space;
import com.backend.space.mapper.SpaceMapper;
import com.backend.space.service.SpaceService;
import com.backend.dto.OptionListDTO;
import edu.emory.mathcs.backport.java.util.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
public class SpaceServiceImpl implements SpaceService {

    private final SpaceMapper spaceMapper;
    private final FileService fileService;
    private final FileMapper fileMapper;
    private final S3Client s3Client;
    private final FileServiceImpl fileServiceImpl;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

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
            // 모든 이미지 파일 가져오기
            List<File> filesWithUrls = files.stream().map(file -> {
                String fileUrl = s3Client.utilities().getUrl(builder ->
                        builder.bucket(bucketName).key(file.getFileName())).toExternalForm();
                file.setFileName(fileUrl); // 파일 이름 대신 url 설정
                return file;

            }).collect(Collectors.toList());
            spaceDto.setSpaceImgFiles(filesWithUrls);
        }
        List<OptionListDTO> options = spaceMapper.selectOptionListBySpaceId(spaceId).stream().map(option -> {
            String fileName = option.getFileName();
            if (fileName != null && !fileName.isEmpty()) {
                String fileUrl = s3Client.utilities().getUrl(builder ->
                        builder.bucket(bucketName).key(fileName)).toExternalForm();
                option.setFileName(fileUrl);
            }
            return option;
        }).collect(Collectors.toList());
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
                // S3에서 파일 URL 가져오기
                File firstFile = files.get(0);
                String fileUrl = s3Client.utilities()
                        .getUrl(builder ->
                        builder.bucket(bucketName).key(firstFile.getFileName())).toExternalForm();
                firstFile.setFileName(fileUrl); // 파일 이름 대신 URL 설정
                dto.setSpaceImgFiles(Collections.singletonList(firstFile)); // 첫 번째 파일만 추가
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

    @Override
    public List<FindResponseSpaceMemberIdDto> selectAllByMemberId(Integer memberId) {
        return spaceMapper.selectAllByMemberId(memberId);
    }

    @Override
    public void updateSpace(Integer spaceId, Space space, List<Integer> optionList, List<MultipartFile> files) throws IOException {
        // 1. Space 정보 업데이트
        spaceMapper.updateSpace(spaceId, space);

        // 2. 기존 옵션 정보 삭제 후 새로운 옵션 정보 추가
        spaceMapper.deleteSpaceConfigBySpaceId(spaceId);
        for (Integer optionId : optionList) {
            spaceMapper.insertSpaceConfig(spaceId, optionId);
        }

        // 3. 파일 업로드 및 업데이트
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                fileService.addOrUpdateFile("SPACE", spaceId, file);
            }
        }
    }
}
