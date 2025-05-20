package com.bfe.project.controller.InfoColl;

import com.bfe.project.entity.InfoColl.InfoCollNiwPetition;
import com.bfe.project.entity.InfoColl.InfoCollAcademicContribution;
import com.bfe.project.entity.InfoColl.InfoCollAcademicFunding;
import com.bfe.project.entity.InfoColl.InfoCollAcademicPolicyImpact;
import com.bfe.project.entity.InfoColl.InfoCollAcademicPublication;
import com.bfe.project.entity.InfoColl.InfoCollAcademicIndustryAdoption;
import com.bfe.project.entity.InfoColl.InfoCollAcademicSupplementalEvidence;
import com.bfe.project.entity.InfoColl.InfoCollIndustryContribution;
import com.bfe.project.entity.InfoColl.InfoCollIndustrySupplementalEvidence;
import com.bfe.project.entity.InfoColl.InfoCollIndustryProjectEvidence;
import com.bfe.project.entity.InfoColl.InfoCollIndustryApplicantProof;
import com.bfe.project.service.InfoColl.InfoCollNiwPetitionService;
import com.bfe.project.service.InfoColl.InfoCollAcademicContributionService;
import com.bfe.project.service.InfoColl.InfoCollAcademicFundingService;
import com.bfe.project.service.InfoColl.InfoCollAcademicPolicyImpactService;
import com.bfe.project.service.InfoColl.InfoCollAcademicPublicationService;
import com.bfe.project.service.InfoColl.InfoCollAcademicIndustryAdoptionService;
import com.bfe.project.service.InfoColl.InfoCollAcademicSupplementalEvidenceService;
import com.bfe.project.service.InfoColl.InfoCollIndustryContributionService;
import com.bfe.project.service.InfoColl.InfoCollIndustryProjectEvidenceService;
import com.bfe.project.service.InfoColl.InfoCollIndustrySupplementalEvidenceService;
import com.bfe.project.service.InfoColl.InfoCollIndustryApplicantProofService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/info-coll/niw-petition")
public class InfoCollNiwPetitionController {

    @Autowired
    private InfoCollNiwPetitionService niwPetitionService;
    
    @Autowired
    private InfoCollAcademicContributionService contributionService;
    
    @Autowired
    private InfoCollAcademicFundingService fundingService;

    @Autowired
    private InfoCollAcademicPolicyImpactService policyImpactService;
    
    @Autowired
    private InfoCollAcademicPublicationService publicationService;

    @Autowired
    private InfoCollAcademicIndustryAdoptionService industryAdoptionService;

    @Autowired
    private InfoCollAcademicSupplementalEvidenceService supplementalEvidenceService;

    @Autowired
    private InfoCollIndustryContributionService industryContributionService;

    @Autowired
    private InfoCollIndustryProjectEvidenceService industryProjectEvidenceService;

    @Autowired
    private InfoCollIndustrySupplementalEvidenceService industrySupplementalEvidenceService;

    @Autowired
    private InfoCollIndustryApplicantProofService industryApplicantProofService;

