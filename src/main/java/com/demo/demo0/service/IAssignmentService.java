package com.demo.demo0.service;

import com.demo.demo0.pojo.Assignment;
import com.demo.demo0.pojo.dto.AssignmentDto;

import java.util.List;

public interface  IAssignmentService {
    Assignment add(AssignmentDto assignment);
    void delete(Integer id);
    Assignment update(AssignmentDto assignment);
    Assignment getById(Integer id);

    List<Assignment> list();
}