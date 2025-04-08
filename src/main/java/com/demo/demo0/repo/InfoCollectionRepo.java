package com.demo.demo0.repo;

import com.demo.demo0.pojo.InfoCollection;
import com.demo.demo0.pojo.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InfoCollectionRepo extends CrudRepository<InfoCollection, Integer> {
}
