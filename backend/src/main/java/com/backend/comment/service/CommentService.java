package com.backend.comment.service;

import com.backend.comment.domain.Comment;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CommentService {

    void insert(Comment comment, Authentication authentication);

    List<Comment> list(Integer boardId);

    boolean validate(Comment comment);

    void delete(Comment comment);

    boolean hasAccess(Comment comment, Authentication authentication);

    void update(Comment comment);

    // space의 review
    void insertReview(Comment comment, Authentication authentication, MultipartFile[] files) throws IOException;

    List<Comment> listReview(Integer spaceId);

    void deleteReview(Comment comment);

    void updateReview(Comment comment, List<String> removeFileList, MultipartFile[] addFileList) throws IOException;

    // space의 qna
    void insertQna(Comment comment, Authentication authentication);

    List<Comment> listQna(Integer spaceId);

    void deleteQna(Comment comment);

    void updateQna(Comment comment);
}
