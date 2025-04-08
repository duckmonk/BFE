package com.demo.demo0.service;

import com.demo.demo0.pojo.User;
import com.demo.demo0.pojo.dto.UserDto;
import com.demo.demo0.repo.UserRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {
    @Autowired
    UserRepo userRepo;

    @Override
    public User add(UserDto userDto) {
        User newUser = new User();
        BeanUtils.copyProperties(userDto, newUser);
        return userRepo.save(newUser);
    }

    @Override
    public void delete(Integer id) {
        userRepo.deleteById(id);
    }

    @Override
    public User update(UserDto userDto) {
        User newUser = new User();
        BeanUtils.copyProperties(userDto, newUser);
        return userRepo.save(newUser);
    }

    @Override
    public User getById(Integer id) {
        return userRepo.findById(id).orElse(null);
    }

    @Override
    public List<User> list() {
        return (List<User>) userRepo.findAll();
    }
}
