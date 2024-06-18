package com.backend.space.controller;

import com.backend.space.service.impl.SpaceServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space")
public class SpaceController {

    private final SpaceServiceImpl service;

    @PostMapping("insert")
    public void add(@RequestBody Map<String, Object> map,
                    @RequestParam(value = "files[]" , required = false) MultipartFile[] files) {
        System.out.println("map = " + map.toString());
        System.out.println("files = " + files);
//        service.insert();
    }
}
/*
{
  "space": {
    "type": "호텔",
    "title": "호텔이름",
    "subTitle": "호텔 소개",
    "location": "서울시 마포구 연남로 30 (연남동, 코오롱하늘채아파트)",
    "introduce": "123",
    "facility": "123",
    "notice": "123",
    "price": 480000,
    "capacity": 662,
    "floor": 68,
    "parkingSpace": 30
  },
  "spaceConfigurations": [
    { "typeListId": 1 }, // 예시 typeListId
    { "optionListId": 1 }, // 예시 optionListId
    { "optionListId": 2 } // 예시 optionListId
  ],
  "files": [
    { "fileName": "image1.jpg", "fileSize": 12345, "fileType": "image/jpeg" },
    { "fileName": "image2.png", "fileSize": 54321, "fileType": "image/png" },
    { "fileName": "image3.gif", "fileSize": 67890, "fileType": "image/gif" }
  ]
}

*/