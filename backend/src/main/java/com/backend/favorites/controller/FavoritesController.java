package com.backend.favorites.controller;

import com.backend.favorites.domain.Favorites;
import com.backend.favorites.service.FavoritesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Log4j2
public class FavoritesController {


    private final FavoritesService favoritesService;

    @PostMapping("/insert")
    public ResponseEntity<Favorites> createFavorite(@RequestBody Favorites favorites) {
        favoritesService.insert(favorites);
        return ResponseEntity.ok(favorites);
    }


    @GetMapping("/get")
    public ResponseEntity<Favorites> getFavorites(Favorites favoritesDTO) {
        Favorites favorites = favoritesService.selectByMemberIdAndSpaceID(favoritesDTO);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/myFavoritesList/{memberId}")
    public ResponseEntity<List<Favorites>> selectAllByMemberId(@PathVariable("memberId") Integer memberId) {
        log.info("memberId: " + memberId);
        List<Favorites> list = favoritesService.selectAllByMemberId(memberId);
        if (list == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }


    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteFavorite(Favorites favorites) {
        int deleteCount = favoritesService.delete(favorites);
        if (deleteCount > 0) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
