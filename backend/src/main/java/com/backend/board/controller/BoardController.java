package com.backend.board.controller;

import com.backend.board.domain.Board;
import com.backend.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("write")
    @PreAuthorize("isAuthenticated()")
    public void write(Board board, Authentication authentication
            , @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        // 글 작성시 로그인 사용자 정보, 파일 추가
        boardService.insert(board, authentication, files);

    }

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(defaultValue = "1") Integer page,
                                    @RequestParam(value = "type", required = false) String searchType,
                                    @RequestParam(value = "keyword", defaultValue = "") String searchKeyword) {
        return boardService.list(page, searchType, searchKeyword);
    }

    @GetMapping("{boardId}")
    public ResponseEntity view(@PathVariable Integer boardId,
                               Authentication authentication) {
        // Board board = boardService.view(boardId);
        Map<String, Object> result = boardService.view(boardId, authentication);

        if (result.get("board") == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(result);
    }

    @PutMapping("{boardId}/edit")
    @PreAuthorize("isAuthenticated()")
    public void edit(Board board,
                     @RequestParam(value = "removeFileList[]", required = false)
                     List<String> removeFileList,
                     @RequestParam(value = "addFileList[]", required = false)
                     MultipartFile[] addFileList,
                     Authentication authentication) throws IOException {
        // 권한이 있어야 수정 가능
        if (boardService.hasAccess(board.getBoardId(), authentication)) {
            boardService.update(board, removeFileList, addFileList);
        }
    }

    @DeleteMapping("{boardId}/delete")
    @PreAuthorize("isAuthenticated()")
    public void remove(@PathVariable Integer boardId,
                       Authentication authentication) {
        if (boardService.hasAccess(boardId, authentication)) {
            boardService.delete(boardId);
        }
    }

    // 조회수
    @PutMapping("{boardId}/views")
    public void views(@PathVariable Integer boardId) {
        boardService.updateViews(boardId);
    }

    // 좋아요
    @PutMapping("like")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> like(@RequestBody Map<String, Object> req,
                                    Authentication authentication) {
        return boardService.like(req, authentication);
    }

}
