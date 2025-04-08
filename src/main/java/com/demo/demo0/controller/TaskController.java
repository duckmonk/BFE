package com.demo.demo0.controller;

import com.demo.demo0.pojo.ResponseMessage;
import com.demo.demo0.pojo.Task;
import com.demo.demo0.pojo.dto.TaskDto;
import com.demo.demo0.service.ITaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    ITaskService taskService;

    @PostMapping("/upsert")
    public ResponseMessage<Task> upsertTask(@RequestBody TaskDto taskDto) {
        Task task = taskService.add(taskDto);
        return ResponseMessage.success(task);
    }

    @PostMapping("/delete")
    public ResponseMessage<String> deleteTask(@RequestBody Integer id) {
        taskService.delete(id);
        return ResponseMessage.success("delete success");
    }

    @GetMapping("/get")
    public ResponseMessage<Task> getTask(@RequestParam Integer id) {
        return ResponseMessage.success(taskService.getById(id));
    }

    @GetMapping("/list")
    public ResponseMessage<List<Task>> listTask() {
        return ResponseMessage.success(taskService.list());
    }

}