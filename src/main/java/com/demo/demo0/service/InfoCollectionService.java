package com.demo.demo0.service;

import com.demo.demo0.pojo.InfoCollection;
import com.demo.demo0.pojo.User;
import com.demo.demo0.pojo.dto.InfoCollectionDto;
import com.demo.demo0.pojo.dto.UserDto;
import com.demo.demo0.repo.InfoCollectionRepo;
import com.demo.demo0.repo.UserRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InfoCollectionService implements IInfoCollectionService {
    @Autowired
    InfoCollectionRepo infoCollectionRepo;

    @Override
    public InfoCollection add(InfoCollectionDto infoCollectionDto) {
        InfoCollection newInfoCollection = new InfoCollection();
        BeanUtils.copyProperties(infoCollectionDto, newInfoCollection);
        return infoCollectionRepo.save(newInfoCollection);
    }

    @Override
    public void delete(Integer id) {
        infoCollectionRepo.deleteById(id);
    }

    @Override
    public InfoCollection update(InfoCollectionDto infoCollectionDto) {
        InfoCollection newInfoCollection = new InfoCollection();
        BeanUtils.copyProperties(infoCollectionDto, newInfoCollection);
        return infoCollectionRepo.save(newInfoCollection);
    }

    @Override
    public InfoCollection getById(Integer id) {
        return infoCollectionRepo.findById(id).orElse(null);
    }

    @Override
    public List<InfoCollection> list() {
        return (List<InfoCollection>) infoCollectionRepo.findAll();
    }
}