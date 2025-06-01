package com.bfe.project.controller.Task;

import com.bfe.project.entity.Task.*;
import com.bfe.project.service.Task.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/task/center")
public class TaskCenterController {

    @Autowired
    private TaskRecommendationLetterService recommendationLetterService;
    
    @Autowired
    private TaskWellPositionedService wellPositionedService;
    
    @Autowired
    private TaskBalancingFactorsService balancingFactorsService;
    
    @Autowired
    private TaskSubstantialMeritsService substantialMeritsService;
    
    @Autowired
    private TaskFuturePlanService futurePlanService;
    
    @Autowired
    private TaskNationalImportanceService nationalImportanceService;
    
    @Autowired
    private TaskEndeavorSubmissionService endeavorSubmissionService;

    @Autowired
    private TaskFinalQuestionnaireService taskFinalQuestionnaireService;

    private Map<String, Boolean> getTasksStatusMap(Integer caseId) {
        Map<String, Boolean> result = new HashMap<>();

        TaskEndeavorSubmission endeavorSubmission = endeavorSubmissionService.lambdaQuery()
                .eq(TaskEndeavorSubmission::getClientCaseId, caseId)
                .one();
        result.put("endeavor_submission", endeavorSubmission != null && "YES".equals(endeavorSubmission.getEndeavorConfirm()));
        
        TaskNationalImportance nationalImportance = nationalImportanceService.lambdaQuery()
                .eq(TaskNationalImportance::getClientCaseId, caseId)
                .one();
        result.put("national_importance", nationalImportance != null && "YES".equals(nationalImportance.getProng1NiConfirmation()));

        TaskFuturePlan futurePlan = futurePlanService.lambdaQuery()
                .eq(TaskFuturePlan::getClientCaseId, caseId)
                .one();
        result.put("future_plan", futurePlan != null && "YES".equals(futurePlan.getFutureplanConfirm()));
        
        TaskSubstantialMerits substantialMerits = substantialMeritsService.lambdaQuery()
                .eq(TaskSubstantialMerits::getClientCaseId, caseId)
                .one();
        result.put("substantial_merits", substantialMerits != null && "YES".equals(substantialMerits.getProng1SmConfirm()));
        
        List<TaskRecommendationLetter> recommendationLetters = recommendationLetterService.lambdaQuery()
                .eq(TaskRecommendationLetter::getClientCaseId, caseId)
                .list();
        boolean allRecommendationLettersConfirmed = recommendationLetters.stream()
                .allMatch(letter -> "YES".equals(letter.getRlConfirm()));
        result.put("recommendation_letters", allRecommendationLettersConfirmed);
        
        TaskWellPositioned wellPositioned = wellPositionedService.lambdaQuery()
                .eq(TaskWellPositioned::getClientCaseId, caseId)
                .one();
        result.put("well_positioned", wellPositioned != null && "YES".equals(wellPositioned.getProng2WpConfirm()));
        
        TaskBalancingFactors balancingFactors = balancingFactorsService.lambdaQuery()
                .eq(TaskBalancingFactors::getClientCaseId, caseId)
                .one();
        result.put("balancing_factors", balancingFactors != null && "YES".equals(balancingFactors.getProng3BfConfirm()));

        TaskFinalQuestionnaire finalQuestionnaire = taskFinalQuestionnaireService.lambdaQuery()
                .eq(TaskFinalQuestionnaire::getClientCaseId, caseId)
                .one();
        result.put("final_questionnaire", finalQuestionnaire != null && "YES".equals(finalQuestionnaire.getFinalQuestionnaireConfirm()));
        
        return result;
    }

    @GetMapping("/tasks-status/{caseId}")
    public Map<String, Boolean> getTasksStatus(@PathVariable("caseId") Integer caseId) {
        return getTasksStatusMap(caseId);
    }
} 