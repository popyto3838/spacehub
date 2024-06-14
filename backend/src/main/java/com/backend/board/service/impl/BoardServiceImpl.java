package com.backend.board.service.impl;

import com.backend.board.domain.Board;
import com.backend.board.mapper.BoardMapper;
import com.backend.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    final BoardMapper mapper;

    @Override
    public void insert(Board board) {
        mapper.insert(board);
    }

    @Override
    public Map<String, Object> list(Integer page) {
//        return mapper.selectAll();

        Map pageInfo = new HashMap();
        Integer countAll = mapper.countAll();

        Integer offset = (page - 1) * 10;
        Integer lastPageNumber = (countAll - 1) / 10 + 1;
        Integer leftPageNumber = (page - 1) / 10 * 10 + 1;
        Integer rightPageNumber = leftPageNumber + 9;
        Integer prevPageNumber = leftPageNumber - 1;
        Integer nextPgeNumber = rightPageNumber + 1;
        leftPageNumber = rightPageNumber - 9;
        leftPageNumber = Math.max(leftPageNumber, 1);
        rightPageNumber = Math.min(rightPageNumber, lastPageNumber);

        if (prevPageNumber > 0) {
            pageInfo.put("prevPageNumber", prevPageNumber);
        }
        if (nextPgeNumber <= lastPageNumber) {
            pageInfo.put("nextPageNumber", nextPgeNumber);
        }
        pageInfo.put("currentPageNumber", page);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);

        return Map.of("pageInfo", pageInfo, "boardList", mapper.selectAllPaging(offset));
    }

    @Override
    public Board view(Integer boardId) {
        return mapper.selectByBoardId(boardId);
    }

    @Override
    public void update(Board board) {
        mapper.update(board);
    }

    @Override
    public void delete(Integer boardId) {
        mapper.deleteByBoardId(boardId);
    }

    @Override
    public void updateViews(Integer boardId) {
        mapper.updateViews(boardId);
    }

}
