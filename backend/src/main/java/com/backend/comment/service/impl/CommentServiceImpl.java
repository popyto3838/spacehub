package com.backend.comment.service.impl;

import com.backend.comment.domain.Comment;
import com.backend.comment.mapper.CommentMapper;
import com.backend.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return commentMapper.selectByBoardId(boardId);
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
}
