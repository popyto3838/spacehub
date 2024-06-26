package com.backend.favorites.service;

import com.backend.favorites.domain.Favorites;

import java.util.List;

public interface FavoritesService {
    void insert(Favorites favorites);

    Favorites selectByFavoritesId(Integer favoritesId);

    List<Favorites> selectAll();

    int update(Favorites favorites);

    int deleteByFavoritesId(Integer favoritesId);
}
