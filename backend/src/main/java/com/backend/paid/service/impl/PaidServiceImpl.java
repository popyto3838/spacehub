package com.backend.paid.service.impl;

import com.backend.paid.domain.Paid;
import com.backend.paid.mapper.PaidMapper;
import com.backend.paid.service.PaidService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
public class PaidServiceImpl implements PaidService {
    private final PaidMapper paidMapper;

    @Override
    public List<Paid> list() {
        return paidMapper.selectAll();
    }

    @Override
    public Paid view(Integer paidId) {
        return paidMapper.selectByPaidId(paidId);
    }

    @Override
    public void insert(Paid paid) {
        paidMapper.insert(paid);
    }

    @Override
    public void update(Paid paid) {
        paidMapper.update(paid);
    }

    @Override
    public void delete(Integer paidId) {
        paidMapper.deleteByPaidId(paidId);
    }
}
