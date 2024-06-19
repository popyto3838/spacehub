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

    // todo: 게시판 페이징
    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(defaultValue = "1") Integer page,
                                    @RequestParam(value = "type", required = false) String searchType,
                                    @RequestParam(value = "keyword", defaultValue = "") String searchKeyword) {
        return boardService.list(page, searchType, searchKeyword);
    }

    @GetMapping("{boardId}")
    public ResponseEntity view(@PathVariable Integer boardId) {
        Board board = boardService.view(boardId);

        if (board == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(board);
    }

    @PutMapping("{boardId}/edit")
    @PreAuthorize("isAuthenticated()")
    public void edit(@RequestBody Board board,
                     Authentication authentication) {
        // 권한이 있어야 수정 가능
        if (boardService.hasAccess(board.getBoardId(), authentication)) {
            boardService.update(board);
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

    @PutMapping("{boardId}/views")
    public void views(@PathVariable Integer boardId) {
        boardService.updateViews(boardId);
    }

}
