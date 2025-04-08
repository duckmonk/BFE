package com.demo.demo0.repo;

import com.demo.demo0.pojo.Task;
import com.demo.demo0.pojo.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepo extends CrudRepository<Task, Integer> {
}
