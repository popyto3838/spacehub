package com.backend.typeList.service.impl;

import com.backend.dto.ItemListResponseDto;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.typeList.domain.TypeList;
import com.backend.typeList.mapper.TypeListMapper;
import com.backend.typeList.service.TypeListService;
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
public class TypeListServiceImpl implements TypeListService {

    private final TypeListMapper typeListMapper;
    private final FileMapper fileMapper;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    @Override
    public void insertTypeList(List<TypeList> typeLists) {
        for (TypeList typeList : typeLists) {
            typeListMapper.insertTypeList(typeList);
        }
    }

    @Override
    public List<ItemListResponseDto> selectAll() {
        List<TypeList> typeLists = typeListMapper.selectAll();

        return typeLists.stream().map(typeList -> {
            ItemListResponseDto dto = new ItemListResponseDto();
            dto.setItemId(typeList.getTypeListId());
            dto.setName(typeList.getName());
            dto.setActive(typeList.isActive());

            List<File> iconFile = fileMapper.selectFileByDivisionAndParentId("TYPE", typeList.getTypeListId());
            if (iconFile != null && !iconFile.isEmpty()) {
                // 파일명을 S3 URL로 변환하여 DTO에 추가
                File fileWithUrl = iconFile.get(0); // 첫 번째 파일만 사용
                String fileUrl = s3Client.utilities().getUrl(builder ->
                        builder.bucket(bucketName).key(fileWithUrl.getFileName())).toExternalForm();
                fileWithUrl.setFileName(fileUrl);
                dto.setIconFile(fileWithUrl);
            } else {
                dto.setIconFile(null);
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteSpaceType(int typeListId) {
        typeListMapper.deleteByTypeListId(typeListId);
    }

    @Override
    public void update(TypeList typeList) {
        typeListMapper.updateTypelist(typeList);
    }

}
