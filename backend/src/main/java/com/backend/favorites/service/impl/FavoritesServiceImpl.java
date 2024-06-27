package com.backend.favorites.service.impl;

import com.backend.favorites.domain.Favorites;
import com.backend.favorites.mapper.FavoritesMapper;
import com.backend.favorites.service.FavoritesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
public class FavoritesServiceImpl implements FavoritesService {

    private final FavoritesMapper favoritesMapper;

    @Override
    public void insert(Favorites favorites) {
        favoritesMapper.insert(favorites);
    }

    @Override
    public Favorites selectByMemberIdAndSpaceID(Favorites favorites) {
        return favoritesMapper.selectByMemberIdAndSpaceID(favorites);
    }

    @Override
    public int delete(Favorites favorites) {
        return favoritesMapper.delete(favorites);
    }
}
