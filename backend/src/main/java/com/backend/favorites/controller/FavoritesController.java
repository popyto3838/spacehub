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
        log.info("===============Create favorites{}",favorites);
        favoritesService.insert(favorites);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/{favoritesId}")
    public ResponseEntity<Favorites> getFavoriteById(@PathVariable Integer favoritesId) {
        Favorites favorite = favoritesService.selectByFavoritesId(favoritesId);
        if (favorite != null) {
            return ResponseEntity.ok(favorite);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<Favorites>> getAllFavorites() {
        List<Favorites> favorites = favoritesService.selectAll();
        return ResponseEntity.ok(favorites);
    }

    @PutMapping("update/{favoritesId}")
    public ResponseEntity<Favorites> updateFavorite(@PathVariable Integer favoritesId, @RequestBody Favorites favorites) {
        favorites.setFavoritesId(favoritesId);
        int updateCount = favoritesService.update(favorites);
        if (updateCount > 0) {
            return ResponseEntity.ok(favorites);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("delete/{favoritesId}")
    public ResponseEntity<Void> deleteFavorite(@PathVariable Integer favoritesId) {
        int deleteCount = favoritesService.deleteByFavoritesId(favoritesId);
        if (deleteCount > 0) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
