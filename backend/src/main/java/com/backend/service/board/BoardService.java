package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    final BoardMapper mapper;

    public void write(Board board) {
        mapper.insert(board);
    }

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

    public Board view(Integer boardId) {
        return mapper.selectByBoardId(boardId);
    }

    public void edit(Board board) {
        mapper.update(board);
    }

    public void remove(Integer boardId) {
        mapper.deleteByBoardId(boardId);
    }

    public void updateViews(Integer boardId) {
        mapper.updateViews(boardId);
    }

}
