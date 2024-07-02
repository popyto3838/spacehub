package com.backend.board.service.impl;

import com.backend.board.domain.Board;
import com.backend.board.mapper.BoardMapper;
import com.backend.board.service.BoardService;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    final BoardMapper boardMapper;

    // AWS 설정
    final S3Client s3Client;
    private final FileMapper fileMapper;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    @Override
    public void insert(Board board, Authentication authentication, MultipartFile[] files) throws IOException {
        // authentication에 들어가있는 email을 통해 사용자의 정보를 가져옴
        board.setMemberId(Integer.valueOf(authentication.getName()));

        boardMapper.insert(board);

        // 게시물 파일 첨부
        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    // db에 파일 저장
                    boardMapper.insertFileList(board.getBoardId(), file.getOriginalFilename(), board.getCategoryId());

                    String division = getDivisionByCategoryId(board.getCategoryId());

                    // 실제 파일 저장 (s3)
                    String fileName = file.getOriginalFilename();
                    String fullPath = "prj3/" + division + "/" + board.getCategoryId() + "/" + fileName;

                    System.out.println("fullPath = " + fullPath); // fullPath = prj3/null/1/megaddibuddiuseal.png

                    PutObjectRequest objectRequest = PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fullPath)
                            .acl(ObjectCannedACL.PUBLIC_READ)
                            .build();
                    s3Client.putObject(objectRequest,
                            RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

                }
            }
        }
    }

    // categoryId에 따라 division 값을 설정하는 유틸리티 메서드(insert에서 사용)
    private String getDivisionByCategoryId(Integer categoryId) {
        if (categoryId == 1) {
            return "NOTICE";
        } else if (categoryId == 2) {
            return "FAQ";
        } else {
            return "UNKNOWN";
        }
    }

    @Override
    public Map<String, Object> list(Integer page, String searchType, String searchKeyword, String categoryType) {

        Map pageInfo = new HashMap();
        Integer countAll = boardMapper.countAllWithSearch(searchType, searchKeyword, categoryType);

        Integer offset = (page - 1) * 10;
        Integer lastPageNumber = (countAll - 1) / 10 + 1;
        Integer leftPageNumber = (page - 1) / 10 * 10 + 1;
        Integer rightPageNumber = leftPageNumber + 9;
        Integer prevPageNumber = leftPageNumber - 1;
        Integer nextPgeNumber = rightPageNumber + 1;
        rightPageNumber = Math.min(rightPageNumber, lastPageNumber);
        leftPageNumber = rightPageNumber - 9;
        leftPageNumber = Math.max(leftPageNumber, 1);

        if (prevPageNumber > 0) {
            pageInfo.put("prevPageNumber", prevPageNumber);
        }
        if (nextPgeNumber <= lastPageNumber) {
            pageInfo.put("nextPageNumber", nextPgeNumber);
        }
        pageInfo.put("currentPageNumber", page);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);

        return Map.of("pageInfo", pageInfo, "boardList", boardMapper.selectAllPaging(offset, searchType, searchKeyword, categoryType),
                "categoryList", boardMapper.selectAllPagingForCategory(offset, searchType, searchKeyword, categoryType));
    }

    @Override
    public Map<String, Object> view(Integer boardId, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();

        // 하나의 게시물 조회
        Board board = boardMapper.selectByBoardId(boardId);

        // view부터 수정 필요 (insert 들어감)

        // fileNames에서 파일 이름 조회
        // List<String> fileNames = boardMapper.selectByFileNameByBoardId(boardId);
        // 파일 경로 저장
//        List<com.backend.file.domain.File> files = fileNames.stream()
//                .map(fileName -> {
//                    var fl = new com.backend.file.domain.File();
//                    fl.setFileName(fileName);
//                    fl.setSrc(STR."http://172.27.128.1:8888/\{boardId}/\{fileName}");
//                    return fl;
//                })
//                .toList();

        String division = getDivisionByCategoryId(board.getCategoryId());

        // s3에서 파일 조회
        List<File> files = boardMapper.selectFileByDivisionAndParentId(division, boardId);
        if (files != null && !files.isEmpty()) {
            // 모든 이미지 파일 가져오기
            List<File> filesWithUrls = files.stream().map(file -> {
                String fileUrl = s3Client.utilities().getUrl(builder ->
                        builder.bucket(bucketName).key(file.getFileName())).toExternalForm();
                file.setSrc(fileUrl);
                file.setFileName(fileUrl);
                return file;
            }).collect(Collectors.toList());
            board.setFilesLists(filesWithUrls);

            System.out.println("filesWithUrls = " + filesWithUrls);
        }

        // board에 이미지 경로 넣어줌
        System.out.println("view의 files1 = " + files);
        System.out.println("view의 board = " + board);
//        board.setFilesLists(files);

        Map<String, Object> like = new HashMap<>();
        if (authentication == null) {
            like.put("like", false);
        } else {
            int c = boardMapper.selectLikeByBoardIdAndMemberId(boardId, authentication.getName());
            like.put("like", c == 1);
        }
        like.put("count", boardMapper.selectCountLikeByBoardId(boardId));
        result.put("board", board);
        result.put("like", like);

        System.out.println("보드 = " + board.getBoardId());
        System.out.println("멤버 = " + board.getMemberId());
        return result;
    }


    @Override
    public void update(Board board, List<String> removeFileList, MultipartFile[] addFileList) throws IOException {
        // 첨부된 파일 삭제
        if (removeFileList != null && removeFileList.size() > 0) {
            for (String fileName : removeFileList) {
//                String path = STR."C:/Temp/prj3p/\{board.getBoardId()}/\{fileName}"; // 경로
//                File file = new File(path);
//                file.delete();
//                boardMapper.deleteByBoardIdAndName(board.getBoardId(), fileName);

                // s3 에 있는 file
                String key = STR."prj3/\{board.getDivision()}/\{board.getBoardId()}/\{fileName}";
                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(objectRequest);

                // 파일 정보 DB에 저장
//                File existingFile = boardMapper.findFileByFullPath(fullPath);
//                if (existingFile != null) {
//                    // 기존 파일 정보 업데이트
//                    existingFile.setFileName(fullPath);
//                    boardMapper.updateFile(existingFile);
//                } else {
//                    // 새로운 파일 정보 저장
//                    File fileRecord = new File();
//                    fileRecord.setParentId(board.getBoardId());
//                    fileRecord.setDivision(division);
//                    fileRecord.setFileName(fullPath);
//                    boardMapper.insertFile(fileRecord); // categoryId가 없다
//                }

            }
        }

        // 게시물에 파일 첨부
        if (addFileList != null && addFileList.length > 0) {
            // 중복 확인을 위해 파일 목록 얻어옴
            List<String> fileNameList = boardMapper.selectByFileNameByBoardId(board.getBoardId());
            // 탐색
            for (MultipartFile file : addFileList) {
                // 파일명을 얻어서 덮어씀
                String fileName = file.getOriginalFilename();
                if (!fileNameList.contains(fileName)) {
                    // 중복되지 않은 파일만 db에 추가
                    boardMapper.insertFileList(board.getBoardId(), file.getOriginalFilename(), board.getCategoryId());
                }
                // disk에 쓰기
                // 파일이 원래 없는 경우 부모 경로 생성
//                File dir = new File(STR."C:/Temp/prj3p/\{board.getBoardId()}");
//                if (!dir.exists()) {
//                    // 디렉토리 생성
//                    dir.mkdirs();
//                }
//                String path = STR."C:/Temp/prj3p/\{board.getBoardId()}/\{fileName}";
//                File destination = new File(path);
//                file.transferTo(destination);

                // s3 에 쓰기(덮어써짐)
                String key = STR."prj3/\{board.getDivision()}/\{board.getBoardId()}/\{fileName}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }

        // 업데이트
        boardMapper.update(board);
    }

    @Override
    public void updateViews(Integer boardId) {

        boardMapper.updateViews(boardId);
    }

    @Override
    public void delete(Integer boardId) {
        Board board = boardMapper.selectByBoardId(boardId);

        // file명 조회
        List<String> fileNames = boardMapper.selectByFileNameByBoardId(boardId);
        // disk에 있는 file 삭제
//        String dir = STR."C:/Temp/prj3p/\{boardId}";

        for (String fileName : fileNames) {
//            File file = new File(dir + fileName);
//            file.delete();

            // s3 에 있는 file
            String key = STR."prj3/\{board.getDivision()}/\{boardId}/\{fileName}";
            DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(objectRequest);
        }
        // 필요없는 부모 디렉토리 삭제
//        File dirFile = new File(dir);
//        if (dirFile.exists()) {
//            dirFile.delete();
//        }

        // File 테이블 지움
        boardMapper.deleteFileByBoardId(boardId);

        // Likes 테이블 지움
        boardMapper.deleteLikeByBoardId(boardId);

        boardMapper.deleteByBoardId(boardId);
    }


    @Override
    public boolean hasAccess(Integer boardId, Authentication authentication) {
        // 게시물 번호로 게시물을 얻어옴
        Board board = boardMapper.selectByBoardId(boardId);

        // 게시물의 멤버 id와 authentication의 name과 같은지 리턴
        return board.getMemberId().equals(Integer.valueOf(authentication.getName()));
    }

    @Override
    public Map<String, Object> like(Map<String, Object> req, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        result.put("like", false);

        Integer boardId = (Integer) req.get("boardId");
        Integer memberId = Integer.valueOf(authentication.getName());

        int count = boardMapper.deleteLikeByBoardIdAndMemberId(boardId, memberId);
        if (count == 0) {
            boardMapper.insertLikeByBoardIdAndMemberId(boardId, memberId);
            result.put("like", true);
        }
        result.put("count", boardMapper.selectCountLikeByBoardId(boardId));

        return result;
    }
}
