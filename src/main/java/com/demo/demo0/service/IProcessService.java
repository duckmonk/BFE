package com.demo.demo0.service;

import com.demo.demo0.pojo.Process;
import com.demo.demo0.pojo.dto.ProcessDto;

import java.util.List;

public interface  IProcessService {
    Process add(ProcessDto process);
    void delete(Integer id);
    Process update(ProcessDto process);
    Process getById(Integer id);

    List<Process> list();
}