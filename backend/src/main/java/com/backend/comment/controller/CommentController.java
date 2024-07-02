package com.backend.comment.controller;

import com.backend.comment.domain.Comment;
import com.backend.comment.domain.FindRequestHostDetailDto;
import com.backend.comment.service.CommentService;
import com.backend.comment.service.impl.CommentServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
@Log4j2
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

    @GetMapping("/myReviewList")
    public List<Comment> selectAllByMemberIdReview(@ModelAttribute FindRequestHostDetailDto hostDetailDto) {
        log.info("====hostDetailDto===={}", hostDetailDto);
        return commentService.selectAllByMemberIdReview(hostDetailDto);
    }

    @DeleteMapping("delete")
    @PreAuthorize("isAuthenticated()")
    public void delete(@RequestBody Comment comment,
                       Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.delete(comment);
        }
    }

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public void edit(@RequestBody Comment comment,
                     Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.update(comment);
        }
    }

    // space의 review
    @PostMapping("writeReview")
    public void writeReview(Comment comment,
                            Authentication authentication,
                            @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        commentService.insertReview(comment, authentication, files);
    }

    @GetMapping("listReview/{spaceId}")
    public Map<String, Object> listReview(@PathVariable Integer spaceId,
                                          @RequestParam(defaultValue = "1") Integer reviewPage) {
        return commentService.listReview(spaceId, reviewPage);
    }

    @DeleteMapping("deleteReview")
    @PreAuthorize("isAuthenticated()")
    public void deleteReview(@RequestBody Comment comment,
                             Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.deleteReview(comment);
        }

    }

    @PutMapping("editReview")
    @PreAuthorize("isAuthenticated()")
    public void editReview(Comment comment,
                           @RequestParam(value = "removeFileList[]", required = false)
                           List<String> removeFileList,
                           @RequestParam(value = "addFileList[]", required = false)
                           MultipartFile[] addFileList,
                           Authentication authentication) throws IOException {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.updateReview(comment, removeFileList, addFileList);
        }
    }


    // space의 qna
    @PostMapping("writeQna")
    @PreAuthorize("isAuthenticated()")
    public void writeQna(@RequestBody Comment comment, Authentication authentication) {
        commentService.insertQna(comment, authentication);

    }

    @GetMapping("listQna/{spaceId}")
    public Map<String, Object> listQna(@PathVariable Integer spaceId,
                                       @RequestParam(defaultValue = "1") Integer qnaPage) {
        return commentService.listQna(spaceId, qnaPage);
    }

    @DeleteMapping("deleteQna")
    @PreAuthorize("isAuthenticated()")
    public void deleteQna(@RequestBody Comment comment, Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.deleteQna(comment);
        }
    }

    @PutMapping("editQna")
    @PreAuthorize("isAuthenticated()")
    public void editQna(@RequestBody Comment comment, Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.update(comment);
        }
    }
}
