package com.demo.demo0.service;

import com.demo.demo0.pojo.User;
import com.demo.demo0.pojo.dto.UserDto;

import java.util.List;

public interface  IUserService {
    User add(UserDto user);
    void delete(Integer id);
    User update(UserDto user);
    User getById(Integer id);

    List<User> list();
}
