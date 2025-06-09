package com.bfe.project;

import com.bfe.project.entity.User;
import com.bfe.project.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.Assert;

import java.util.List;

@SpringBootTest
class Demo0ApplicationTests {


    @Autowired
    private UserMapper userMapper;

    // @Test
    // public void testSelect() {
    //     System.out.println(("----- selectAll method test ------"));
    //     List<User> userList = userMapper.selectList(null);
    //     Assert.isTrue(4 == userList.size(), "");
    //     userList.forEach(System.out::println);
    // }

    @Test
    void contextLoads() {
    }

}
