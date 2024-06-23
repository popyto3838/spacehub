package com.backend.board.service;

import com.backend.board.domain.Board;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface BoardService {
    void insert(Board board, Authentication authentication, MultipartFile[] files) throws IOException;

    Map<String, Object> list(Integer page, String searchType, String searchKeyword);

    Map<String, Object> view(Integer boardId, Authentication authentication);

    void update(Board board, List<String> removeFileList, MultipartFile[] addFileList) throws IOException;

    void delete(Integer boardId);

    void updateViews(Integer boardId);

    boolean hasAccess(Integer boardId, Authentication authentication);

    Map<String, Object> like(Map<String, Object> req, Authentication authentication);
}
