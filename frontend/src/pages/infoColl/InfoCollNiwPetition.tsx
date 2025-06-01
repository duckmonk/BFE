import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Snackbar, Alert, Accordion, AccordionSummary, AccordionDetails, IconButton, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { infoCollApi } from '../../services/api';
import FileUploadButton from '../../components/FileUploadButton';

const userPathOptions = ['Academic', 'Industry', 'Hybrid'];
const yesNoOptions = ['Yes', 'No'];
const fundingCategoryOptions = ['Infrastructure', 'Defense', 'Public Health', 'Other'];
const impactFieldOptions = ['Healthcare', 'Education', 'Environment', 'Other'];
const industryDocsOptions = ['Technology Licensing', 'Corporate MOU', 'Clinical Trial Report'];
const journalTierOptions = ['Nature', 'Science', 'Top Conference', 'Other'];
const evidenceTypeOptions = ['Media Reports', 'Conference Invitations', 'Additional Patents', 'Speaking Engagements', 'Job Offers', 'High-Tech Certification', 'Other'];
const projectEvidenceTypeOptions = ['Patent', 'News Report', 'Government Report', 'Other'];
const applicantProofTypeOptions = ['Internal Emails', 'Company Reports', 'Team Rosters', 'Other'];

interface AcademicFunding {
  id?: number;
  fundingCategory: string;
  fundingLinks: string;
  fundingAttachments: string;
  fundingRemarks: string;
}

interface AcademicPolicyImpact {
  id?: number;
  impactField: string;
  impactBeneficiary: string;
  impactLinks: string;
  impactAttachments: string;
  impactRemarks: string;
}

interface AcademicIndustryAdoption {
  id?: number;
  industryDocs: string;
  industryLinks: string;
  industryAttachments: string;
  industryRemarks: string;
}

interface AcademicPublication {
  id?: number;
  pubInstitution: string;
  pubIssn: string;
  pubRanking: string;
  pubTitle: string;
  pubCitations: number;
  pubPracticalUses: string;
  pubTier: string;
  pubLinks: string;
  pubAttachments: string;
  pubRemarks: string;
}

interface AcademicSupplementalEvidence {
  id?: number;
  evidenceType: string;
  evidenceLink: string;
  evidenceAttachment: string;
  evidenceRemarks: string;
}

interface AcademicContribution {
  id?: number;
  contributionTitle: string;
  fundingReceived: string;
  impact: string;
  industryAdoption: string;
  publication: string;
  fundings?: AcademicFunding[];
  policyImpacts?: AcademicPolicyImpact[];
  industryAdoptions?: AcademicIndustryAdoption[];
  publications?: AcademicPublication[];
  supplementalEvidences?: AcademicSupplementalEvidence[];
}

interface IndustryApplicantProof {
  id?: number;
  proofType: string;
  proofLinks: string;
  proofFiles: string;
  proofExplanation: string;
}

interface IndustryProjectEvidence {
  id?: number;
  evidenceType: string;
  evidenceLinks: string;
  evidenceAttachments: string;
  evidenceRemarks: string;
  evidenceHasApplicantProof: string;
  applicantProofs?: IndustryApplicantProof[];
}

interface IndustrySupplementalEvidence {
  id?: number;
  evidenceType: string;
  evidenceLink: string;
  evidenceAttachment: string;
  evidenceRemarks: string;
}

interface IndustryContribution {
  id?: number;
  projectTitle: string;
  projectBackground: string;
  yourContribution: string;
  projectOutcomes: string;
  projectEvidences?: IndustryProjectEvidence[];
  supplementalEvidences?: IndustrySupplementalEvidence[];
}

interface ValidationErrors {
  [key: string]: boolean;
}

