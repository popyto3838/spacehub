package com.backend.comment.service.impl;

import com.backend.comment.domain.Comment;
import com.backend.comment.domain.FindRequestHostDetailDto;
import com.backend.comment.mapper.CommentMapper;
import com.backend.comment.service.CommentService;
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

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    final CommentMapper commentMapper;

    // AWS 설정
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    @Override
    public void insert(Comment comment, Authentication authentication) {
        comment.setMemberId(Integer.valueOf(authentication.getName()));
        comment.setParentId(comment.getParentId());
        comment.setCategoryId(comment.getCategoryId());

        commentMapper.insert(comment);
    }

    @Override
    public List<Comment> list(Integer boardId) {
        return commentMapper.selectAllByBoardId(boardId);
    }

    @Override
    public boolean validate(Comment comment) {
        if (comment == null) {
            return false;
        }
        if (comment.getContent().isBlank()) {
            return false;
        }
        if (comment.getBoardId() == null) {
            return false;
        }
        return true;
    }

    @Override
    public void delete(Comment comment) {
        commentMapper.deleteById(comment.getCommentId());
    }

    @Override
    public boolean hasAccess(Comment comment, Authentication authentication) {
        Comment db = commentMapper.selectById(comment.getCommentId());
        if (db == null) {
            return false;
        }
        if (!authentication.getName().equals(db.getMemberId().toString())) {
            return false;
        }
        return true;
    }

    @Override
    public void update(Comment comment) {
        commentMapper.update(comment);
    }

    // space의 review

    @Override
    public void insertReview(Comment comment, Authentication authentication, MultipartFile[] files) throws IOException {
        comment.setMemberId(Integer.valueOf(authentication.getName()));
        comment.setParentId(comment.getParentId());

        commentMapper.insertReview(comment);

        // 코멘트 파일 첨부
        if (files != null) {
            for (MultipartFile file : files) {
                // db에 파일 저장
                commentMapper.insertFileList(comment.getCommentId(), file.getOriginalFilename());
                // 실제 파일 저장
//                String dir = STR."C:/Temp/prj3p/\{comment.getCommentId()}"; // 부모 디렉토리(폴더)
//                File dirFile = new File(dir);
//                if (!dirFile.exists()) {
//                    dirFile.mkdirs();
//                }
//
//
//                // 파일 경로
//                String path = STR."C:/Temp/prj3p/\{comment.getCommentId()}/\{file.getOriginalFilename()}";
//                // 저장 위치 명시
//                File destination = new File(path);
//                // transferTo : 인풋스트림, 아웃풋스트림을 꺼내서 하드디스크에 저장
//                file.transferTo(destination); // checked exception 처리

                // 실제 파일 저장(s3)
                String key = STR."prj3/\{comment.getDivision()}/\{comment.getCommentId()}/\{file.getOriginalFilename()}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
    }

    @Override
    public Map<String, Object> listReview(Integer spaceId, Integer reviewPage) {
        // 페이징
        Map pageInfo = new HashMap();
        Integer countAll = commentMapper.countAllForReview(spaceId);

        Integer commentsPerPage = 5; // 페이지당 코멘트 수를 5로 설정
        Integer offset = (reviewPage - 1) * commentsPerPage;
        Integer lastPageNumber = (countAll - 1) / commentsPerPage + 1;
        Integer leftPageNumber = (reviewPage - 1) / 10 * 10 + 1;
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
        pageInfo.put("currentPageNumber", reviewPage);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);

        // 코멘트들 조회
        // List<Comment> comments = commentMapper.selectAllBySpaceId(spaceId);
        List<Comment> comments = commentMapper.selectAllBySpaceIdForReview(spaceId, offset);
        for (Comment comment : comments) {
            // fileNames에서 파일 이름 조회
            List<String> fileNames = commentMapper.selectByFileNameByCommentId(comment.getCommentId());
            // 파일 경로 저장
//            List<com.backend.file.domain.File> files = fileNames.stream()
//                    .map(fileName -> {
//                        var fl = new com.backend.file.domain.File();
//                        fl.setFileName(fileName);
//                        fl.setSrc(STR." http://172.27.128.1:8888/\{comment.getCommentId()}/\{fileName}");
//                        return fl;
//                    })
//                    .toList();

            // s3에서 파일 조회
            List<com.backend.file.domain.File> files1 = fileNames.stream()
                    .map(fileName2 ->
                    {
                        var fl2 = new com.backend.file.domain.File();
                        fl2.setFileName(fileName2);
                        fl2.setSrc(STR."\{srcPrefix}\{comment.getCommentId()}/\{fileName2}");
                        return fl2;
                    })
                    .toList();
            comment.setCommentFilesLists(files1);

            // 댓글에 첨부 파일 목록 저장
            // comment.setCommentFilesLists(files);
        }
        System.out.println("comments = " + comments);

        Map<String, Object> result = new HashMap<>();
        result.put("comments", comments);
        result.put("pageInfo", pageInfo);

        return result;
        // return comments;
        // commentMapper.selectAllBySpaceId(spaceId);
    }

    @Override
    public void deleteReview(Comment comment) {
        // file명 조회
        List<String> fileNames = commentMapper.selectByFileNameByCommentId(comment.getCommentId());
        // disk에 있는 file 삭제
//        String dir = STR."C:/Temp/prj3p/\{comment.getCommentId()}";
//        for (String fileName : fileNames) {
//            File file = new File(dir + fileName);
//            file.delete();
//        }
//        // 필요없는 부모 디렉토리 삭제
//        File dirFile = new File(dir);
//        if (dirFile.exists()) {
//            dirFile.delete();
//        }

        // s3에 있는 file
        for (String fileName : fileNames) {
            String key = STR."prj3/\{comment.getDivision()}/\{comment.getCommentId()}/\{fileName}";
            DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(objectRequest);
        }

        // file 테이블 지움
        commentMapper.deleteByCommentIdForFile(comment.getCommentId());

        commentMapper.deleteByCommentId(comment);
    }

    @Override
    public void updateReview(Comment comment, List<String> removeFileList, MultipartFile[] addFileList) throws IOException {
        // 첨부된 파일 삭제
        if (removeFileList != null && removeFileList.size() > 0) {
            for (String fileName : removeFileList) {
//                String path = STR."C:/Temp/prj3p/\{comment.getCommentId()}/\{fileName}";
//                File file = new File(path);
//                file.delete();

                // s3의 파일 삭제
                String key = STR."prj3/\{comment.getDivision()}/\{comment.getCommentId()}/\{fileName}";
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(deleteObjectRequest);

                // db records 삭제
                commentMapper.deleteByCommentIdAndName(comment.getCommentId(), fileName);
            }
        }

        // 코멘트에 새 파일 첨부
        if (addFileList != null && addFileList.length > 0) {
            // 중복 확인을 위해 파일 목록 얻어옴
            List<String> fileNameList = commentMapper.selectByFileNameByCommentId(comment.getCommentId());
            // 탐색
            for (MultipartFile file : addFileList) {
                // 파일명을 얻어서 덮어씀
                String fileName = file.getOriginalFilename();
                if (!fileNameList.contains(fileName)) {
                    // 중복되지 않은 파일만 db에 추가
                    commentMapper.insertFileList(comment.getCommentId(), file.getOriginalFilename());
                }
                // disk에 쓰기
                // 파일이 원래 없는 경우 부모 경로 생성
//                File dir = new File(STR."C:/Temp/prj3p/\{comment.getCommentId()}");
//                if (!dir.exists()) {
//                    // 디렉토리 생성
//                    dir.mkdirs();
//                }
//                String path = STR."C:/Temp/prj3p/\{comment.getCommentId()}/\{fileName}";
//                File destination = new File(path);
//                file.transferTo(destination);

                // s3에 쓰기(덮어쓰기)
                String key = STR."prj3/\{comment.getDivision()}/\{comment.getCommentId()}/\{fileName}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();
                s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }

        commentMapper.updateByCommentId(comment);
    }

    // space의 qna
    @Override
    public void insertQna(Comment comment, Authentication authentication) {
        comment.setMemberId(Integer.valueOf(authentication.getName()));
        comment.setParentId(comment.getParentId());

        commentMapper.insertQna(comment);
    }

    @Override
    public Map<String, Object> listQna(Integer spaceId, Integer qnaPage) {
        // 페이징
        Map pageInfo = new HashMap();
        Integer countAll = commentMapper.countAllForQNA(spaceId);

        Integer commentsPerPage = 5; // 페이지당 코멘트 수를 5로 설정
        Integer offset = (qnaPage - 1) * commentsPerPage;
        Integer lastPageNumber = (countAll - 1) / commentsPerPage + 1;
        Integer leftPageNumber = (qnaPage - 1) / 10 * 10 + 1;
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
        pageInfo.put("currentPageNumber", qnaPage);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);

        List<Comment> comments = commentMapper.selectAllBySpaceIdForQNA(spaceId, offset);

        Map<String, Object> result = new HashMap<>();
        result.put("comments", comments);
        result.put("pageInfo", pageInfo);

        return result;

        // return commentMapper.selectAllBySpaceId(spaceId);
        // return commentMapper.selectAllBySpaceIdForQNA(spaceId, offset);
    }

    @Override
    public void deleteQna(Comment comment) {
        commentMapper.deleteByCommentId(comment);
    }

    @Override
    public void updateQna(Comment comment) {
        commentMapper.updateByCommentId(comment);
    }

    @Override
    public List<Comment> selectAllByMemberIdReview(FindRequestHostDetailDto hostDetailDto) {
        return commentMapper.selectAllByMemberIdReview(hostDetailDto);
    }
}
