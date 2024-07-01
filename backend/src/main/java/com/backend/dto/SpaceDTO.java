package com.backend.dto;

import com.backend.space.domain.Space;
import lombok.Data;

import java.util.List;

@Data
public class SpaceDTO {
    private Space space;
    private List<Integer> optionList;
}