const InfoCollNiwPetition = forwardRef(({ clientCaseId }: { clientCaseId: number }, ref) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [contributions, setContributions] = useState<AcademicContribution[]>([]);
  const [industryContributions, setIndustryContributions] = useState<IndustryContribution[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [validationDialog, setValidationDialog] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  useEffect(() => {
    if (clientCaseId) {
      infoCollApi.getNiwPetition(clientCaseId).then(res => {
        if (res && res.data) {
          setFormData(res.data);
          if (res.data.contributions) {
            setContributions(res.data.contributions);
          }
          if (res.data.industryContributions) {
            setIndustryContributions(res.data.industryContributions);
          }
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId]);

  // 下拉选择处理
  const handleSelectChange = (name: string) => (e: any) => {
    if (name === 'userPath') {
      const newValue = e.target.value;
      // 如果切换到 Academic，清空 industryContributions
      if (newValue === 'Academic') {
        setIndustryContributions([]);
      }
      // 如果切换到 Industry，清空 contributions
      if (newValue === 'Industry') {
        setContributions([]);
      }
      // 如果切换到 Hybrid，不清空任何数据
    }
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
    // 清除该字段的错误状态
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  // 添加新的贡献
  const handleAddContribution = () => {
    setContributions(prev => [...prev, {
      contributionTitle: '',
      fundingReceived: '',
      impact: '',
      industryAdoption: '',
      publication: ''
    }]);
  };

  // 删除贡献
  const handleDeleteContribution = (index: number) => {
    setContributions(prev => prev.filter((_, i) => i !== index));
  };

  // 更新贡献
  const handleContributionChange = (index: number, field: keyof AcademicContribution, value: string) => {
    console.log('Contribution changed:', field, value);
    setContributions(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
    // 清除该字段的错误状态
    setErrors(prev => ({ ...prev, [`contribution_${index}_${field}`]: false }));
  };

  // 添加新的 funding
  const handleAddFunding = (contributionIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          fundings: [...(contribution.fundings || []), {
            fundingCategory: '',
            fundingLinks: '',
            fundingAttachments: '',
            fundingRemarks: ''
          }]
        };
      }
      return contribution;
    }));
  };

  // 删除 funding
  const handleDeleteFunding = (contributionIndex: number, fundingIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          fundings: contribution.fundings?.filter((_, i) => i !== fundingIndex)
        };
      }
      return contribution;
    }));
  };

  // 更新 funding
  const handleFundingChange = (contributionIndex: number, fundingIndex: number, field: keyof AcademicFunding, value: string) => {
    console.log('Funding changed:', field, value);
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.fundings) {
        const updatedFundings = [...contribution.fundings];
        updatedFundings[fundingIndex] = {
          ...updatedFundings[fundingIndex],
          [field]: value
        };
        return {
          ...contribution,
          fundings: updatedFundings
        };
      }
      return contribution;
    }));
    // 清除该字段的错误状态
    setErrors(prev => ({ ...prev, [`contribution_${contributionIndex}_funding_${fundingIndex}_${field}`]: false }));
  };

  // 添加新的 policy impact
  const handleAddPolicyImpact = (contributionIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          policyImpacts: [...(contribution.policyImpacts || []), {
            impactField: '',
            impactBeneficiary: '',
            impactLinks: '',
            impactAttachments: '',
            impactRemarks: ''
          }]
        };
      }
      return contribution;
    }));
  };

  // 删除 policy impact
  const handleDeletePolicyImpact = (contributionIndex: number, impactIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          policyImpacts: contribution.policyImpacts?.filter((_, i) => i !== impactIndex)
        };
      }
      return contribution;
    }));
  };

  // 更新 policy impact
  const handlePolicyImpactChange = (contributionIndex: number, impactIndex: number, field: keyof AcademicPolicyImpact, value: string) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.policyImpacts) {
        const updatedImpacts = [...contribution.policyImpacts];
        updatedImpacts[impactIndex] = {
          ...updatedImpacts[impactIndex],
          [field]: value
        };
        return {
          ...contribution,
          policyImpacts: updatedImpacts
        };
      }
      return contribution;
    }));
    // 清除该字段的错误状态
    setErrors(prev => ({ ...prev, [`contribution_${contributionIndex}_policyImpact_${impactIndex}_${field}`]: false }));
  };

  // 添加新的 industry adoption
  const handleAddIndustryAdoption = (contributionIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          industryAdoptions: [...(contribution.industryAdoptions || []), {
            industryDocs: '',
            industryLinks: '',
            industryAttachments: '',
            industryRemarks: ''
          }]
        };
      }
      return contribution;
    }));
  };

  // 删除 industry adoption
  const handleDeleteIndustryAdoption = (contributionIndex: number, adoptionIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          industryAdoptions: contribution.industryAdoptions?.filter((_, i) => i !== adoptionIndex)
        };
      }
      return contribution;
    }));
  };

  // 更新 industry adoption
  const handleIndustryAdoptionChange = (contributionIndex: number, adoptionIndex: number, field: keyof AcademicIndustryAdoption, value: string) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.industryAdoptions) {
        const updatedAdoptions = [...contribution.industryAdoptions];
        updatedAdoptions[adoptionIndex] = {
          ...updatedAdoptions[adoptionIndex],
          [field]: value
        };
        return {
          ...contribution,
          industryAdoptions: updatedAdoptions
        };
      }
      return contribution;
    }));
  };

  // 添加新的 publication
  const handleAddPublication = (contributionIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          publications: [...(contribution.publications || []), {
            pubInstitution: '',
            pubIssn: '',
            pubRanking: '',
            pubTitle: '',
            pubCitations: 0,
            pubPracticalUses: '',
            pubTier: '',
            pubLinks: '',
            pubAttachments: '',
            pubRemarks: ''
          }]
        };
      }
      return contribution;
    }));
  };

  // 删除 publication
  const handleDeletePublication = (contributionIndex: number, publicationIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          publications: contribution.publications?.filter((_, i) => i !== publicationIndex)
        };
      }
      return contribution;
    }));
  };

  // 更新 publication
  const handlePublicationChange = (contributionIndex: number, publicationIndex: number, field: keyof AcademicPublication, value: string | number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.publications) {
        const updatedPublications = [...contribution.publications];
        updatedPublications[publicationIndex] = {
          ...updatedPublications[publicationIndex],
          [field]: value
        };
        return {
          ...contribution,
          publications: updatedPublications
        };
      }
      return contribution;
    }));
  };

  // 添加新的 supplemental evidence
  const handleAddSupplementalEvidence = (contributionIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          supplementalEvidences: [...(contribution.supplementalEvidences || []), {
            evidenceType: '',
            evidenceLink: '',
            evidenceAttachment: '',
            evidenceRemarks: ''
          }]
        };
      }
      return contribution;
    }));
  };

  // 删除 supplemental evidence
  const handleDeleteSupplementalEvidence = (contributionIndex: number, evidenceIndex: number) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          supplementalEvidences: contribution.supplementalEvidences?.filter((_, i) => i !== evidenceIndex)
        };
      }
      return contribution;
    }));
  };

  // 更新 supplemental evidence
  const handleSupplementalEvidenceChange = (contributionIndex: number, evidenceIndex: number, field: keyof AcademicSupplementalEvidence, value: string) => {
    setContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.supplementalEvidences) {
        const updatedEvidences = [...contribution.supplementalEvidences];
        updatedEvidences[evidenceIndex] = {
          ...updatedEvidences[evidenceIndex],
          [field]: value
        };
        return {
          ...contribution,
          supplementalEvidences: updatedEvidences
        };
      }
      return contribution;
    }));
  };

  // 添加新的 industry contribution
  const handleAddIndustryContribution = () => {
    setIndustryContributions(prev => [...prev, {
      projectTitle: '',
      projectBackground: '',
      yourContribution: '',
      projectOutcomes: ''
    }]);
  };

  // 删除 industry contribution
  const handleDeleteIndustryContribution = (index: number) => {
    setIndustryContributions(prev => prev.filter((_, i) => i !== index));
  };

  // 更新 industry contribution
  const handleIndustryContributionChange = (index: number, field: keyof IndustryContribution, value: string) => {
    setIndustryContributions(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // 添加新的 project evidence
  const handleAddProjectEvidence = (contributionIndex: number) => {
    setIndustryContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          projectEvidences: [...(contribution.projectEvidences || []), {
            evidenceType: '',
            evidenceLinks: '',
            evidenceAttachments: '',
            evidenceRemarks: '',
            evidenceHasApplicantProof: ''
          }]
        };
      }
      return contribution;
    }));
  };

  // 删除 project evidence
  const handleDeleteProjectEvidence = (contributionIndex: number, evidenceIndex: number) => {
    setIndustryContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          projectEvidences: contribution.projectEvidences?.filter((_, i) => i !== evidenceIndex)
        };
      }
      return contribution;
    }));
  };

  // 更新 project evidence
  const handleProjectEvidenceChange = (contributionIndex: number, evidenceIndex: number, field: keyof IndustryProjectEvidence, value: string) => {
    setIndustryContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.projectEvidences) {
        const updatedEvidences = [...contribution.projectEvidences];
        updatedEvidences[evidenceIndex] = {
          ...updatedEvidences[evidenceIndex],
          [field]: value
        };
        return {
          ...contribution,
          projectEvidences: updatedEvidences
        };
      }
      return contribution;
    }));
  };

  // 添加新的 applicant proof
  const handleAddApplicantProof = (contributionIndex: number, evidenceIndex: number) => {
    setIndustryContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.projectEvidences) {
        const updatedEvidences = [...contribution.projectEvidences];
        updatedEvidences[evidenceIndex] = {
          ...updatedEvidences[evidenceIndex],
          applicantProofs: [...(updatedEvidences[evidenceIndex].applicantProofs || []), {
            proofType: '',
            proofLinks: '',
            proofFiles: '',
            proofExplanation: ''
          }]
        };
        return {
          ...contribution,
          projectEvidences: updatedEvidences
        };
      }
      return contribution;
    }));
  };

  // 删除 applicant proof
  const handleDeleteApplicantProof = (contributionIndex: number, evidenceIndex: number, proofIndex: number) => {
    setIndustryContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.projectEvidences) {
        const updatedEvidences = [...contribution.projectEvidences];
        updatedEvidences[evidenceIndex] = {
          ...updatedEvidences[evidenceIndex],
          applicantProofs: updatedEvidences[evidenceIndex].applicantProofs?.filter((_, i) => i !== proofIndex)
        };
        return {
          ...contribution,
          projectEvidences: updatedEvidences
        };
      }
      return contribution;
    }));
  };

  // 更新 applicant proof
  const handleApplicantProofChange = (contributionIndex: number, evidenceIndex: number, proofIndex: number, field: keyof IndustryApplicantProof, value: string) => {
    setIndustryContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.projectEvidences) {
        const updatedEvidences = [...contribution.projectEvidences];
        const currentEvidence = updatedEvidences[evidenceIndex];
        if (currentEvidence.applicantProofs) {
          const updatedProofs = [...currentEvidence.applicantProofs];
          updatedProofs[proofIndex] = {
            ...updatedProofs[proofIndex],
            [field]: value
          };
          currentEvidence.applicantProofs = updatedProofs;
        }
        return {
          ...contribution,
          projectEvidences: updatedEvidences
        };
      }
      return contribution;
    }));
  };

  // 添加新的 industry supplemental evidence
  const handleAddIndustrySupplementalEvidence = (contributionIndex: number) => {
    setIndustryContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          supplementalEvidences: [...(contribution.supplementalEvidences || []), {
            evidenceType: '',
            evidenceLink: '',
            evidenceAttachment: '',
            evidenceRemarks: ''
          }]
        };
      }
      return contribution;
    }));
  };

  // 删除 industry supplemental evidence
  const handleDeleteIndustrySupplementalEvidence = (contributionIndex: number, evidenceIndex: number) => {
    setIndustryContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex) {
        return {
          ...contribution,
          supplementalEvidences: contribution.supplementalEvidences?.filter((_, i) => i !== evidenceIndex)
        };
      }
      return contribution;
    }));
  };

  // 更新 industry supplemental evidence
  const handleIndustrySupplementalEvidenceChange = (contributionIndex: number, evidenceIndex: number, field: keyof IndustrySupplementalEvidence, value: string) => {
    setIndustryContributions(prev => prev.map((contribution, index) => {
      if (index === contributionIndex && contribution.supplementalEvidences) {
        const updatedEvidences = [...contribution.supplementalEvidences];
        updatedEvidences[evidenceIndex] = {
          ...updatedEvidences[evidenceIndex],
          [field]: value
        };
        return {
          ...contribution,
          supplementalEvidences: updatedEvidences
        };
      }
      return contribution;
    }));
  };

  // 关闭snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // 验证 User Path Selection
    if (!formData.userPath) {
      newErrors.userPath = true;
      isValid = false;
    }

    // 验证 Academic Core Contribution
    if (showAcademicSection) {
      contributions.forEach((contribution, index) => {
        // 验证 Contribution Title
        if (!contribution.contributionTitle) {
          newErrors[`contribution_${index}_title`] = true;
          isValid = false;
        }

        // 验证 Funding
        if (!contribution.fundingReceived) {
          newErrors[`contribution_${index}_fundingReceived`] = true;
          isValid = false;
        }

        // 如果选择了 Yes，验证 Funding Details
        if (contribution.fundingReceived === 'Yes' && contribution.fundings) {
          contribution.fundings.forEach((funding, fundingIndex) => {
            if (!funding.fundingCategory) {
              newErrors[`contribution_${index}_funding_${fundingIndex}_category`] = true;
              isValid = false;
            }
            if (!funding.fundingLinks && !funding.fundingAttachments) {
              newErrors[`contribution_${index}_funding_${fundingIndex}_links`] = true;
              newErrors[`contribution_${index}_funding_${fundingIndex}_attachments`] = true;
              isValid = false;
            }
            if (!funding.fundingRemarks) {
              newErrors[`contribution_${index}_funding_${fundingIndex}_remarks`] = true;
              isValid = false;
            }
          });
        }

        // 验证 Policy Impact
        if (!contribution.impact) {
          newErrors[`contribution_${index}_impact`] = true;
          isValid = false;
        }

        // 如果选择了 Yes，验证 Policy Impact Details
        if (contribution.impact === 'Yes' && contribution.policyImpacts) {
          contribution.policyImpacts.forEach((impact, impactIndex) => {
            if (!impact.impactField) {
              newErrors[`contribution_${index}_policyImpact_${impactIndex}_field`] = true;
              isValid = false;
            }
            if (!impact.impactBeneficiary) {
              newErrors[`contribution_${index}_policyImpact_${impactIndex}_beneficiary`] = true;
              isValid = false;
            }
            if (!impact.impactLinks && !impact.impactAttachments) {
              newErrors[`contribution_${index}_policyImpact_${impactIndex}_links`] = true;
              newErrors[`contribution_${index}_policyImpact_${impactIndex}_attachments`] = true;
              isValid = false;
            }
            if (!impact.impactRemarks) {
              newErrors[`contribution_${index}_policyImpact_${impactIndex}_remarks`] = true;
              isValid = false;
            }
          });
        }

        // 验证 Industry Adoption
        if (!contribution.industryAdoption) {
          newErrors[`contribution_${index}_industryAdoption`] = true;
          isValid = false;
        }

        // 如果选择了 Yes，验证 Industry Adoption Details
        if (contribution.industryAdoption === 'Yes' && contribution.industryAdoptions) {
          contribution.industryAdoptions.forEach((adoption, adoptionIndex) => {
            if (!adoption.industryDocs) {
              newErrors[`contribution_${index}_industryAdoption_${adoptionIndex}_docs`] = true;
              isValid = false;
            }
            if (!adoption.industryLinks && !adoption.industryAttachments) {
              newErrors[`contribution_${index}_industryAdoption_${adoptionIndex}_links`] = true;
              newErrors[`contribution_${index}_industryAdoption_${adoptionIndex}_attachments`] = true;
              isValid = false;
            }
            if (!adoption.industryRemarks) {
              newErrors[`contribution_${index}_industryAdoption_${adoptionIndex}_remarks`] = true;
              isValid = false;
            }
          });
        }

        // 验证 Academic Publications
        if (!contribution.publication) {
          newErrors[`contribution_${index}_publication`] = true;
          isValid = false;
        }

        // 如果选择了 Yes，验证 Publication Details
        if (contribution.publication === 'Yes' && contribution.publications) {
          contribution.publications.forEach((pub, pubIndex) => {
            if (!pub.pubInstitution) {
              newErrors[`contribution_${index}_publication_${pubIndex}_institution`] = true;
              isValid = false;
            }
            if (!pub.pubTitle) {
              newErrors[`contribution_${index}_publication_${pubIndex}_title`] = true;
              isValid = false;
            }
            if (!pub.pubCitations) {
              newErrors[`contribution_${index}_publication_${pubIndex}_citations`] = true;
              isValid = false;
            }
            if (!pub.pubPracticalUses) {
              newErrors[`contribution_${index}_publication_${pubIndex}_practicalUses`] = true;
              isValid = false;
            }
            if (!pub.pubTier) {
              newErrors[`contribution_${index}_publication_${pubIndex}_tier`] = true;
              isValid = false;
            }
            if (!pub.pubRemarks) {
              newErrors[`contribution_${index}_publication_${pubIndex}_remarks`] = true;
              isValid = false;
            }
          });
        }
      });
    }

    // 验证 Industry Core Contribution
    if (showIndustrySection) {
      industryContributions.forEach((contribution, index) => {
        // 验证基本字段
        if (!contribution.projectTitle) {
          newErrors[`industry_contribution_${index}_title`] = true;
          isValid = false;
        }
        if (!contribution.projectBackground) {
          newErrors[`industry_contribution_${index}_background`] = true;
          isValid = false;
        }
        if (!contribution.yourContribution) {
          newErrors[`industry_contribution_${index}_contribution`] = true;
          isValid = false;
        }
        if (!contribution.projectOutcomes) {
          newErrors[`industry_contribution_${index}_outcomes`] = true;
          isValid = false;
        }

        // 验证 Project-Level Evidence
        if (contribution.projectEvidences) {
          contribution.projectEvidences.forEach((evidence, evidenceIndex) => {
            if (!evidence.evidenceType) {
              newErrors[`industry_contribution_${index}_evidence_${evidenceIndex}_type`] = true;
              isValid = false;
            }
            if (!evidence.evidenceLinks && !evidence.evidenceAttachments) {
              newErrors[`industry_contribution_${index}_evidence_${evidenceIndex}_links`] = true;
              newErrors[`industry_contribution_${index}_evidence_${evidenceIndex}_attachments`] = true;
              isValid = false;
            }
            if (!evidence.evidenceRemarks) {
              newErrors[`industry_contribution_${index}_evidence_${evidenceIndex}_remarks`] = true;
              isValid = false;
            }
            if (!evidence.evidenceHasApplicantProof) {
              newErrors[`industry_contribution_${index}_evidence_${evidenceIndex}_hasApplicantProof`] = true;
              isValid = false;
            }

            // 如果选择了 Yes，验证 Applicant-Specific Evidence
            if (evidence.evidenceHasApplicantProof === 'Yes' && evidence.applicantProofs) {
              evidence.applicantProofs.forEach((proof, proofIndex) => {
                if (!proof.proofType) {
                  newErrors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_type`] = true;
                  isValid = false;
                }
                if (!proof.proofLinks && !proof.proofFiles) {
                  newErrors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_links`] = true;
                  newErrors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_files`] = true;
                  isValid = false;
                }
                if (!proof.proofExplanation) {
                  newErrors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_explanation`] = true;
                  isValid = false;
                }
              });
            }
          });
        }
      });
    }

    setErrors(newErrors);

    if (!isValid) {
      setValidationDialog({
        open: true,
        message: 'Please fill in all required fields and upload required documents.'
      });
    }

    return isValid;
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    getFormData: () => ({ ...formData, contributions, industryContributions }),
    submit: async (clientCase: any) => {
      if (!validateForm()) {
        return false;
      }

      try {
        // 处理每个 contribution
        const processedContributions = contributions.map(contribution => ({
          ...contribution,
          niwPetitionId: formData.id
        }));

        const data = { 
          id: formData.id,
          clientCaseId: clientCase.clientCaseId,
          userPath: formData.userPath,
          contributions: processedContributions,
          industryContributions: industryContributions.map(contribution => ({
            ...contribution,
            clientCaseId: clientCase.clientCaseId
          }))
        };

        // 提交数据
        const response = await infoCollApi.submitNiwPetition(data);
        
        // 更新本地数据
        if (response.data) {
          setFormData(response.data);
          if (response.data.contributions) {
            setContributions(response.data.contributions);
          }
          if (response.data.industryContributions) {
            setIndustryContributions(response.data.industryContributions);
          }
        }

        setSnackbar({ open: true, message: 'Successfully saved', severity: 'success' });
        
        // 触发父组件的状态更新
        if (clientCase.onStatusChange) {
          clientCase.onStatusChange('niwPetition', true);
        }
        
        return true;
      } catch (e: any) {
        setSnackbar({ open: true, message: e?.message || 'Save failed', severity: 'error' });
        return false;
      }
    }
  }));

  const showAcademicSection = formData.userPath === 'Academic' || formData.userPath === 'Hybrid';
  const showIndustrySection = formData.userPath === 'Industry' || formData.userPath === 'Hybrid';

  return (
    <Box component="form" noValidate autoComplete="off">
      <Alert severity="warning" sx={{ mb: 2 }}>
        Reminder: If you do not click Save, your changes will be lost.
      </Alert>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>NIW Petition</Typography>
      
      {/* User Path Selection */}
      <TextField
        name="userPath"
        label="User Path Selection"
        select
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={formData.userPath || ''}
        onChange={handleSelectChange('userPath')}
        required
        error={errors.userPath}
        helperText={errors.userPath ? 'Please select a user path' : ''}
      >
        {userPathOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
      </TextField>

      {/* Academic Core Contribution Section */}
      {showAcademicSection && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Academic Core Contribution</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddContribution}
              variant="outlined"
              size="small"
            >
              Add Contribution
            </Button>
          </Box>

          {contributions.map((contribution, index) => (
            <Accordion key={index} sx={{ mb: 1 }} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography>
                    {contribution.contributionTitle || `Contribution ${index + 1}`}
                  </Typography>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteContribution(index);
                    }}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    label="Contribution Title"
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                    value={contribution.contributionTitle}
                    onChange={(e) => handleContributionChange(index, 'contributionTitle', e.target.value)}
                    required
                    error={errors[`contribution_${index}_title`]}
                    helperText={errors[`contribution_${index}_title`] ? 'Contribution Title is required' : ''}
                  />


                  {/* Funding Section */}
                  <Accordion sx={{ mb: 2 }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight={600}>Funding Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        label="Has this contribution received government or public funding?"
                        select
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        value={contribution.fundingReceived}
                        onChange={(e) => handleContributionChange(index, 'fundingReceived', e.target.value)}
                        required
                        error={errors[`contribution_${index}_fundingReceived`]}
                        helperText={errors[`contribution_${index}_fundingReceived`] ? 'Funding Received is required' : ''}
                      >
                        {yesNoOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                      </TextField>

                      {contribution.fundingReceived === 'Yes' && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => handleAddFunding(index)}
                              variant="outlined"
                              size="small"
                            >
                              Add Funding
                            </Button>
                          </Box>

                          {contribution.fundings?.map((funding, fundingIndex) => (
                            <Accordion key={fundingIndex} sx={{ mb: 2 }} defaultExpanded>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                  <Typography>
                                    {funding.fundingCategory || `Funding ${fundingIndex + 1}`}
                                  </Typography>
                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFunding(index, fundingIndex);
                                    }}
                                    sx={{
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: 32,
                                      height: 32,
                                      '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: '50%'
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Box>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <TextField
                                  label="Project Category"
                                  select
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={funding.fundingCategory}
                                  onChange={(e) => handleFundingChange(index, fundingIndex, 'fundingCategory', e.target.value)}
                                  required
                                  error={errors[`contribution_${index}_funding_${fundingIndex}_category`]}
                                  helperText={errors[`contribution_${index}_funding_${fundingIndex}_category`] ? 'Project Category is required' : ''}
                                >
                                  {fundingCategoryOptions.map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                  ))}
                                </TextField>

                                <TextField
                                  label="Supporting Evidence (URL)"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={funding.fundingLinks}
                                  onChange={(e) => handleFundingChange(index, fundingIndex, 'fundingLinks', e.target.value)}
                                  required={!funding.fundingAttachments}
                                  error={errors[`contribution_${index}_funding_${fundingIndex}_links`]}
                                  helperText={errors[`contribution_${index}_funding_${fundingIndex}_links`] ? 'Supporting Links are required' : ''}
                                />

                                <FileUploadButton
                                  label="Attachments"
                                  fileType="fundingAttachment"
                                  onFileUrlChange={(url: string | null) => handleFundingChange(index, fundingIndex, 'fundingAttachments', url || '')}
                                  required={!funding.fundingLinks}
                                  error={errors[`contribution_${index}_funding_${fundingIndex}_attachments`]}
                                />

                                <TextField
                                  label="Remarks"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={funding.fundingRemarks}
                                  onChange={(e) => handleFundingChange(index, fundingIndex, 'fundingRemarks', e.target.value)}
                                  required
                                  multiline
                                  rows={2}
                                  error={errors[`contribution_${index}_funding_${fundingIndex}_remarks`]}
                                  helperText={errors[`contribution_${index}_funding_${fundingIndex}_remarks`] ? 'Remarks are required' : ''}
                                />
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  {/* Policy Impact Section */}
                  <Accordion sx={{ mb: 2 }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight={600}>Policy Impact Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        label="Does this contribution impact public policy or social well-being?"
                        select
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        value={contribution.impact}
                        onChange={(e) => handleContributionChange(index, 'impact', e.target.value)}
                        required
                        error={errors[`contribution_${index}_impact`]}
                        helperText={errors[`contribution_${index}_impact`] ? 'Impact is required' : ''}
                      >
                        {yesNoOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                      </TextField>

                      {contribution.impact === 'Yes' && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => handleAddPolicyImpact(index)}
                              variant="outlined"
                              size="small"
                            >
                              Add Policy Impact
                            </Button>
                          </Box>

                          {contribution.policyImpacts?.map((impact, impactIndex) => (
                            <Accordion key={impactIndex} sx={{ mb: 2 }} defaultExpanded>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                  <Typography>
                                    {impact.impactField || `Policy Impact ${impactIndex + 1}`}
                                  </Typography>
                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePolicyImpact(index, impactIndex);
                                    }}
                                    sx={{
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: 32,
                                      height: 32,
                                      '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: '50%'
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Box>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <TextField
                                  label="Application Field"
                                  select
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={impact.impactField}
                                  onChange={(e) => handlePolicyImpactChange(index, impactIndex, 'impactField', e.target.value)}
                                  required
                                  error={errors[`contribution_${index}_policyImpact_${impactIndex}_field`]}
                                  helperText={errors[`contribution_${index}_policyImpact_${impactIndex}_field`] ? 'Application Field is required' : ''}
                                >
                                  {impactFieldOptions.map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                  ))}
                                </TextField>

                                <TextField
                                  label="Beneficiary Group"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={impact.impactBeneficiary}
                                  onChange={(e) => handlePolicyImpactChange(index, impactIndex, 'impactBeneficiary', e.target.value)}
                                  required
                                  error={errors[`contribution_${index}_policyImpact_${impactIndex}_beneficiary`]}
                                  helperText={errors[`contribution_${index}_policyImpact_${impactIndex}_beneficiary`] ? 'Beneficiary Group is required' : ''}
                                />

                                <TextField
                                  label="Supporting Links"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={impact.impactLinks}
                                  onChange={(e) => handlePolicyImpactChange(index, impactIndex, 'impactLinks', e.target.value)}
                                  required={!impact.impactAttachments}
                                  error={errors[`contribution_${index}_policyImpact_${impactIndex}_links`]}
                                  helperText={errors[`contribution_${index}_policyImpact_${impactIndex}_links`] ? 'Supporting Links are required' : ''}
                                />

                                <FileUploadButton
                                  label="Attachments"
                                  fileType="policyImpactAttachment"
                                  onFileUrlChange={(url: string | null) => handlePolicyImpactChange(index, impactIndex, 'impactAttachments', url || '')}
                                  required={!impact.impactLinks}
                                  error={errors[`contribution_${index}_policyImpact_${impactIndex}_attachments`]}
                                />

                                <TextField
                                  label="Remarks"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={impact.impactRemarks}
                                  onChange={(e) => handlePolicyImpactChange(index, impactIndex, 'impactRemarks', e.target.value)}
                                  required
                                  multiline
                                  rows={2}
                                  error={errors[`contribution_${index}_policyImpact_${impactIndex}_remarks`]}
                                  helperText={errors[`contribution_${index}_policyImpact_${impactIndex}_remarks`] ? 'Remarks are required' : ''}
                                />
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>


                  {/* Industry Adoption Section */}
                  <Accordion sx={{ mb: 2 }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight={600}>Industry Adoption</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        label="Has this contribution been applied in industry?"
                        select
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        value={contribution.industryAdoption}
                        onChange={(e) => handleContributionChange(index, 'industryAdoption', e.target.value)}
                        required
                        error={errors[`contribution_${index}_industryAdoption`]}
                        helperText={errors[`contribution_${index}_industryAdoption`] ? 'Industry Adoption is required' : ''}
                      >
                        {yesNoOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                      </TextField>

                      {contribution.industryAdoption === 'Yes' && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => handleAddIndustryAdoption(index)}
                              variant="outlined"
                              size="small"
                            >
                              Add Industry Adoption
                            </Button>
                          </Box>

                          {contribution.industryAdoptions?.map((adoption, adoptionIndex) => (
                            <Accordion key={adoptionIndex} sx={{ mb: 2 }} defaultExpanded>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                  <Typography>
                                    {adoption.industryDocs || `Industry Adoption ${adoptionIndex + 1}`}
                                  </Typography>
                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteIndustryAdoption(index, adoptionIndex);
                                    }}
                                    sx={{
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: 32,
                                      height: 32,
                                      '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: '50%'
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Box>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <TextField
                                  label="Supporting Documents"
                                  select
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={adoption.industryDocs}
                                  onChange={(e) => handleIndustryAdoptionChange(index, adoptionIndex, 'industryDocs', e.target.value)}
                                  required
                                  error={errors[`contribution_${index}_industryAdoption_${adoptionIndex}_docs`]}
                                  helperText={errors[`contribution_${index}_industryAdoption_${adoptionIndex}_docs`] ? 'Supporting Documents are required' : ''}
                                >
                                  {industryDocsOptions.map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                  ))}
                                </TextField>

                                <TextField
                                  label="Supporting Links"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={adoption.industryLinks}
                                  onChange={(e) => handleIndustryAdoptionChange(index, adoptionIndex, 'industryLinks', e.target.value)}
                                  required={!adoption.industryAttachments}
                                  error={errors[`contribution_${index}_industryAdoption_${adoptionIndex}_links`]}
                                  helperText={errors[`contribution_${index}_industryAdoption_${adoptionIndex}_links`] ? 'Supporting Links are required' : ''}
                                />

                                <FileUploadButton
                                  label="Attachments"
                                  fileType="industryAdoptionAttachment"
                                  onFileUrlChange={(url: string | null) => handleIndustryAdoptionChange(index, adoptionIndex, 'industryAttachments', url || '')}
                                  required={!adoption.industryLinks}
                                  error={errors[`contribution_${index}_industryAdoption_${adoptionIndex}_attachments`]}
                                />

                                <TextField
                                  label="Remarks"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={adoption.industryRemarks}
                                  onChange={(e) => handleIndustryAdoptionChange(index, adoptionIndex, 'industryRemarks', e.target.value)}
                                  required
                                  multiline
                                  rows={2}
                                  error={errors[`contribution_${index}_industryAdoption_${adoptionIndex}_remarks`]}
                                  helperText={errors[`contribution_${index}_industryAdoption_${adoptionIndex}_remarks`] ? 'Remarks are required' : ''}
                                />
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  {/* Academic Publications Section */}
                  <Accordion sx={{ mb: 2 }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight={600}>Academic Publications</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        label="Has this contribution resulted in academic publications?"
                        select
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        value={contribution.publication}
                        onChange={(e) => handleContributionChange(index, 'publication', e.target.value)}
                        required
                        error={errors[`contribution_${index}_publication`]}
                        helperText={errors[`contribution_${index}_publication`] ? 'Publication is required' : ''}
                      >
                        {yesNoOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                      </TextField>

                      {contribution.publication === 'Yes' && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => handleAddPublication(index)}
                              variant="outlined"
                              size="small"
                            >
                              Add Publication
                            </Button>
                          </Box>

                          {contribution.publications?.map((publication, publicationIndex) => (
                            <Accordion key={publicationIndex} sx={{ mb: 2 }} defaultExpanded>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                  <Typography>
                                    {publication.pubTitle || `Publication ${publicationIndex + 1}`}
                                  </Typography>
                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePublication(index, publicationIndex);
                                    }}
                                    sx={{
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: 32,
                                      height: 32,
                                      '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: '50%'
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Box>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <TextField
                                  label="Institution / Journal / Conference Name"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={publication.pubInstitution}
                                  onChange={(e) => handlePublicationChange(index, publicationIndex, 'pubInstitution', e.target.value)}
                                  required
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_institution`]}
                                  helperText={errors[`contribution_${index}_publication_${publicationIndex}_institution`] ? 'Institution is required' : ''}
                                />

                                <TextField
                                  label="ISSN (If applicable)"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={publication.pubIssn}
                                  onChange={(e) => handlePublicationChange(index, publicationIndex, 'pubIssn', e.target.value)}
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_citations`]}
                                  helperText={errors[`contribution_${index}_publication_${publicationIndex}_citations`] ? 'ISSN is required' : ''}
                                />

                                <TextField
                                  label="Journal Ranking / Impact Factor"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={publication.pubRanking}
                                  onChange={(e) => handlePublicationChange(index, publicationIndex, 'pubRanking', e.target.value)}
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_tier`]}
                                  helperText={errors[`contribution_${index}_publication_${publicationIndex}_tier`] ? 'Journal Ranking is required' : ''}
                                />

                                <TextField
                                  label="Paper Title"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={publication.pubTitle}
                                  onChange={(e) => handlePublicationChange(index, publicationIndex, 'pubTitle', e.target.value)}
                                  required
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_title`]}
                                  helperText={errors[`contribution_${index}_publication_${publicationIndex}_title`] ? 'Paper Title is required' : ''}
                                />

                                <TextField
                                  label="Citation Count"
                                  type="number"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={publication.pubCitations}
                                  onChange={(e) => handlePublicationChange(index, publicationIndex, 'pubCitations', parseInt(e.target.value) || 0)}
                                  required
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_citations`]}
                                  helperText={errors[`contribution_${index}_publication_${publicationIndex}_citations`] ? 'Citation Count is required' : ''}
                                />

                                <TextField
                                  label="Practical Applications"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={publication.pubPracticalUses}
                                  onChange={(e) => handlePublicationChange(index, publicationIndex, 'pubPracticalUses', e.target.value)}
                                  required
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_practicalUses`]}
                                  helperText={errors[`contribution_${index}_publication_${publicationIndex}_practicalUses`] ? 'Practical Applications are required' : ''}
                                />

                                <TextField
                                  label="Journal Tier"
                                  select
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={publication.pubTier}
                                  onChange={(e) => handlePublicationChange(index, publicationIndex, 'pubTier', e.target.value)}
                                  required
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_tier`]}
                                  helperText={errors[`contribution_${index}_publication_${publicationIndex}_tier`] ? 'Journal Tier is required' : ''}
                                >
                                  {journalTierOptions.map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                  ))}
                                </TextField>

                                <TextField
                                  label="Supporting Links"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={publication.pubLinks}
                                  onChange={(e) => handlePublicationChange(index, publicationIndex, 'pubLinks', e.target.value)}
                                  required={!publication.pubAttachments}
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_links`]}
                                  helperText={errors[`contribution_${index}_publication_${publicationIndex}_links`] ? 'Supporting Links are required' : ''}
                                />

                                <FileUploadButton
                                  label="Attachments"
                                  fileType="publicationAttachment"
                                  onFileUrlChange={(url: string | null) => handlePublicationChange(index, publicationIndex, 'pubAttachments', url || '')}
                                  required={!publication.pubLinks}
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_attachments`]}
                                />

                                <TextField
                                  label="Remarks"
                                  fullWidth
                                  size="small"
                                  sx={{ mb: 2 }}
                                  value={publication.pubRemarks}
                                  onChange={(e) => handlePublicationChange(index, publicationIndex, 'pubRemarks', e.target.value)}
                                  required
                                  multiline
                                  rows={2}
                                  error={errors[`contribution_${index}_publication_${publicationIndex}_remarks`]}
                                  helperText={errors[`contribution_${index}_publication_${publicationIndex}_remarks`] ? 'Remarks are required' : ''}
                                />
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  {/* Supplemental Evidence Section */}
                  <Accordion sx={{ mb: 2 }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight={600}>Supplemental Evidence</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddSupplementalEvidence(index)}
                            variant="outlined"
                            size="small"
                          >
                            Add Evidence
                          </Button>
                        </Box>

                        {contribution.supplementalEvidences?.map((evidence, evidenceIndex) => (
                          <Accordion key={evidenceIndex} sx={{ mb: 2 }} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                <Typography>
                                  {evidence.evidenceType || `Evidence ${evidenceIndex + 1}`}
                                </Typography>
                                <Box
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSupplementalEvidence(index, evidenceIndex);
                                  }}
                                  sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 32,
                                    height: 32,
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                      borderRadius: '50%'
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <TextField
                                label="Evidence Type"
                                select
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceType}
                                onChange={(e) => handleSupplementalEvidenceChange(index, evidenceIndex, 'evidenceType', e.target.value)}
                                required
                                error={errors[`contribution_${index}_supplementalEvidence_${evidenceIndex}_type`]}
                                helperText={errors[`contribution_${index}_supplementalEvidence_${evidenceIndex}_type`] ? 'Evidence Type is required' : ''}
                              >
                                {evidenceTypeOptions.map(opt => (
                                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                              </TextField>

                              <TextField
                                label="Supporting Links"
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceLink}
                                onChange={(e) => handleSupplementalEvidenceChange(index, evidenceIndex, 'evidenceLink', e.target.value)}
                                required={!evidence.evidenceAttachment}
                                error={errors[`contribution_${index}_supplementalEvidence_${evidenceIndex}_links`]}
                                helperText={errors[`contribution_${index}_supplementalEvidence_${evidenceIndex}_links`] ? 'Supporting Links are required' : ''}
                              />

                              <FileUploadButton
                                label="Attachments"
                                fileType="supplementalEvidenceAttachment"
                                onFileUrlChange={(url: string | null) => handleSupplementalEvidenceChange(index, evidenceIndex, 'evidenceAttachment', url || '')}
                                required={!evidence.evidenceLink}
                                error={errors[`contribution_${index}_supplementalEvidence_${evidenceIndex}_attachments`]}
                              />

                              <TextField
                                label="Remarks"
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceRemarks}
                                onChange={(e) => handleSupplementalEvidenceChange(index, evidenceIndex, 'evidenceRemarks', e.target.value)}
                                required
                                multiline
                                rows={2}
                                error={errors[`contribution_${index}_supplementalEvidence_${evidenceIndex}_remarks`]}
                                helperText={errors[`contribution_${index}_supplementalEvidence_${evidenceIndex}_remarks`] ? 'Remarks are required' : ''}
                              />
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Industry Submission Section */}
      {showIndustrySection && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Industry Submission</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddIndustryContribution}
              variant="outlined"
              size="small"
            >
              Add Contribution
            </Button>
          </Box>

          {industryContributions.map((contribution, index) => (
            <Accordion key={index} sx={{ mb: 1 }} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography>
                    {contribution.projectTitle || `Contribution ${index + 1}`}
                  </Typography>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteIndustryContribution(index);
                    }}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    label="Project Title"
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                    value={contribution.projectTitle}
                    onChange={(e) => handleIndustryContributionChange(index, 'projectTitle', e.target.value)}
                    required
                    error={errors[`industry_contribution_${index}_title`]}
                    helperText={errors[`industry_contribution_${index}_title`] ? 'Project Title is required' : ''}
                  />

                  <TextField
                    label="Project Background"
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                    value={contribution.projectBackground}
                    onChange={(e) => handleIndustryContributionChange(index, 'projectBackground', e.target.value)}
                    required
                    multiline
                    rows={3}
                    error={errors[`industry_contribution_${index}_background`]}
                    helperText={errors[`industry_contribution_${index}_background`] ? 'Project Background is required' : ''}
                  />

                  <TextField
                    label="Your Specific Contribution"
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                    value={contribution.yourContribution}
                    onChange={(e) => handleIndustryContributionChange(index, 'yourContribution', e.target.value)}
                    required
                    multiline
                    rows={3}
                    error={errors[`industry_contribution_${index}_contribution`]}
                    helperText={errors[`industry_contribution_${index}_contribution`] ? 'Your Specific Contribution is required' : ''}
                  />

                  <TextField
                    label="Project Outcomes"
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                    value={contribution.projectOutcomes}
                    onChange={(e) => handleIndustryContributionChange(index, 'projectOutcomes', e.target.value)}
                    required
                    multiline
                    rows={3}
                    error={errors[`industry_contribution_${index}_outcomes`]}
                    helperText={errors[`industry_contribution_${index}_outcomes`] ? 'Project Outcomes are required' : ''}
                  />

                  {/* Project-Level Evidence Section */}
                  <Accordion sx={{ mb: 2 }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight={600}>Project-Level Evidence</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddProjectEvidence(index)}
                            variant="outlined"
                            size="small"
                          >
                            Add Evidence
                          </Button>
                        </Box>

                        {contribution.projectEvidences?.map((evidence, evidenceIndex) => (
                          <Accordion key={evidenceIndex} sx={{ mb: 2 }} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                <Typography>
                                  {evidence.evidenceType || `Evidence ${evidenceIndex + 1}`}
                                </Typography>
                                <Box
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProjectEvidence(index, evidenceIndex);
                                  }}
                                  sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 32,
                                    height: 32,
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                      borderRadius: '50%'
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <TextField
                                label="Evidence Type"
                                select
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceType}
                                onChange={(e) => handleProjectEvidenceChange(index, evidenceIndex, 'evidenceType', e.target.value)}
                                required
                                error={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_type`]}
                                helperText={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_type`] ? 'Evidence Type is required' : ''}
                              >
                                {evidenceTypeOptions.map(opt => (
                                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                              </TextField>

                              <TextField
                                label="Supporting Links"
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceLinks}
                                onChange={(e) => handleProjectEvidenceChange(index, evidenceIndex, 'evidenceLinks', e.target.value)}
                                required={!evidence.evidenceAttachments}
                                error={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_links`]}
                                helperText={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_links`] ? 'Supporting Links are required' : ''}
                              />

                              <FileUploadButton
                                label="Attachments"
                                fileType="projectEvidenceAttachment"
                                onFileUrlChange={(url: string | null) => handleProjectEvidenceChange(index, evidenceIndex, 'evidenceAttachments', url || '')}
                                required={!evidence.evidenceLinks}
                                error={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_attachments`]}
                              />

                              <TextField
                                label="Remarks"
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceRemarks}
                                onChange={(e) => handleProjectEvidenceChange(index, evidenceIndex, 'evidenceRemarks', e.target.value)}
                                required
                                multiline
                                rows={2}
                                error={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_remarks`]}
                                helperText={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_remarks`] ? 'Remarks are required' : ''}
                              />

                              <TextField
                                label="Does this evidence have applicant proof?"
                                select
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceHasApplicantProof}
                                onChange={(e) => handleProjectEvidenceChange(index, evidenceIndex, 'evidenceHasApplicantProof', e.target.value)}
                                required
                                error={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_hasApplicantProof`]}
                                helperText={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_hasApplicantProof`] ? 'Applicant Proof is required' : ''}
                              >
                                {yesNoOptions.map(opt => (
                                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                              </TextField>

                              {evidence.evidenceHasApplicantProof === 'Yes' && (
                                <Box sx={{ mt: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <Button
                                      startIcon={<AddIcon />}
                                      onClick={() => handleAddApplicantProof(index, evidenceIndex)}
                                      variant="outlined"
                                      size="small"
                                    >
                                      Add Applicant Proof
                                    </Button>
                                  </Box>

                                  {evidence.applicantProofs?.map((proof, proofIndex) => (
                                    <Accordion key={proofIndex} sx={{ mb: 2 }} defaultExpanded>
                                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                          <Typography>
                                            {proof.proofType || `Proof ${proofIndex + 1}`}
                                          </Typography>
                                          <Box
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteApplicantProof(index, evidenceIndex, proofIndex);
                                            }}
                                            sx={{
                                              cursor: 'pointer',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              width: 32,
                                              height: 32,
                                              '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                borderRadius: '50%'
                                              }
                                            }}
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </Box>
                                        </Box>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        <TextField
                                          label="Proof Type"
                                          select
                                          fullWidth
                                          size="small"
                                          sx={{ mb: 2 }}
                                          value={proof.proofType}
                                          onChange={(e) => handleApplicantProofChange(index, evidenceIndex, proofIndex, 'proofType', e.target.value)}
                                          required
                                          error={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_type`]}
                                          helperText={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_type`] ? 'Proof Type is required' : ''}
                                        >
                                          {applicantProofTypeOptions.map(opt => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                          ))}
                                        </TextField>

                                        <TextField
                                          label="Proof Links"
                                          fullWidth
                                          size="small"
                                          sx={{ mb: 2 }}
                                          value={proof.proofLinks}
                                          onChange={(e) => handleApplicantProofChange(index, evidenceIndex, proofIndex, 'proofLinks', e.target.value)}
                                          required={!proof.proofFiles}
                                          error={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_links`]}
                                          helperText={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_links`] ? 'Proof Links are required' : ''}
                                        />

                                        <FileUploadButton
                                          label="Proof Files"
                                          fileType="applicantProofFile"
                                          onFileUrlChange={(url: string | null) => handleApplicantProofChange(index, evidenceIndex, proofIndex, 'proofFiles', url || '')}
                                          required={!proof.proofLinks}
                                          error={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_files`]}
                                        />

                                        <TextField
                                          label="Proof Explanation"
                                          fullWidth
                                          size="small"
                                          sx={{ mb: 2 }}
                                          value={proof.proofExplanation}
                                          onChange={(e) => handleApplicantProofChange(index, evidenceIndex, proofIndex, 'proofExplanation', e.target.value)}
                                          required
                                          multiline
                                          rows={2}
                                          error={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_explanation`]}
                                          helperText={errors[`industry_contribution_${index}_evidence_${evidenceIndex}_applicantProof_${proofIndex}_explanation`] ? 'Proof Explanation is required' : ''}
                                        />
                                      </AccordionDetails>
                                    </Accordion>
                                  ))}
                                </Box>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Supplemental Evidence Section */}
                  <Accordion sx={{ mb: 2 }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight={600}>Supplemental Evidence</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddIndustrySupplementalEvidence(index)}
                            variant="outlined"
                            size="small"
                          >
                            Add Evidence
                          </Button>
                        </Box>

                        {contribution.supplementalEvidences?.map((evidence, evidenceIndex) => (
                          <Accordion key={evidenceIndex} sx={{ mb: 2 }} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                <Typography>
                                  {evidence.evidenceType || `Evidence ${evidenceIndex + 1}`}
                                </Typography>
                                <Box
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteIndustrySupplementalEvidence(index, evidenceIndex);
                                  }}
                                  sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 32,
                                    height: 32,
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                      borderRadius: '50%'
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <TextField
                                label="Evidence Type"
                                select
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceType}
                                onChange={(e) => handleIndustrySupplementalEvidenceChange(index, evidenceIndex, 'evidenceType', e.target.value)}
                                required
                                error={errors[`industry_contribution_${index}_supplementalEvidence_${evidenceIndex}_type`]}
                                helperText={errors[`industry_contribution_${index}_supplementalEvidence_${evidenceIndex}_type`] ? 'Evidence Type is required' : ''}
                              >
                                {evidenceTypeOptions.map(opt => (
                                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                              </TextField>

                              <TextField
                                label="Supporting Links"
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceLink}
                                onChange={(e) => handleIndustrySupplementalEvidenceChange(index, evidenceIndex, 'evidenceLink', e.target.value)}
                                required={!evidence.evidenceAttachment}
                                error={errors[`industry_contribution_${index}_supplementalEvidence_${evidenceIndex}_links`]}
                                helperText={errors[`industry_contribution_${index}_supplementalEvidence_${evidenceIndex}_links`] ? 'Supporting Links are required' : ''}
                              />

                              <FileUploadButton
                                label="Attachments"
                                fileType="industrySupplementalEvidenceAttachment"
                                onFileUrlChange={(url: string | null) => handleIndustrySupplementalEvidenceChange(index, evidenceIndex, 'evidenceAttachment', url || '')}
                                required={!evidence.evidenceLink}
                                error={errors[`industry_contribution_${index}_supplementalEvidence_${evidenceIndex}_attachments`]}
                              />

                              <TextField
                                label="Remarks"
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                value={evidence.evidenceRemarks}
                                onChange={(e) => handleIndustrySupplementalEvidenceChange(index, evidenceIndex, 'evidenceRemarks', e.target.value)}
                                required
                                multiline
                                rows={2}
                                error={errors[`industry_contribution_${index}_supplementalEvidence_${evidenceIndex}_remarks`]}
                                helperText={errors[`industry_contribution_${index}_supplementalEvidence_${evidenceIndex}_remarks`] ? 'Remarks are required' : ''}
                              />
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={validationDialog.open}
        onClose={() => setValidationDialog({ open: false, message: '' })}
      >
        <DialogTitle>Validation Error</DialogTitle>
        <DialogContent>
          <Typography>{validationDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationDialog({ open: false, message: '' })}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default InfoCollNiwPetition;
