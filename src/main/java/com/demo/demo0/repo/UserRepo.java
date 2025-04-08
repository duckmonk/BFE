package com.demo.demo0.repo;

import com.demo.demo0.pojo.User;
import com.demo.demo0.pojo.dto.UserDto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends CrudRepository<User, Integer> {
}
