package com.bfe.project.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bfe.project.entity.User;
import com.bfe.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    // 测试登录，浏览器访问： http://localhost:8081/user/doLogin?email=zhang&password=123456
    @RequestMapping("doLogin")
    public Map<String, Object> doLogin(String email, String password) {
        Map<String, Object> result = new HashMap<>();
        try {
            User user = getByEmail(email);
            if (user == null) {
                result.put("status", "error");
                result.put("message", "用户不存在");
                return result;
            }
            
            if (!user.getPassword().equals(password)) {
                result.put("status", "error");
                result.put("message", "密码错误");
                return result;
            }
            
            StpUtil.login(user.getId());
            result.put("status", "success");
            result.put("userType", user.getUserType());
            result.put("userId", user.getId());
            result.put("userName", user.getName());
            System.out.println("登录成功: " + StpUtil.getLoginIdAsInt());
            return result;
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return result;
        }
    }

    // 登出接口，浏览器访问： http://localhost:8081/user/logout
    @RequestMapping("logout")
    public String logout() {
        try {
            StpUtil.logout();
            return "success";
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "error";
        }
    }

    // 查询登录状态，浏览器访问： http://localhost:8081/user/isLogin
    @RequestMapping("isLogin")
    public String isLogin() {
        try {
            return "当前会话登录：" + StpUtil.getLoginIdAsInt();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return e.getMessage();
        }
    }

    @GetMapping("/list")
    public List<User> list() {
        List<User> users = userService.list();
        System.out.println("查询到的用户数量: " + users.size());
        users.forEach(user -> System.out.println("用户信息: " + user));
        return users;
    }

    @GetMapping("/page")
    public Page<User> page(@RequestParam(defaultValue = "1") Integer current,
                          @RequestParam(defaultValue = "10") Integer size) {
        return userService.page(new Page<>(current, size));
    }

    @PostMapping("/save")
    public boolean save(@RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping("/update")
    public boolean update(@RequestBody User user) {
        return userService.updateById(user);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Integer id) {
        return userService.removeById(id);
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Integer id) {
        return userService.getById(id);
    }

    private User getByEmail(String email) {
        return userService.lambdaQuery()
                .eq(User::getEmail, email)
                .one();
    }
} 