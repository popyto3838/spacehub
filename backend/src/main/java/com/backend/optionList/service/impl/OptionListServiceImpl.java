package com.backend.optionList.service.impl;

import com.backend.dto.ItemListResponseDto;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.optionList.domain.OptionList;
import com.backend.optionList.mapper.OptionListMapper;
import com.backend.optionList.service.OptionListService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.S3Client;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class OptionListServiceImpl implements OptionListService {

    private final OptionListMapper optionListMapper;
    private final FileMapper fileMapper;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    @Override
    public void insertOptionList(List<OptionList> optionLists) {
        for (OptionList optionList : optionLists) {
            optionListMapper.insertOptionList(optionList);
        }
    }

    @Override
    public List<ItemListResponseDto> selectAll() {
        List<OptionList> optionLists = optionListMapper.selectAll();

        return optionLists.stream().map(optionList -> {
            ItemListResponseDto dto = new ItemListResponseDto();
            dto.setItemId(optionList.getOptionListId());
            dto.setName(optionList.getName());
            dto.setActive(optionList.isActive());

            List<File> iconFile = fileMapper.selectFileByDivisionAndParentId("OPTION", optionList.getOptionListId());
            if (iconFile != null && !iconFile.isEmpty()) {
                // 파일명을 S3 URL로 변환하여 DTO에 추가
                File fileWithUrl = iconFile.get(0); // 첫 번째 파일만 사용
                String fileUrl = s3Client.utilities().getUrl(builder ->
                        builder.bucket(bucketName).key(fileWithUrl.getFileName())).toExternalForm();
                fileWithUrl.setFileName(fileUrl);
                dto.setIconFile(fileWithUrl);
            } else {
                dto.setIconFile(null); // 파일이 없을 경우 null로 설정
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteSpaceOption(int optionListId) {
        optionListMapper.deleteByOptionId(optionListId);
    }

    @Override
    public void update(OptionList optionList) {
        optionListMapper.update(optionList);
    }

}
