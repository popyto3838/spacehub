package com.backend.commentRe.service;

import com.backend.commentRe.domain.CommentRe;

import java.util.List;

public interface CommentReService {
    List<CommentRe> selectAllByCommentId(Integer commentId);

    CommentRe selectByCommentReId(Integer commentReId);

    void insert(CommentRe commentRe);

    void update(CommentRe commentRe);

    void deleteByCommentReId(Integer commentReId);
}
