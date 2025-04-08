package com.demo.demo0.service;

import com.demo.demo0.pojo.InfoCollection;
import com.demo.demo0.pojo.User;
import com.demo.demo0.pojo.dto.InfoCollectionDto;
import com.demo.demo0.pojo.dto.UserDto;

import java.util.List;

public interface  IInfoCollectionService {
    InfoCollection add(InfoCollectionDto infoCollection);
    void delete(Integer id);
    InfoCollection update(InfoCollectionDto infoCollection);
    InfoCollection getById(Integer id);

    List<InfoCollection> list();
}