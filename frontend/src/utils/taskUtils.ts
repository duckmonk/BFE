export const getEnabledTasks = (tasksStatus: { [key: string]: boolean } | null) => {
  if (!tasksStatus) return new Set<string>();

  const enabled = new Set<string>();
  // Endeavor Submission is always the first task, add it unconditionally
  enabled.add('endeavor_submission');

  if (!tasksStatus) {
      return enabled; // Return set with only endeavor_submission if status is not loaded yet
  }

  // Task 2: National Importance and Task 3: Future Plan are enabled after Endeavor Submission is complete
  if (tasksStatus.endeavor_submission) {
    enabled.add('national_importance');
    enabled.add('future_plan');
  }
  // Task 4: Substantial Merits is enabled after National Importance is complete
  if (tasksStatus.national_importance) {
    enabled.add('substantial_merits');
  }
  // Task 5: Recommendation Letters is enabled after Future Plan is complete
  if (tasksStatus.future_plan) {
    enabled.add('recommendation_letters');
  }
  // Task 6: Well Positioned is enabled after Future Plan, Substantial Merits, and Recommendation Letters are complete
  if (tasksStatus.future_plan && tasksStatus.substantial_merits && tasksStatus.recommendation_letters) {
    enabled.add('well_positioned');
  }
  // Task 7: Balancing Factors is enabled after Well Positioned is complete
  if (tasksStatus.well_positioned) {
    enabled.add('balancing_factors');
  }
  // Task 8: Final Questionnaire is enabled after all other tasks are complete
  if (tasksStatus.endeavor_submission && 
      tasksStatus.national_importance && 
      tasksStatus.future_plan && 
      tasksStatus.substantial_merits && 
      tasksStatus.recommendation_letters && 
      tasksStatus.well_positioned && 
      tasksStatus.balancing_factors) {
    enabled.add('final_questionnaire');
  }

  return enabled;
}; 