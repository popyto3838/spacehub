package com.backend.comment.service.impl;

import com.backend.comment.domain.Comment;
import com.backend.comment.mapper.CommentMapper;
import com.backend.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    final CommentMapper commentMapper;

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
                String dir = STR."C:/Temp/prj3p/\{comment.getCommentId()}"; // 부모 디렉토리(폴더)
                File dirFile = new File(dir);
                if (!dirFile.exists()) {
                    dirFile.mkdirs();
                }
                // 파일 경로
                String path = STR."C:/Temp/prj3p/\{comment.getCommentId()}/\{file.getOriginalFilename()}";
                // 저장 위치 명시
                File destination = new File(path);
                // transferTo : 인풋스트림, 아웃풋스트림을 꺼내서 하드디스크에 저장
                file.transferTo(destination); // checked exception 처리
            }
        }
    }

    @Override
    public List<Comment> listReview(Integer spaceId) {
        // 코멘트들 조회
        List<Comment> comments = commentMapper.selectAllBySpaceId(spaceId);
        for (Comment comment : comments) {
            // fileNames에서 파일 이름 조회
            List<String> fileNames = commentMapper.selectByFileNameByCommentId(comment.getCommentId());
            // 파일 경로 저장
            List<com.backend.file.domain.File> files = fileNames.stream()
                    .map(fileName -> {
                        var fl = new com.backend.file.domain.File();
                        fl.setFileName(fileName);
                        fl.setSrc(STR." http://172.30.1.93:8888/\{comment.getCommentId()}/\{fileName}");
                        return fl;
                    })
                    .toList();

            // 댓글에 첨부 파일 목록 저장
            comment.setCommentFilesLists(files);
        }
        System.out.println("comments = " + comments);

        return comments;
        // commentMapper.selectAllBySpaceId(spaceId);
    }

    @Override
    public void deleteReview(Comment comment) {
        // file명 조회
        List<String> fileNames = commentMapper.selectByFileNameByCommentId(comment.getCommentId());
        // disk에 있는 file 삭제
        String dir = STR."C:/Temp/prj3p/\{comment.getCommentId()}";
        for (String fileName : fileNames) {
            File file = new File(dir + fileName);
            file.delete();
        }
        // 필요없는 부모 디렉토리 삭제
        File dirFile = new File(dir);
        if (dirFile.exists()) {
            dirFile.delete();
        }

        // file 테이블 지움
        commentMapper.deleteByCommentIdForFile(comment.getCommentId());

        commentMapper.deleteByCommentId(comment);
    }

    @Override
    public void updateReview(Comment comment) {
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
    public List<Comment> listQna(Integer spaceId) {
        return commentMapper.selectAllBySpaceId(spaceId);
    }

    @Override
    public void deleteQna(Comment comment) {
        commentMapper.deleteByCommentId(comment);
    }

    @Override
    public void updateQna(Comment comment) {
        commentMapper.updateByCommentId(comment);
    }
}
