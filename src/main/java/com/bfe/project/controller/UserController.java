package com.bfe.project.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bfe.project.entity.Inquiry;
import com.bfe.project.entity.User;
import com.bfe.project.service.InquiryService;
import com.bfe.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private InquiryService inquiryService;

    // 测试登录，浏览器访问： http://localhost:8081/user/doLogin?email=zhang&password=123456
    @RequestMapping("doLogin")
    public Map<String, Object> doLogin(String email, String password) {
        Map<String, Object> result = new HashMap<>();
        try {
            User user = getByEmail(email);
            if (user == null) {
                result.put("status", "error");
                result.put("message", "User does not exist");
                return result;
            }
            
            if (!user.getPassword().equals(password)) {
                result.put("status", "error");
                result.put("message", "Password is incorrect");
                return result;
            }
            
            StpUtil.login(user.getId());
            result.put("status", "success");
            result.put("userType", user.getUserType());
            result.put("userId", user.getId());
            result.put("userName", user.getName());
            result.put("email", user.getEmail());
            System.out.println("Login successfully: " + StpUtil.getLoginIdAsInt());
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
            return "Current session login: " + StpUtil.getLoginIdAsInt();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return e.getMessage();
        }
    }

    @GetMapping("/list")
    public List<User> list() {
        List<User> users = userService.list();
        System.out.println("Number of users found: " + users.size());
        users.forEach(user -> System.out.println("User information: " + user));
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

    @PostMapping("/createByInquiry")
    public Map<String, Object> createUserByInquiry(@RequestBody Map<String, Object> data) {
        // 生成10位随机密码
        String password = generateRandomPassword(10);
        
        // 创建用户
        User user = new User();
        user.setName((String) data.get("name"));
        user.setEmail((String) data.get("email"));
        user.setPassword(password);
        user.setUserType("client");
        userService.save(user);
        
        // 更新inquiry
        Integer inquiryId = (Integer) data.get("inquiryId");
        Inquiry inquiry = inquiryService.getById(inquiryId);
        inquiry.setUserId(user.getId());
        inquiry.setAttorneyApprovedTsInq(System.currentTimeMillis() / 1000);
        inquiryService.updateById(inquiry);
        
        return Map.of(
            "status", "success",
            "userId", user.getId(),
            "password", password,
            "name", user.getName(),
            "email", user.getEmail()
        );
    }
    
    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private User getByEmail(String email) {
        return userService.lambdaQuery()
                .eq(User::getEmail, email)
                .one();
    }

    @PostMapping("/resetPassword")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> data) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 获取当前登录用户
            Integer userId = StpUtil.getLoginIdAsInt();
            User user = userService.getById(userId);

            String oldPassword = data.get("oldPassword");
            String newPassword = data.get("newPassword");

            if (!user.getPassword().equals(oldPassword)) {
                result.put("status", "error");
                result.put("message", "Old password is incorrect");
                return result;
            }

            user.setPassword(newPassword);
            userService.updateById(user);

            result.put("status", "success");
            result.put("message", "Password reset successfully");
            return result;
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return result;
        }
    }

    // Create staff user endpoint
    @PostMapping("/create")
    public boolean createStaffUser(@RequestBody User staffUser) {
        try {
            // Assume userService.save(staffUser) handles password encryption, permission, and validation internally or these are handled elsewhere (e.g., UserService or global exception handler)
            return userService.save(staffUser);
        } catch (Exception e) {
            // Log the error or handle it as needed
            e.printStackTrace();
            return false; // Return false on exception
        }
    }

    // New endpoint to get all lawyers
    @GetMapping("/lawyers")
    public List<User> getAllLawyers() {
        try {
            return userService.lambdaQuery()
                    .eq(User::getUserType, "lawyer")
                    .list();
        } catch (Exception e) {
            System.err.println("Error fetching lawyers: " + e.getMessage());
            return new java.util.ArrayList<>();
        }
    }

    // New endpoint to get all employees
    @GetMapping("/employees")
    public List<User> getAllEmployees() {
        try {
            return userService.lambdaQuery()
                    .eq(User::getUserType, "employee")
                    .list();
        } catch (Exception e) {
            System.err.println("Error fetching employees: " + e.getMessage());
            return new java.util.ArrayList<>();
        }
    }

}
