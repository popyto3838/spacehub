package com.backend.commentRe.service.impl;

import com.backend.comment.mapper.CommentReMapper;
import com.backend.commentRe.domain.CommentRe;
import com.backend.commentRe.service.CommentReService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
@EnableScheduling
public class CommentReServiceImpl implements CommentReService {
    private final CommentReMapper commentReMapper;

    @Override
    public List<CommentRe> selectAllByCommentId(Integer commentId) {
        return commentReMapper.selectAllByCommentId(commentId);
    }

    @Override
    public CommentRe selectByCommentReId(Integer commentReId) {
        return commentReMapper.selectByCommentReId(commentReId);
    }

    @Override
    public void insert(CommentRe commentRe) {
        commentReMapper.insert(commentRe);
    }

    @Override
    public void update(CommentRe commentRe) {
        commentReMapper.update(commentRe);
    }

    @Override
    public void deleteByCommentReId(Integer commentReId) {
        commentReMapper.deleteByCommentReId(commentReId);
    }
}