    @GetMapping("/case/{caseId}")
    public Map<String, Object> getByCaseId(@PathVariable("caseId") Integer caseId) {
        Map<String, Object> result = new HashMap<>();
        
        // 1. 获取 NIW Petition
        InfoCollNiwPetition niwPetition = niwPetitionService.lambdaQuery()
                .eq(InfoCollNiwPetition::getClientCaseId, caseId)
                .one();
                
        if (niwPetition == null) {
            return result;
        }
        
        result.put("id", niwPetition.getId());
        result.put("clientCaseId", niwPetition.getClientCaseId());
        result.put("userPath", niwPetition.getUserPath());
        
        // 2. 获取学术 Contributions
        List<Map<String, Object>> contributions = new ArrayList<>();
        List<InfoCollAcademicContribution> contributionList = contributionService.lambdaQuery()
                .eq(InfoCollAcademicContribution::getNiwPetitionId, niwPetition.getId())
                .list();
                
        for (InfoCollAcademicContribution contribution : contributionList) {
            Map<String, Object> contributionMap = new HashMap<>();
            contributionMap.put("id", contribution.getId());
            contributionMap.put("contributionTitle", contribution.getContributionTitle());
            contributionMap.put("fundingReceived", contribution.getFundingReceived());
            contributionMap.put("impact", contribution.getImpact());
            contributionMap.put("industryAdoption", contribution.getIndustryAdoption());
            contributionMap.put("publication", contribution.getPublication());
            
            // 3. 获取 Fundings
            List<Map<String, Object>> fundings = new ArrayList<>();
            List<InfoCollAcademicFunding> fundingList = fundingService.lambdaQuery()
                    .eq(InfoCollAcademicFunding::getContributionId, contribution.getId())
                    .list();
                    
            for (InfoCollAcademicFunding funding : fundingList) {
                Map<String, Object> fundingMap = new HashMap<>();
                fundingMap.put("id", funding.getId());
                fundingMap.put("fundingCategory", funding.getFundingCategory());
                fundingMap.put("fundingLinks", funding.getFundingLinks());
                fundingMap.put("fundingAttachments", funding.getFundingAttachments());
                fundingMap.put("fundingRemarks", funding.getFundingRemarks());
                fundings.add(fundingMap);
            }
            
            contributionMap.put("fundings", fundings);

            // 4. 获取 Policy Impacts
            List<Map<String, Object>> policyImpacts = new ArrayList<>();
            List<InfoCollAcademicPolicyImpact> policyImpactList = policyImpactService.lambdaQuery()
                    .eq(InfoCollAcademicPolicyImpact::getContributionId, contribution.getId())
                    .list();
                    
            for (InfoCollAcademicPolicyImpact policyImpact : policyImpactList) {
                Map<String, Object> policyImpactMap = new HashMap<>();
                policyImpactMap.put("id", policyImpact.getId());
                policyImpactMap.put("impactField", policyImpact.getImpactField());
                policyImpactMap.put("impactBeneficiary", policyImpact.getImpactBeneficiary());
                policyImpactMap.put("impactLinks", policyImpact.getImpactLinks());
                policyImpactMap.put("impactAttachments", policyImpact.getImpactAttachments());
                policyImpactMap.put("impactRemarks", policyImpact.getImpactRemarks());
                policyImpacts.add(policyImpactMap);
            }

            contributionMap.put("policyImpacts", policyImpacts);
            
            // 5. 获取 Publications
            List<Map<String, Object>> publications = new ArrayList<>();
            List<InfoCollAcademicPublication> publicationList = publicationService.lambdaQuery()
                    .eq(InfoCollAcademicPublication::getContributionId, contribution.getId())
                    .list();
                    
            for (InfoCollAcademicPublication publication : publicationList) {
                Map<String, Object> publicationMap = new HashMap<>();
                publicationMap.put("id", publication.getId());
                publicationMap.put("pubInstitution", publication.getPubInstitution());
                publicationMap.put("pubIssn", publication.getPubIssn());
                publicationMap.put("pubRanking", publication.getPubRanking());
                publicationMap.put("pubTitle", publication.getPubTitle());
                publicationMap.put("pubCitations", publication.getPubCitations());
                publicationMap.put("pubPracticalUses", publication.getPubPracticalUses());
                publicationMap.put("pubTier", publication.getPubTier());
                publicationMap.put("pubLinks", publication.getPubLinks());
                publicationMap.put("pubAttachments", publication.getPubAttachments());
                publicationMap.put("pubRemarks", publication.getPubRemarks());
                publications.add(publicationMap);
            }
            
            contributionMap.put("publications", publications);
            
            // 6. 获取 Industry Adoptions
            List<Map<String, Object>> industryAdoptions = new ArrayList<>();
            List<InfoCollAcademicIndustryAdoption> industryAdoptionList = industryAdoptionService.lambdaQuery()
                    .eq(InfoCollAcademicIndustryAdoption::getContributionId, contribution.getId())
                    .list();
                    
            for (InfoCollAcademicIndustryAdoption industryAdoption : industryAdoptionList) {
                Map<String, Object> industryAdoptionMap = new HashMap<>();
                industryAdoptionMap.put("id", industryAdoption.getId());
                industryAdoptionMap.put("industryDocs", industryAdoption.getIndustryDocs());
                industryAdoptionMap.put("industryLinks", industryAdoption.getIndustryLinks());
                industryAdoptionMap.put("industryAttachments", industryAdoption.getIndustryAttachments());
                industryAdoptionMap.put("industryRemarks", industryAdoption.getIndustryRemarks());
                industryAdoptions.add(industryAdoptionMap);
            }
            
            contributionMap.put("industryAdoptions", industryAdoptions);
            
            // 7. 获取 Supplemental Evidence
            List<Map<String, Object>> supplementalEvidences = new ArrayList<>();
            List<InfoCollAcademicSupplementalEvidence> evidenceList = supplementalEvidenceService.lambdaQuery()
                    .eq(InfoCollAcademicSupplementalEvidence::getContributionId, contribution.getId())
                    .list();
                    
            for (InfoCollAcademicSupplementalEvidence evidence : evidenceList) {
                Map<String, Object> evidenceMap = new HashMap<>();
                evidenceMap.put("id", evidence.getId());
                evidenceMap.put("evidenceType", evidence.getEvidenceType());
                evidenceMap.put("evidenceLink", evidence.getEvidenceLink());
                evidenceMap.put("evidenceAttachment", evidence.getEvidenceAttachment());
                evidenceMap.put("evidenceRemarks", evidence.getEvidenceRemarks());
                supplementalEvidences.add(evidenceMap);
            }
            
            contributionMap.put("supplementalEvidences", supplementalEvidences);
            contributions.add(contributionMap);
        }
        
        result.put("contributions", contributions);

        // 8. 获取行业 Contributions
        List<Map<String, Object>> industryContributions = new ArrayList<>();
        List<InfoCollIndustryContribution> industryContributionList = industryContributionService.lambdaQuery()
                .eq(InfoCollIndustryContribution::getClientCaseId, caseId)
                .list();
                
        for (InfoCollIndustryContribution industryContribution : industryContributionList) {
            Map<String, Object> industryContributionMap = new HashMap<>();
            industryContributionMap.put("id", industryContribution.getId());
            industryContributionMap.put("projectTitle", industryContribution.getProjectTitle());
            industryContributionMap.put("projectBackground", industryContribution.getProjectBackground());
            industryContributionMap.put("yourContribution", industryContribution.getYourContribution());
            industryContributionMap.put("projectOutcomes", industryContribution.getProjectOutcomes());
            
            // 9. 获取 Project Evidences
            List<Map<String, Object>> projectEvidences = new ArrayList<>();
            List<InfoCollIndustryProjectEvidence> evidenceList = industryProjectEvidenceService.lambdaQuery()
                    .eq(InfoCollIndustryProjectEvidence::getContributionId, industryContribution.getId())
                    .list();
                    
            for (InfoCollIndustryProjectEvidence evidence : evidenceList) {
                Map<String, Object> evidenceMap = new HashMap<>();
                evidenceMap.put("id", evidence.getId());
                evidenceMap.put("evidenceType", evidence.getEvidenceType());
                evidenceMap.put("evidenceLinks", evidence.getEvidenceLinks());
                evidenceMap.put("evidenceAttachments", evidence.getEvidenceAttachments());
                evidenceMap.put("evidenceRemarks", evidence.getEvidenceRemarks());
                evidenceMap.put("evidenceHasApplicantProof", evidence.getEvidenceHasApplicantProof());
                
                // 10. 获取 Applicant Proofs
                List<Map<String, Object>> applicantProofs = new ArrayList<>();
                List<InfoCollIndustryApplicantProof> proofList = industryApplicantProofService.lambdaQuery()
                        .eq(InfoCollIndustryApplicantProof::getProjectEvidenceId, evidence.getId())
                        .list();
                        
                for (InfoCollIndustryApplicantProof proof : proofList) {
                    Map<String, Object> proofMap = new HashMap<>();
                    proofMap.put("id", proof.getId());
                    proofMap.put("proofType", proof.getProofType());
                    proofMap.put("proofLinks", proof.getProofLinks());
                    proofMap.put("proofFiles", proof.getProofFiles());
                    proofMap.put("proofExplanation", proof.getProofExplanation());
                    applicantProofs.add(proofMap);
                }
                
                evidenceMap.put("applicantProofs", applicantProofs);
                projectEvidences.add(evidenceMap);
            }
            
            industryContributionMap.put("projectEvidences", projectEvidences);
            
            // 11. 获取 Supplemental Evidences
            List<Map<String, Object>> supplementalEvidences = new ArrayList<>();
            List<InfoCollIndustrySupplementalEvidence> supplementalEvidenceList = industrySupplementalEvidenceService.lambdaQuery()
                    .eq(InfoCollIndustrySupplementalEvidence::getContributionId, industryContribution.getId())
                    .list();
                    
            for (InfoCollIndustrySupplementalEvidence evidence : supplementalEvidenceList) {
                Map<String, Object> evidenceMap = new HashMap<>();
                evidenceMap.put("id", evidence.getId());
                evidenceMap.put("evidenceType", evidence.getEvidenceType());
                evidenceMap.put("evidenceLink", evidence.getEvidenceLink());
                evidenceMap.put("evidenceAttachment", evidence.getEvidenceAttachment());
                evidenceMap.put("evidenceRemarks", evidence.getEvidenceRemarks());
                supplementalEvidences.add(evidenceMap);
            }
            
            industryContributionMap.put("supplementalEvidences", supplementalEvidences);
            industryContributions.add(industryContributionMap);
        }
        
        result.put("industryContributions", industryContributions);
        return result;
    }

