package com.backend.board.service.impl;

import com.backend.board.domain.Board;
import com.backend.board.mapper.BoardMapper;
import com.backend.board.service.BoardService;
import com.backend.fileList.domain.FileList;
import com.backend.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    final BoardMapper boardMapper;
    private final MemberMapper memberMapper;

    @Override
    public void insert(Board board, Authentication authentication, MultipartFile[] files) throws IOException {
        // authentication에 들어가있는 email을 통해 사용자의 정보를 가져옴
        board.setMemberId(Integer.valueOf(authentication.getName()));

        boardMapper.insert(board);

        // 게시물 파일 첨부
        if (files != null) {
            for (MultipartFile file : files) {
                // db에 파일 저장
                boardMapper.insertFileList(board.getBoardId(), file.getOriginalFilename());
                // 실제 파일 저장
                String dir = STR."C:/Temp/prj3p/\{board.getBoardId()}"; // 부모 디렉토리(폴더)
                File dirFile = new File(dir);
                if (!dirFile.exists()) {
                    dirFile.mkdirs();
                }
                // 파일 경로
                String path = STR."C:/Temp/prj3p/\{board.getBoardId()}/\{file.getOriginalFilename()}";
                // 저장 위치 명시
                File destination = new File(path);
                // transferTo : 인풋스트림, 아웃풋스트림을 꺼내서 하드디스크에 저장
                file.transferTo(destination); // checked exception 처리
            }
        }
    }

    @Override
    public Map<String, Object> list(Integer page, String searchType, String searchKeyword) {

        Map pageInfo = new HashMap();
        Integer countAll = boardMapper.countAllWithSearch(searchType, searchKeyword);

        Integer offset = (page - 1) * 10;
        Integer lastPageNumber = (countAll - 1) / 10 + 1;
        Integer leftPageNumber = (page - 1) / 10 * 10 + 1;
        Integer rightPageNumber = leftPageNumber + 9;
        Integer prevPageNumber = leftPageNumber - 1;
        Integer nextPgeNumber = rightPageNumber + 1;
        rightPageNumber = Math.min(rightPageNumber, lastPageNumber);
        leftPageNumber = rightPageNumber - 9;
        leftPageNumber = Math.max(leftPageNumber, 1);

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

        return Map.of("pageInfo", pageInfo, "boardList", boardMapper.selectAllPaging(offset, searchType, searchKeyword),
                "categoryList", boardMapper.selectAllPagingForCategory(offset, searchType, searchKeyword));
    }

    @Override
    public Board view(Integer boardId) {
        // 하나의 게시물 조회
        Board board = boardMapper.selectByBoardId(boardId);
        // fileNames에서 파일 이름 조회
        List<String> fileNames = boardMapper.selectByFileNameByBoardId(boardId);
        // 파일 경로 저장
        List<FileList> files = fileNames.stream()
                .map(fileName -> {
                    var fl = new FileList();
                    fl.setFileName(fileName);
                    fl.setSrc(STR."http://172.27.128.1:8888/\{boardId}/\{fileName}");
                    return fl;
                })
                .toList();
        // board에 이미지 경로 넣어줌
        System.out.println("files = " + files);
        System.out.println("fileNames = " + fileNames);
        System.out.println("board = " + board);
        board.setFilesLists(files);

        return board;
    }


    @Override
    public void update(Board board) {
        boardMapper.update(board);
    }

    @Override
    public void delete(Integer boardId) {
        // file명 조회
        List<String> fileNames = boardMapper.selectByFileNameByBoardId(boardId);
        // disk에 있는 file 삭제
        String dir = STR."C:/Temp/prj3p/\{boardId}";
        for (String fileName : fileNames) {
            File file = new File(dir + fileName);
            file.delete();
        }
        // 필요없는 부모 디렉토리 삭제
        File dirFile = new File(dir);
        if (dirFile.exists()) {
            dirFile.delete();
        }
        // File 테이블 지움
        boardMapper.deleteFileByBoardId(boardId);

        boardMapper.deleteByBoardId(boardId);
    }

    @Override
    public void updateViews(Integer boardId) {
        boardMapper.updateViews(boardId);
    }

}
