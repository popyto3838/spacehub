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
    public Favorites selectByFavoritesId(Integer favoritesId) {
        return favoritesMapper.selectByFavoritesId(favoritesId);
    }

    @Override
    public List<Favorites> selectAll() {
        return favoritesMapper.selectAll();
    }

    @Override
    public int update(Favorites favorites) {
        return favoritesMapper.update(favorites);
    }

    @Override
    public int deleteByFavoritesId(Integer favoritesId) {
        return favoritesMapper.deleteByFavoritesId(favoritesId);
    }
}
