package com.backend.space.domain;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class SpaceDTO {
    private int memberId;
    private Space space;
    private List<Integer> optionList;
}