package com.demo.demo0.service;

import com.demo.demo0.pojo.Task;
import com.demo.demo0.pojo.dto.TaskDto;
import com.demo.demo0.repo.TaskRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService implements ITaskService {
    @Autowired
    TaskRepo taskRepo;

    @Override
    public Task add(TaskDto taskDto) {
        Task newTask = new Task();
        BeanUtils.copyProperties(taskDto, newTask);
        return taskRepo.save(newTask);
    }

    @Override
    public void delete(Integer id) {
        taskRepo.deleteById(id);
    }

    @Override
    public Task update(TaskDto taskDto) {
        Task newTask = new Task();
        BeanUtils.copyProperties(taskDto, newTask);
        return taskRepo.save(newTask);
    }

    @Override
    public Task getById(Integer id) {
        return taskRepo.findById(id).orElse(null);
    }

    @Override
    public List<Task> list() {
        return (List<Task>) taskRepo.findAll();
    }
}