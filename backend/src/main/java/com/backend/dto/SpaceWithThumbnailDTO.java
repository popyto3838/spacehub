package com.backend.dto;

import com.backend.space.domain.Space;
import lombok.Data;

@Data
public class SpaceWithThumbnailDTO {

    private Space space;
    private String thumbnailPath;

}
