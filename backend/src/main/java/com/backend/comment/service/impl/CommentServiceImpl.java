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
        return commentMapper.selectAllBySpaceId(spaceId);
    }
}
