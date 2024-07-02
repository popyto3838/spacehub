package com.backend.comment.service;

import com.backend.comment.domain.Comment;
import com.backend.comment.domain.FindRequestHostDetailDto;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CommentService {

    void insert(Comment comment, Authentication authentication);

    List<Comment> list(Integer boardId);

    boolean validate(Comment comment);

    void delete(Comment comment);

    boolean hasAccess(Comment comment, Authentication authentication);

    void update(Comment comment);

    // space의 review
    void insertReview(Comment comment, Authentication authentication, MultipartFile[] files) throws IOException;

    Map<String, Object> listReview(Integer spaceId, Integer reviewPage);

    void deleteReview(Comment comment);

    void updateReview(Comment comment, List<String> removeFileList, MultipartFile[] addFileList) throws IOException;

    // space의 qna
    void insertQna(Comment comment, Authentication authentication);

    Map<String, Object> listQna(Integer spaceId, Integer qnaPage);

    void deleteQna(Comment comment);

    void updateQna(Comment comment);

    List<Comment> selectAllByMemberIdReview(FindRequestHostDetailDto hostDetailDto);
}
