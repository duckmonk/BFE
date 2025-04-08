package com.demo.demo0.controller;

import com.demo.demo0.pojo.ResponseMessage;
import com.demo.demo0.pojo.InfoCollection;
import com.demo.demo0.pojo.dto.InfoCollectionDto;
import com.demo.demo0.service.IInfoCollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/infoCollection")
public class InfoCollectionController {
    @Autowired
    IInfoCollectionService infoCollectionService;

    @PostMapping("/upsert")
    public ResponseMessage<InfoCollection> upsertInfoCollection(@RequestBody InfoCollectionDto infoCollectionDto) {
        InfoCollection infoCollection = infoCollectionService.add(infoCollectionDto);
        return ResponseMessage.success(infoCollection);
    }

    @PostMapping("/delete")
    public ResponseMessage<String> deleteInfoCollection(@RequestBody Integer id) {
        infoCollectionService.delete(id);
        return ResponseMessage.success("delete success");
    }

    @GetMapping("/get")
    public ResponseMessage<InfoCollection> getInfoCollection(@RequestParam Integer id) {
        return ResponseMessage.success(infoCollectionService.getById(id));
    }

    @GetMapping("/list")
    public ResponseMessage<List<InfoCollection>> listInfoCollection() {
        return ResponseMessage.success(infoCollectionService.list());
    }

}