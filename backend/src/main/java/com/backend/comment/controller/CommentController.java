package com.backend.comment.controller;

import com.backend.comment.domain.Comment;
import com.backend.comment.service.CommentService;
import com.backend.comment.service.impl.CommentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    final CommentService commentService;
    private final CommentServiceImpl commentServiceImpl;

    @PostMapping("write")
    @PreAuthorize("isAuthenticated()")
    public void write(@RequestBody Comment comment, Authentication authentication) {

        if (commentServiceImpl.validate(comment)) {
            commentService.insert(comment, authentication);
        }
    }

    @GetMapping("list/{boardId}")
    public List<Comment> list(@PathVariable Integer boardId) {
        return commentService.list(boardId);
    }

    @DeleteMapping("delete")
    public void delete(@RequestBody Comment comment,
                       Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.delete(comment);
        }
    }
}
