package com.demo.demo0.service;

import com.demo.demo0.pojo.Task;
import com.demo.demo0.pojo.dto.TaskDto;

import java.util.List;

public interface  ITaskService {
    Task add(TaskDto task);
    void delete(Integer id);
    Task update(TaskDto task);
    Task getById(Integer id);

    List<Task> list();
}