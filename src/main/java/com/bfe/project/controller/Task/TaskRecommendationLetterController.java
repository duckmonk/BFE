package com.bfe.project.controller.Task;

import com.bfe.project.entity.Task.TaskRecommendationLetter;
import com.bfe.project.service.Task.TaskRecommendationLetterService;
import com.bfe.project.controller.InfoColl.InfoCollRecommenderController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/task/recommendation-letter")
public class TaskRecommendationLetterController {

    @Autowired
    private TaskRecommendationLetterService recommendationLetterService;
    
    @Autowired
    private InfoCollRecommenderController infoCollRecommenderController;

    @GetMapping("/case/{caseId}")
    @Transactional(rollbackFor = Exception.class)
    public List<Map<String, Object>> getRecommendationLetters(@PathVariable("caseId") Integer caseId) {
        // 1. 获取所有推荐信
        List<TaskRecommendationLetter> existingLetters = recommendationLetterService.lambdaQuery()
                .eq(TaskRecommendationLetter::getClientCaseId, caseId)
                .list();

        // 2. 获取推荐人信息
        Map<String, Object> response = infoCollRecommenderController.getRecommenderNames(caseId);
        System.out.println("getRecommenderNames response: " + response);
        
        if (response == null || !response.containsKey("recommenders")) {
            System.out.println("response is null or does not contain 'recommenders' key");
            return new ArrayList<>();
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> recommenders = (List<Map<String, Object>>) response.get("recommenders");
        System.out.println("recommenders: " + recommenders);
        
        if (recommenders.isEmpty()) {
            System.out.println("recommenders is empty");
            return new ArrayList<>();
        }
        
        // 3. 按推荐人姓名分组现有推荐信
        Map<String, TaskRecommendationLetter> letterMap = existingLetters.stream()
                .collect(Collectors.toMap(
                    TaskRecommendationLetter::getRlRefereeName,
                    letter -> letter,
                    (existing, replacement) -> existing
                ));

        // 4. 处理推荐信
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> recommender : recommenders) {
            String refereeName = (String) recommender.get("name");
            Integer refereeId = (Integer) recommender.get("id");
            
            TaskRecommendationLetter letter = letterMap.get(refereeName);
            if (letter == null) {
                // 如果没有推荐信，创建新的
                letter = new TaskRecommendationLetter();
                letter.setClientCaseId(caseId);
                letter.setRlRefereeName(refereeName);
                letter.setRlDraft("");
                letter.setRlOverallFeedback("");
                letter.setRlConfirm("");
                letter.setRlSignedLetter("");
                recommendationLetterService.save(letter);
            }
            
            // 添加到结果列表
            Map<String, Object> letterInfo = new HashMap<>();
            letterInfo.put("id", letter.getId());
            letterInfo.put("clientCaseId", letter.getClientCaseId());
            letterInfo.put("refereeName", refereeName);
            letterInfo.put("refereeId", refereeId);
            letterInfo.put("recommendationLetter", letter.getRlDraft());
            letterInfo.put("feedback", letter.getRlOverallFeedback());
            letterInfo.put("confirm", letter.getRlConfirm());
            letterInfo.put("signedLetter", letter.getRlSignedLetter());
            result.add(letterInfo);
        }

        // 5. 删除多余的推荐信
        Set<String> validRefereeNames = recommenders.stream()
                .map(r -> (String) r.get("name"))
                .collect(Collectors.toSet());
                
        List<TaskRecommendationLetter> lettersToDelete = existingLetters.stream()
                .filter(letter -> !validRefereeNames.contains(letter.getRlRefereeName()))
                .collect(Collectors.toList());
        
        if (!lettersToDelete.isEmpty()) {
            recommendationLetterService.removeByIds(
                lettersToDelete.stream()
                    .map(TaskRecommendationLetter::getId)
                    .collect(Collectors.toList())
            );
        }

        System.out.println("final result: " + result);
        return result;
    }

    @PostMapping("/upsert")
    @Transactional(rollbackFor = Exception.class)
    public List<Map<String, Object>> submitRecommendationLetters(@RequestBody List<Map<String, Object>> letters) {
        if (letters == null || letters.isEmpty()) {
            return new ArrayList<>();
        }

        // 获取第一个letter的caseId
        Integer caseId = (Integer) letters.get(0).get("clientCaseId");
        
        // 删除现有的推荐信
        recommendationLetterService.lambdaUpdate()
                .eq(TaskRecommendationLetter::getClientCaseId, caseId)
                .remove();

        // 插入新的推荐信
        List<TaskRecommendationLetter> newLetters = letters.stream()
                .map(letter -> {
                    TaskRecommendationLetter newLetter = new TaskRecommendationLetter();
                    newLetter.setClientCaseId(caseId);
                    newLetter.setRlRefereeName((String) letter.get("refereeName"));
                    newLetter.setRlDraft((String) letter.get("rlDraft"));
                    newLetter.setRlOverallFeedback((String) letter.get("rlOverallFeedback"));
                    newLetter.setRlConfirm((String) letter.get("rlConfirm"));
                    newLetter.setRlSignedLetter((String) letter.get("rlSignedLetter"));
                    return newLetter;
                })
                .collect(Collectors.toList());

        recommendationLetterService.saveBatch(newLetters);

        // 返回更新后的数据
        return getRecommendationLetters(caseId);
    }
} 