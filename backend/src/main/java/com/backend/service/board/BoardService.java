package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    final BoardMapper mapper;

    public void write(Board board) {
        mapper.insert(board);
    }

    public List<Board> list() {
        return mapper.selectAll();
    }

    public Board view(Integer boardId) {
        return mapper.selectByBoardId(boardId);
    }

    public void edit(Board board) {
        mapper.update(board);
    }

    public void remove(Integer boardId) {
        mapper.deleteByBoardId(boardId);
    }
}
