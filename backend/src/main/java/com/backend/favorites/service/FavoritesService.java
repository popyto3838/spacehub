package com.backend.favorites.service;

import com.backend.favorites.domain.Favorites;

import java.util.List;

public interface FavoritesService {
    void insert(Favorites favorites);

    Favorites selectByMemberIdAndSpaceID(Favorites favorites);

    int delete(Favorites favorites);
}
