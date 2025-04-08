package com.demo.demo0.service;

import com.demo.demo0.pojo.Assignment;
import com.demo.demo0.pojo.dto.AssignmentDto;
import com.demo.demo0.repo.AssignmentRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService implements IAssignmentService {
    @Autowired
    AssignmentRepo assignmentRepo;

    @Override
    public Assignment add(AssignmentDto assignmentDto) {
        Assignment newAssignment = new Assignment();
        BeanUtils.copyProperties(assignmentDto, newAssignment);
        return assignmentRepo.save(newAssignment);
    }

    @Override
    public void delete(Integer id) {
        assignmentRepo.deleteById(id);
    }

    @Override
    public Assignment update(AssignmentDto assignmentDto) {
        Assignment newAssignment = new Assignment();
        BeanUtils.copyProperties(assignmentDto, newAssignment);
        return assignmentRepo.save(newAssignment);
    }

    @Override
    public Assignment getById(Integer id) {
        return assignmentRepo.findById(id).orElse(null);
    }

    @Override
    public List<Assignment> list() {
        return (List<Assignment>) assignmentRepo.findAll();
    }
}