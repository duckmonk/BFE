package com.demo.demo0.controller;

import com.demo.demo0.pojo.ResponseMessage;
import com.demo.demo0.pojo.Process;
import com.demo.demo0.pojo.dto.ProcessDto;
import com.demo.demo0.service.IProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/process")
public class ProcessController {
    @Autowired
    IProcessService processService;

    @PostMapping("/upsert")
    public ResponseMessage<Process> upsertProcess(@RequestBody ProcessDto processDto) {
        Process process = processService.add(processDto);
        return ResponseMessage.success(process);
    }

    @PostMapping("/delete")
    public ResponseMessage<String> deleteProcess(@RequestBody Integer id) {
        processService.delete(id);
        return ResponseMessage.success("delete success");
    }

    @GetMapping("/get")
    public ResponseMessage<Process> getProcess(@RequestParam Integer id) {
        return ResponseMessage.success(processService.getById(id));
    }

    @GetMapping("/list")
    public ResponseMessage<List<Process>> listProcess() {
        return ResponseMessage.success(processService.list());
    }

}