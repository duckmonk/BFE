package com.demo.demo0.repo;

import com.demo.demo0.pojo.Process;
import com.demo.demo0.pojo.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessRepo extends CrudRepository<Process, Integer> {
}
