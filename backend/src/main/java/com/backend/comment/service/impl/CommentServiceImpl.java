package com.backend.comment.service.impl;

import com.backend.comment.domain.Comment;
import com.backend.comment.domain.FindRequestHostDetailDto;
import com.backend.comment.mapper.CommentMapper;
import com.backend.comment.service.CommentService;
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
                if (!file.isEmpty()) {

                    // 실제 파일 저장(s3)
                    String fileName = file.getOriginalFilename();
                    String fullPath = "prj3/" + "REVIEW" + "/" + comment.getCommentId() + "/" + fileName;

                    PutObjectRequest objectRequest = PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fullPath)
                            .acl(ObjectCannedACL.PUBLIC_READ)
                            .build();
                    s3Client.putObject(objectRequest,
                            RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

                    // db에 파일 저장
                    commentMapper.insertFileList(comment.getCommentId(), fullPath);
                }
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
            // s3에서 파일 이름 조회
            // List<String> files = commentMapper.selectByFileNameByCommentId(comment.getCommentId());
            List<File> files = commentMapper.selectByFileNameByCommentIdForS3(comment.getCommentId());
            if (files != null && !files.isEmpty()) {
                List<File> filesWithUrls = files.stream()
                        .map(file -> {
                            var fl = new File();
                            String fullPath = file.getFileName();
                            String fileUrl = s3Client.utilities().getUrl(builder ->
                                    builder.bucket(bucketName).key(file.getFileName())).toExternalForm();
                            fl.setSrc(fileUrl);
                            fl.setFileName(fullPath);
                            System.out.println("list의 fileUrl = " + fileUrl);
                            System.out.println("list의 fullPath = " + fullPath);
                            return fl;
                        }).collect(Collectors.toList());
                // 댓글에 첨부 파일 목록 저장
                comment.setCommentFilesLists(filesWithUrls);

                System.out.println("list의 filesWithUrls = " + filesWithUrls);
            }
        }
        System.out.println("comments = " + comments);

        Map<String, Object> result = new HashMap<>();
        result.put("comments", comments);
        result.put("pageInfo", pageInfo);

        return result;
    }

    @Override
    public void deleteReview(Comment comment) {
        // file명 조회
        // List<String> files = commentMapper.selectByFileNameByCommentId(comment.getCommentId());
        List<File> files = commentMapper.selectByFileNameByCommentIdForS3(comment.getCommentId());

        // s3에 있는 file 삭제
        if (files != null) {
            for (File file : files) {
                String fullPath = file.getFileName();
                System.out.println("delete의 fullPath = " + fullPath);

                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fullPath)
                        .build();
                s3Client.deleteObject(objectRequest);
            }
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
                // s3의 파일 삭제
                String fullPath = fileName;
                System.out.println("update의 delete의 fileName = " + fileName);
                System.out.println("update의 delete의 fullPath = " + fullPath);

                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fullPath)
                        .build();
                s3Client.deleteObject(objectRequest);

                // db records 삭제
                commentMapper.deleteByCommentIdAndName(comment.getCommentId(), fullPath);
            }
        }

        // 코멘트에 새 파일 첨부
        if (addFileList != null && addFileList.length > 0) {
            // 중복 확인을 위해 파일 목록 얻어옴
            List<String> fileNameList = commentMapper.selectByFileNameByCommentId(comment.getCommentId());
            // 탐색
            for (MultipartFile file : addFileList) {
                // 파일명을 얻어서 덮어씀
                String fileName = "prj3/" + "REVIEW" + "/" + comment.getCommentId() + "/" + file.getOriginalFilename();
                if (!fileNameList.contains(fileName)) {
                    // 중복되지 않은 파일만 db에 추가
                    commentMapper.insertFileList(comment.getCommentId(), fileName);
                }
                System.out.println("update의 add의 fileName = " + fileName);

                // s3에 쓰기(덮어쓰기)
                String fullPath = "prj3/" + "REVIEW" + "/" + comment.getCommentId() + "/" + file.getOriginalFilename();
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fullPath)
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
