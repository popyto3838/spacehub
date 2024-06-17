package com.backend.board.controller;

import com.backend.board.domain.Board;
import com.backend.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("write")
    public void write(@RequestBody Board board) {
        System.out.println("board = " + board);
        boardService.insert(board);

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
    public void edit(@RequestBody Board board) {
        boardService.update(board);
    }

    @DeleteMapping("{boardId}/delete")
    public void remove(@PathVariable Integer boardId) {
        boardService.delete(boardId);
    }

    @PutMapping("{boardId}/views")
    public void views(@PathVariable Integer boardId) {
        boardService.updateViews(boardId);
    }

}
