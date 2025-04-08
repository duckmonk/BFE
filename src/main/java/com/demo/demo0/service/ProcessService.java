package com.demo.demo0.service;

import com.demo.demo0.pojo.Process;
import com.demo.demo0.pojo.dto.ProcessDto;
import com.demo.demo0.repo.ProcessRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProcessService implements IProcessService {
    @Autowired
    ProcessRepo processRepo;

    @Override
    public Process add(ProcessDto processDto) {
        Process newProcess = new Process();
        BeanUtils.copyProperties(processDto, newProcess);
        return processRepo.save(newProcess);
    }

    @Override
    public void delete(Integer id) {
        processRepo.deleteById(id);
    }

    @Override
    public Process update(ProcessDto processDto) {
        Process newProcess = new Process();
        BeanUtils.copyProperties(processDto, newProcess);
        return processRepo.save(newProcess);
    }

    @Override
    public Process getById(Integer id) {
        return processRepo.findById(id).orElse(null);
    }

    @Override
    public List<Process> list() {
        return (List<Process>) processRepo.findAll();
    }
}