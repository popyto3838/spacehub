package com.backend.board.service;

import com.backend.board.domain.Board;

import java.util.Map;

public interface BoardService {
    void insert(Board board);

    Map<String, Object> list(Integer page, String searchType, String searchKeyword);

    Board view(Integer boardId);

    void update(Board board);

    void delete(Integer boardId);

    void updateViews(Integer boardId);

}
