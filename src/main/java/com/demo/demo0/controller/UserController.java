package com.demo.demo0.controller;

import com.demo.demo0.pojo.ResponseMessage;
import com.demo.demo0.pojo.User;
import com.demo.demo0.pojo.dto.UserDto;
import com.demo.demo0.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    IUserService userService;

    @PostMapping("/upsert")
    public ResponseMessage<User> upsertUser(@RequestBody UserDto userDto) {
        User user = userService.add(userDto);
        return ResponseMessage.success(user);
    }

    @PostMapping("/delete")
    public ResponseMessage<String> deleteUser(@RequestBody Integer id) {
        userService.delete(id);
        return ResponseMessage.success("delete success");
    }

    @GetMapping("/get")
    public ResponseMessage<User> getUser(@RequestParam Integer id) {
        return ResponseMessage.success(userService.getById(id));
    }

    @GetMapping("/list")
    public ResponseMessage<List<User>> listUser() {
        return ResponseMessage.success(userService.list());
    }

}