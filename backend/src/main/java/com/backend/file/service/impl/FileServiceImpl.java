package com.backend.file.service.impl;

import com.backend.file.mapper.FileMapper;
import com.backend.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class FileServiceImpl implements FileService {

    private final FileMapper fileMapper;

}
