package com.backend.board.controller;

import com.backend.board.domain.Board;
import com.backend.board.service.BoardService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
                                    @RequestParam(value = "keyword", defaultValue = "") String searchKeyword,
                                    @RequestParam(value = "category", defaultValue = "all") String categoryType) {
        return boardService.list(page, searchType, searchKeyword, categoryType);
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
    public void views(@PathVariable Integer boardId, HttpServletRequest req, HttpServletResponse res) {
        // 조회수 중복 불가 참고
        // https://velog.io/@korea3611/Spring-Boot%EA%B2%8C%EC%8B%9C%EA%B8%80-%EC%A1%B0%ED%9A%8C%EC%88%98-%EC%A6%9D%EA%B0%80-%EC%A4%91%EB%B3%B5%EB%B0%A9%EC%A7%80-%EA%B8%B0%EB%8A%A5-%EB%A7%8C%EB%93%A4%EA%B8%B0
        // https://velog.io/@kwg527/Spring-%EC%A1%B0%ED%9A%8C%EC%88%98-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84-%EC%A1%B0%ED%9A%8C%EC%88%98-%EC%A4%91%EB%B3%B5-%EB%B0%A9%EC%A7%80
        Cookie oldCookie = null;
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("boardView")) {
                    oldCookie = cookie;
                }
            }
        }
        if (oldCookie != null) {
            if (!oldCookie.getValue().contains("[" + boardId.toString() + "]")) {
                boardService.updateViews(boardId);
                oldCookie.setValue(oldCookie.getValue() + "_[" + boardId + "]");
                oldCookie.setPath("/");
                oldCookie.setMaxAge(60 * 60 * 24);
                res.addCookie(oldCookie);
            }
        } else {
            boardService.updateViews(boardId);
            Cookie newCookie = new Cookie("boardView", "[" + boardId + "]");
            newCookie.setPath("/");
            newCookie.setMaxAge(60 * 60 * 24);
            res.addCookie(newCookie);
        }

        // boardService.updateViews(boardId);
    }

    // 좋아요
    @PutMapping("like")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> like(@RequestBody Map<String, Object> req,
                                    Authentication authentication) {
        return boardService.like(req, authentication);
    }

}
