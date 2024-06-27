package com.backend.file.service.impl;

import com.backend.dto.ItemListResponseDto;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.file.service.FileService;
import com.backend.optionList.mapper.OptionListMapper;
import com.backend.typeList.mapper.TypeListMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class FileServiceImpl implements FileService {

    private final FileMapper fileMapper;
    private final TypeListMapper typeListMapper;
    private final OptionListMapper optionListMapper;

    // AWS 설정
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    @Override
    public void addOrUpdateFile(String division, int parentId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        String fileName = file.getOriginalFilename();
        String fullPath = "prj3/" + division + "/" + parentId + "/" + fileName;

        // 실제 파일 업로드 (S3)
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fullPath)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();
        s3Client.putObject(objectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // 파일 정보 DB에 저장
        File existingFile = fileMapper.findFileByFullPath(fullPath);
        if (existingFile != null) {
            // 기존 파일 정보 업데이트
            existingFile.setFileName(fullPath);
            fileMapper.updateFile(existingFile);
        } else {
            // 새로운 파일 정보 저장
            File fileRecord = new File();
            fileRecord.setParentId(parentId);
            fileRecord.setDivision(division);
            fileRecord.setFileName(fullPath);
            fileMapper.insertFile(fileRecord);
        }
    }

    // 로직 다시 생각해보기
    @Override
    public List<File> selectAllOfSpaces() {
        List<File> files = fileMapper.selectAllOfSpaces();
        for (File file : files) {
            String filePath = file.getDivision() + "/" + file.getParentId() + "/" + file.getFileName();
            file.setFileName(filePath);
        }
        return files;
    }

    @Override
    public List<File> getFileByDivisionAndParentId(String division, int parentId) {
        return fileMapper.selectFileByDivisionAndParentId(division, parentId);
    }

    @Override
    public void deleteFileByDivisionAndParentIdAndFileName(String division, int parentId, String fileName) throws IOException {
        String fullPath = "prj3/" + division + "/" + parentId + "/" + fileName;

        // S3에서 파일 삭제
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fullPath)
                .build();
        s3Client.deleteObject(deleteObjectRequest);

        // DB에서 파일 정보 삭제
        fileMapper.deleteFileByFullPath(fullPath);
    }

    @Override
    public void deleteFileById(int fileId) throws IOException {
        File file = fileMapper.selectFileById(fileId);
        if (file != null) {
            // S3에서 파일 삭제
            String fullPath = file.getFileName();
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fullPath)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);

            // DB에서 파일 정보 삭제
            fileMapper.deleteFileById(fileId);
        }
    }

    @Override
    public List<ItemListResponseDto> getTypeLists() {
        return typeListMapper.selectAll().stream().map(typeList -> {
            ItemListResponseDto dto = new ItemListResponseDto();
            dto.setItemId(typeList.getTypeListId());
            dto.setName(typeList.getName());
            dto.setActive(typeList.isActive());

            List<File> iconFiles = fileMapper.selectFileByDivisionAndParentId("TYPE", typeList.getTypeListId());
            dto.setIconFile(iconFiles.get(0)); // 여러 개의 파일 중 첫 번째 파일을 설정

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ItemListResponseDto> getOptionLists() {
        return optionListMapper.selectAll().stream().map(optionList -> {
            ItemListResponseDto dto = new ItemListResponseDto();
            dto.setItemId(optionList.getOptionListId());
            dto.setName(optionList.getName());
            dto.setActive(optionList.isActive());

            List<File> iconFiles = fileMapper.selectFileByDivisionAndParentId("OPTION", optionList.getOptionListId());
            dto.setIconFile(iconFiles.get(0)); // 여러 개의 파일 중 첫 번째 파일을 설정

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<File> selectAllOfTypes() {
        return fileMapper.selectAllOfTypes();
    }
}
