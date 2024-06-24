package com.backend.comment.service;

import com.backend.comment.domain.Comment;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface CommentService {

    void insert(Comment comment, Authentication authentication);

    List<Comment> list(Integer boardId);

    boolean validate(Comment comment);

    void delete(Comment comment);

    boolean hasAccess(Comment comment, Authentication authentication);

    void update(Comment comment);
}