    @PostMapping("/upsert")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> saveOrUpdate(@RequestBody Map<String, Object> data) {
        // 1. 处理 NIW Petition
        InfoCollNiwPetition niwPetition = new InfoCollNiwPetition();
        niwPetition.setId((Integer) data.get("id"));
        niwPetition.setClientCaseId((Integer) data.get("clientCaseId"));
        niwPetition.setUserPath((String) data.get("userPath"));
        niwPetitionService.saveOrUpdate(niwPetition);
        Integer clientCaseId = niwPetition.getClientCaseId();

        // 2. 处理学术部分（递归删除旧记录）
        List<InfoCollAcademicContribution> oldAcademicContributions = contributionService.lambdaQuery().eq(InfoCollAcademicContribution::getNiwPetitionId, niwPetition.getId()).list();
        List<Integer> academicContributionIds = new ArrayList<>();
        for (InfoCollAcademicContribution c : oldAcademicContributions) {
            academicContributionIds.add(c.getId());
        }
        if (!academicContributionIds.isEmpty()) {
            fundingService.lambdaUpdate().in(InfoCollAcademicFunding::getContributionId, academicContributionIds).remove();
            policyImpactService.lambdaUpdate().in(InfoCollAcademicPolicyImpact::getContributionId, academicContributionIds).remove();
            industryAdoptionService.lambdaUpdate().in(InfoCollAcademicIndustryAdoption::getContributionId, academicContributionIds).remove();
            publicationService.lambdaUpdate().in(InfoCollAcademicPublication::getContributionId, academicContributionIds).remove();
            supplementalEvidenceService.lambdaUpdate().in(InfoCollAcademicSupplementalEvidence::getContributionId, academicContributionIds).remove();
        }
        contributionService.lambdaUpdate().eq(InfoCollAcademicContribution::getNiwPetitionId, niwPetition.getId()).remove();

        // 3. 处理工业部分（递归删除旧记录）
        List<InfoCollIndustryContribution> oldIndustryContributions = industryContributionService.lambdaQuery().eq(InfoCollIndustryContribution::getClientCaseId, clientCaseId).list();
        List<Integer> industryContributionIds = new ArrayList<>();
        for (InfoCollIndustryContribution c : oldIndustryContributions) {
            industryContributionIds.add(c.getId());
        }
        if (!industryContributionIds.isEmpty()) {
            industrySupplementalEvidenceService.lambdaUpdate().in(InfoCollIndustrySupplementalEvidence::getContributionId, industryContributionIds).remove();
            industryProjectEvidenceService.lambdaUpdate().in(InfoCollIndustryProjectEvidence::getContributionId, industryContributionIds).remove();
            industryApplicantProofService.lambdaUpdate().in(InfoCollIndustryApplicantProof::getProjectEvidenceId, industryContributionIds).remove();
        }
        industryContributionService.lambdaUpdate().eq(InfoCollIndustryContribution::getClientCaseId, clientCaseId).remove();

        // 4. 全量插入学术部分
        List<Map<String, Object>> contributions = (List<Map<String, Object>>) data.get("contributions");
        if (contributions != null) {
            for (Map<String, Object> contributionData : contributions) {
                InfoCollAcademicContribution contribution = new InfoCollAcademicContribution();
                contribution.setId((Integer) contributionData.get("id"));
                contribution.setNiwPetitionId(niwPetition.getId());
                contribution.setContributionTitle((String) contributionData.get("contributionTitle"));
                contribution.setFundingReceived((String) contributionData.get("fundingReceived"));
                contribution.setImpact((String) contributionData.get("impact"));
                contribution.setIndustryAdoption((String) contributionData.get("industryAdoption"));
                contribution.setPublication((String) contributionData.get("publication"));
                contributionService.saveOrUpdate(contribution);
                Integer contributionId = contribution.getId();

                // 处理 Fundings
                List<Map<String, Object>> fundings = (List<Map<String, Object>>) contributionData.get("fundings");
                if (fundings != null) {
                    for (Map<String, Object> fundingData : fundings) {
                        InfoCollAcademicFunding funding = new InfoCollAcademicFunding();
                        funding.setId((Integer) fundingData.get("id"));
                        funding.setContributionId(contributionId);
                        funding.setFundingCategory((String) fundingData.get("fundingCategory"));
                        funding.setFundingLinks((String) fundingData.get("fundingLinks"));
                        funding.setFundingAttachments((String) fundingData.get("fundingAttachments"));
                        funding.setFundingRemarks((String) fundingData.get("fundingRemarks"));
                        fundingService.saveOrUpdate(funding);
                    }
                }

                // 处理 Policy Impacts
                List<Map<String, Object>> policyImpacts = (List<Map<String, Object>>) contributionData.get("policyImpacts");
                if (policyImpacts != null) {
                    for (Map<String, Object> policyImpactData : policyImpacts) {
                        InfoCollAcademicPolicyImpact policyImpact = new InfoCollAcademicPolicyImpact();
                        policyImpact.setId((Integer) policyImpactData.get("id"));
                        policyImpact.setContributionId(contributionId);
                        policyImpact.setImpactField((String) policyImpactData.get("impactField"));
                        policyImpact.setImpactBeneficiary((String) policyImpactData.get("impactBeneficiary"));
                        policyImpact.setImpactLinks((String) policyImpactData.get("impactLinks"));
                        policyImpact.setImpactAttachments((String) policyImpactData.get("impactAttachments"));
                        policyImpact.setImpactRemarks((String) policyImpactData.get("impactRemarks"));
                        policyImpactService.saveOrUpdate(policyImpact);
                    }
                }

                // 处理 Publications
                List<Map<String, Object>> publications = (List<Map<String, Object>>) contributionData.get("publications");
                if (publications != null) {
                    for (Map<String, Object> publicationData : publications) {
                        InfoCollAcademicPublication publication = new InfoCollAcademicPublication();
                        publication.setId((Integer) publicationData.get("id"));
                        publication.setContributionId(contributionId);
                        publication.setPubInstitution((String) publicationData.get("pubInstitution"));
                        publication.setPubIssn((String) publicationData.get("pubIssn"));
                        publication.setPubRanking((String) publicationData.get("pubRanking"));
                        publication.setPubTitle((String) publicationData.get("pubTitle"));
                        publication.setPubCitations((Integer) publicationData.get("pubCitations"));
                        publication.setPubPracticalUses((String) publicationData.get("pubPracticalUses"));
                        publication.setPubTier((String) publicationData.get("pubTier"));
                        publication.setPubLinks((String) publicationData.get("pubLinks"));
                        publication.setPubAttachments((String) publicationData.get("pubAttachments"));
                        publication.setPubRemarks((String) publicationData.get("pubRemarks"));
                        publicationService.saveOrUpdate(publication);
                    }
                }

                // 处理 Industry Adoptions
                List<Map<String, Object>> industryAdoptions = (List<Map<String, Object>>) contributionData.get("industryAdoptions");
                if (industryAdoptions != null) {
                    for (Map<String, Object> industryAdoptionData : industryAdoptions) {
                        InfoCollAcademicIndustryAdoption industryAdoption = new InfoCollAcademicIndustryAdoption();
                        industryAdoption.setId((Integer) industryAdoptionData.get("id"));
                        industryAdoption.setContributionId(contributionId);
                        industryAdoption.setIndustryDocs((String) industryAdoptionData.get("industryDocs"));
                        industryAdoption.setIndustryLinks((String) industryAdoptionData.get("industryLinks"));
                        industryAdoption.setIndustryAttachments((String) industryAdoptionData.get("industryAttachments"));
                        industryAdoption.setIndustryRemarks((String) industryAdoptionData.get("industryRemarks"));
                        industryAdoptionService.saveOrUpdate(industryAdoption);
                    }
                }

                // 处理 Supplemental Evidence
                List<Map<String, Object>> supplementalEvidences = (List<Map<String, Object>>) contributionData.get("supplementalEvidences");
                if (supplementalEvidences != null) {
                    for (Map<String, Object> evidenceData : supplementalEvidences) {
                        InfoCollAcademicSupplementalEvidence evidence = new InfoCollAcademicSupplementalEvidence();
                        evidence.setId((Integer) evidenceData.get("id"));
                        evidence.setContributionId(contributionId);
                        evidence.setEvidenceType((String) evidenceData.get("evidenceType"));
                        evidence.setEvidenceLink((String) evidenceData.get("evidenceLink"));
                        evidence.setEvidenceAttachment((String) evidenceData.get("evidenceAttachment"));
                        evidence.setEvidenceRemarks((String) evidenceData.get("evidenceRemarks"));
                        supplementalEvidenceService.saveOrUpdate(evidence);
                    }
                }
            }
        }

        // 5. 全量插入工业部分
        List<Map<String, Object>> industryContributions = (List<Map<String, Object>>) data.get("industryContributions");
        if (industryContributions != null) {
            for (Map<String, Object> industryData : industryContributions) {
                InfoCollIndustryContribution industryContribution = new InfoCollIndustryContribution();
                industryContribution.setId((Integer) industryData.get("id"));
                industryContribution.setClientCaseId(clientCaseId);
                industryContribution.setProjectTitle((String) industryData.get("projectTitle"));
                industryContribution.setProjectBackground((String) industryData.get("projectBackground"));
                industryContribution.setYourContribution((String) industryData.get("yourContribution"));
                industryContribution.setProjectOutcomes((String) industryData.get("projectOutcomes"));
                industryContributionService.saveOrUpdate(industryContribution);
                Integer industryContributionId = industryContribution.getId();

                // 处理 projectEvidences
                List<Map<String, Object>> projectEvidences = (List<Map<String, Object>>) industryData.get("projectEvidences");
                if (projectEvidences != null) {
                    for (Map<String, Object> evidenceData : projectEvidences) {
                        InfoCollIndustryProjectEvidence evidence = new InfoCollIndustryProjectEvidence();
                        evidence.setId((Integer) evidenceData.get("id"));
                        evidence.setContributionId(industryContributionId);
                        evidence.setEvidenceType((String) evidenceData.get("evidenceType"));
                        evidence.setEvidenceLinks((String) evidenceData.get("evidenceLinks"));
                        evidence.setEvidenceAttachments((String) evidenceData.get("evidenceAttachments"));
                        evidence.setEvidenceRemarks((String) evidenceData.get("evidenceRemarks"));
                        evidence.setEvidenceHasApplicantProof((String) evidenceData.get("evidenceHasApplicantProof"));
                        industryProjectEvidenceService.saveOrUpdate(evidence);
                        Integer evidenceId = evidence.getId();

                        // 处理 applicantProofs
                        List<Map<String, Object>> applicantProofs = (List<Map<String, Object>>) evidenceData.get("applicantProofs");
                        if (applicantProofs != null) {
                            for (Map<String, Object> proofData : applicantProofs) {
                                InfoCollIndustryApplicantProof proof = new InfoCollIndustryApplicantProof();
                                proof.setId((Integer) proofData.get("id"));
                                proof.setProjectEvidenceId(evidenceId);
                                proof.setProofType((String) proofData.get("proofType"));
                                proof.setProofLinks((String) proofData.get("proofLinks"));
                                proof.setProofFiles((String) proofData.get("proofFiles"));
                                proof.setProofExplanation((String) proofData.get("proofExplanation"));
                                industryApplicantProofService.saveOrUpdate(proof);
                            }
                        }
                    }
                }

                // 处理 supplementalEvidences
                List<Map<String, Object>> supplementalEvidences = (List<Map<String, Object>>) industryData.get("supplementalEvidences");
                if (supplementalEvidences != null) {
                    for (Map<String, Object> evidenceData : supplementalEvidences) {
                        InfoCollIndustrySupplementalEvidence evidence = new InfoCollIndustrySupplementalEvidence();
                        evidence.setId((Integer) evidenceData.get("id"));
                        evidence.setContributionId(industryContributionId);
                        evidence.setEvidenceType((String) evidenceData.get("evidenceType"));
                        evidence.setEvidenceLink((String) evidenceData.get("evidenceLink"));
                        evidence.setEvidenceAttachment((String) evidenceData.get("evidenceAttachment"));
                        evidence.setEvidenceRemarks((String) evidenceData.get("evidenceRemarks"));
                        industrySupplementalEvidenceService.saveOrUpdate(evidence);
                    }
                }
            }
        }

        // 返回完整的带ID数据
        return getByCaseId(niwPetition.getClientCaseId());
    }

    @GetMapping("/contributions/{caseId}")
    public Map<String, Object> getContributions(@PathVariable("caseId") Integer caseId) {
        System.out.println("\n\n\ngetContributions");
        Map<String, Object> result = new HashMap<>();
        
        // 获取学术贡献
        List<InfoCollAcademicContribution> academicContributions = contributionService.lambdaQuery()
                .eq(InfoCollAcademicContribution::getNiwPetitionId, caseId)
                .list();
                
        // 获取工业贡献
        List<InfoCollIndustryContribution> industryContributions = industryContributionService.lambdaQuery()
                .eq(InfoCollIndustryContribution::getClientCaseId, caseId)
                .list();
        
        result.put("academicContributions", academicContributions);
        result.put("industryContributions", industryContributions);
        return result;
    }
} 