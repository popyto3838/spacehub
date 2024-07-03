package com.backend.commentRe.controller;

import com.backend.commentRe.domain.CommentRe;
import com.backend.commentRe.service.CommentReService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commentRe")
@RequiredArgsConstructor
@Log4j2
public class CommentReController {
    private final CommentReService commentReService;

    @GetMapping("/listAll/{commentId}")
    public ResponseEntity<List<CommentRe>> listAll(@PathVariable Integer commentId) {
        List<CommentRe> list = commentReService.selectAllByCommentId(commentId);
        if (list == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{commentReId}")
    public ResponseEntity<CommentRe> view(@PathVariable Integer commentReId) {
        CommentRe commentRe = commentReService.selectByCommentReId(commentReId);
        if (commentRe == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(commentRe);
    }

    @PostMapping("/write")
    public ResponseEntity<Map<String, Object>> write(@RequestBody CommentRe commentRe) {
        commentReService.insert(commentRe);
        Map<String, Object> response = new HashMap<>();
        log.info("commentRe.getCommentReId={}", commentRe.getCommentReId());
        response.put("commentReId", commentRe.getCommentReId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public void update(@RequestBody CommentRe commentRe) {
        commentReService.update(commentRe);
    }

    @DeleteMapping("/delete/{commentReId}")
    public void delete(@PathVariable Integer commentReId) {
        commentReService.deleteByCommentReId(commentReId);
    }
}
