package com.demo.demo0.repo;

import com.demo.demo0.pojo.Inquiry;
import com.demo.demo0.pojo.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InquiryRepo extends CrudRepository<Inquiry, Integer> {
}
