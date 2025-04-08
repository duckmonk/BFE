package com.demo.demo0.controller;

import com.demo.demo0.pojo.ResponseMessage;
import com.demo.demo0.pojo.Assignment;
import com.demo.demo0.pojo.dto.AssignmentDto;
import com.demo.demo0.service.IAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignment")
public class AssignmentController {
    @Autowired
    IAssignmentService assignmentService;

    @PostMapping("/upsert")
    public ResponseMessage<Assignment> upsertAssignment(@RequestBody AssignmentDto assignmentDto) {
        Assignment assignment = assignmentService.add(assignmentDto);
        return ResponseMessage.success(assignment);
    }

    @PostMapping("/delete")
    public ResponseMessage<String> deleteAssignment(@RequestBody Integer id) {
        assignmentService.delete(id);
        return ResponseMessage.success("delete success");
    }

    @GetMapping("/get")
    public ResponseMessage<Assignment> getAssignment(@RequestParam Integer id) {
        return ResponseMessage.success(assignmentService.getById(id));
    }

    @GetMapping("/list")
    public ResponseMessage<List<Assignment>> listAssignment() {
        return ResponseMessage.success(assignmentService.list());
    }

}