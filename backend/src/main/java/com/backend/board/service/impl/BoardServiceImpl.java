package com.backend.board.service.impl;

import com.backend.board.domain.Board;
import com.backend.board.mapper.BoardMapper;
import com.backend.board.service.BoardService;
import com.backend.file.domain.File;
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
                    String division = getDivisionByCategoryId(board.getCategoryId());

                    // 실제 파일 저장 (s3)
                    String fileName = file.getOriginalFilename();
                    String fullPath = "prj3/" + division + "/" + board.getBoardId() + "/" + fileName;

                    System.out.println("insert의 fileName = " + fileName);
                    System.out.println("insert의 fullPath = " + fullPath);
                    //insert의 fileName = bulbasaur.jpg
                    //insert의 fullPath = prj3/FAQ/31/bulbasaur.jpg

                    PutObjectRequest objectRequest = PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fullPath)
                            .acl(ObjectCannedACL.PUBLIC_READ)
                            .build();
                    s3Client.putObject(objectRequest,
                            RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

                    // db에 파일 저장
                    // boardMapper.insertFileList(board.getBoardId(), file.getOriginalFilename(), board.getCategoryId());
                    boardMapper.insertFileListByFullPath(board.getBoardId(), fullPath, board.getCategoryId());

                }
            }
        }
    }

    // categoryId에 따라 division 값을 설정하는 유틸리티 메서드(AWS File 업로드에서 사용)
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

        List<Board> boardList = boardMapper.selectAllPaging(offset, searchType, searchKeyword, categoryType);

        return Map.of("pageInfo", pageInfo, "boardList", boardList,
                "categoryList", boardMapper.selectAllPagingForCategory(offset, searchType, searchKeyword, categoryType));
    }


    @Override
    public Map<String, Object> view(Integer boardId, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();

        // 하나의 게시물 조회
        Board board = boardMapper.selectByBoardId(boardId);

        // board가 null이면 (NOTICE나 FAQ가 아니면) 빈 결과 반환
        if (board == null) {
            return result;
        }
        System.out.println("board.getDivision() = " + board.getDivision());

        String division = board.getDivision(); // getDivisionByCategoryId 메서드 사용 불필요
        System.out.println("division = " + division);

        // s3에서 파일 조회
        List<File> files = boardMapper.selectFileByDivisionAndParentId(division, boardId);
        System.out.println("files = " + files);

        if (files != null && !files.isEmpty()) {
            // 모든 이미지 파일 가져오기
            List<File> filesWithUrls = files.stream()
                    .map(file -> {
                        var fl = new File();
                        String fullPath = file.getFileName();
                        String fileUrl = s3Client.utilities().getUrl(builder ->
                                builder.bucket(bucketName).key(file.getFileName())).toExternalForm();
                        fl.setSrc(fileUrl);
                        fl.setFileName(fullPath);
                        System.out.println("view의 fileUrl = " + fileUrl);
                        System.out.println("view의 fullPath = " + fullPath);
                        // view의 fileUrl = https://studysanta.s3.ap-northeast-2.amazonaws.com/prj3/FAQ/31/bulbasaur.jpg
                        // view의 fullPath = prj3/FAQ/31/prj3/FAQ/31/bulbasaur.jpg
                        return fl;
                    }).collect(Collectors.toList());
            board.setFilesLists(filesWithUrls);

            System.out.println("view의 filesWithUrls = " + filesWithUrls);
        }

        // board에 이미지 경로 넣어줌
        System.out.println("view의 board = " + board);

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

        return result;
    }


    @Override
    public void update(Board board, List<String> removeFileList, MultipartFile[] addFileList) throws IOException {
        // NOTICE 또는 FAQ 카테고리인지 확인
        if (!isNoticeOrFaq(board.getBoardId())) {
            throw new IllegalArgumentException("NOTICE 또는 FAQ 카테고리의 게시물만 수정 가능합니다.");
        }

        String division = getDivisionByCategoryId(board.getCategoryId());

        // 첨부된 파일 삭제
        if (removeFileList != null && removeFileList.size() > 0) {
            for (String fileName : removeFileList) {
                // s3 에 있는 file
                // String fullPath = fileName;
                String fullPath = fileName;
                System.out.println("update의 delete fileName = " + fileName);
                System.out.println("fullPath = " + fullPath);

                // update의 delete fileName = prj3/FAQ/30/charmander.jpg
                // fullPath = prj3/FAQ/30/charmander.jpg

                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fullPath)
                        .build();
                s3Client.deleteObject(objectRequest);

                // File 테이블 지움
                boardMapper.deleteFileByBoardIdAndFileName(board.getBoardId(), fullPath);
            }
        }

        // 게시물에 파일 첨부
        if (addFileList != null && addFileList.length > 0) {
            // 중복 확인을 위해 파일 목록 얻어옴
            List<String> fileNameList = boardMapper.selectByFileNameByBoardId(board.getBoardId());
            //List<File> files = boardMapper.selectFileByDivisionAndParentId(division, board.getBoardId());
            // 탐색
            for (MultipartFile file : addFileList) {
                // 파일명을 얻어서 덮어씀
                String fileName = "prj3/" + division + "/" + board.getBoardId() + "/" + file.getOriginalFilename();
                if (!fileNameList.contains(fileName)) {
                    // 중복되지 않은 파일만 db에 추가
                    boardMapper.insertFileList(board.getBoardId(), fileName, board.getCategoryId());
                }
                System.out.println("update의 addfileName = " + fileName);

                // s3 에 쓰기(덮어써짐)
                String fullPath = "prj3/" + division + "/" + board.getBoardId() + "/" + file.getOriginalFilename();
                System.out.println("update의 addfile fullPath = " + fullPath);
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fullPath)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }

        // 업데이트
        boardMapper.update(board);
    }

    @Override
    public boolean isNoticeOrFaq(Integer boardId) {
        Board board = boardMapper.selectByBoardId(boardId);
        return board != null && (board.getDivision().equals("NOTICE") || board.getDivision().equals("FAQ"));
    }

    @Override
    public void updateViews(Integer boardId) {

        boardMapper.updateViews(boardId);
    }

    @Override
    public void delete(Integer boardId) {
        Board board = boardMapper.selectByBoardId(boardId);

        String division = getDivisionByCategoryId(board.getCategoryId());
        System.out.println("division = " + division);

        // file명 조회
        List<File> files = boardMapper.selectFileByDivisionAndParentId(division, boardId);
        System.out.println("delete의 첫 files = " + files);

        // delete의 첫 files = [File(fileId=238, parentId=31, division=null, fileName=prj3/FAQ/31/bulbasaur.jpg, inputDt=null, updateDt=null, src=null), File(fileId=239, parentId=31, division=null, fileName=prj3/FAQ/31/ggobugi.jpg, inputDt=null, updateDt=null, src=null), File(fileId=240, parentId=31, division=null, fileName=prj3/FAQ/31/charmander.jpg, inputDt=null, updateDt=null, src=null)]
        //fullPath = prj3/FAQ/31/bulbasaur.jpg

        // s3에 있는 file 삭제
        if (files != null) {
            for (File file : files) {
                String fullPath = file.getFileName();
                // String fullPath = file.getFileName();
                System.out.println("게시물 delete의 fullPath = " + fullPath);

                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fullPath)
                        .build();
                s3Client.deleteObject(objectRequest);
            }
        }

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
