package com.backend.controller.board;

import com.backend.domain.board.Board;
import com.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    final BoardService service;

    @PostMapping("write")
    public void write(@RequestBody Board board) {
        service.write(board);
    }

    @GetMapping("list")
    public List<Board> list() {
        return service.list();
    }

    @GetMapping("{boardId}")
    public ResponseEntity view(@PathVariable Integer boardId) {
        Board board = service.view(boardId);
        if (board == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(board);
    }

    @PutMapping("{boardId}/edit")
    public void edit(@RequestBody Board board) {
        service.edit(board);
    }

    @DeleteMapping("{boardId}/delete")
    public void remove(@PathVariable Integer boardId) {
        service.remove(boardId);
    }

    @PutMapping("{boardId}/views")
    public void views(@PathVariable Integer boardId) {
        service.updateViews(boardId);
    }
}
