package com.demo.demo0.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static com.demo.demo0.settings.DATE_FORMAT;

@Getter
@Setter
@Table(name="info_collection")
@Entity
public class InfoCollection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ctime;

    @UpdateTimestamp
    private LocalDateTime mtime;

    public Integer userId;


    @Embedded
    public BasicInfo basicInfo;

    @Getter
    @Setter
    @Embeddable
    public class BasicInfo {
        private String biRespondents;
        private String biFirstName;
        private String biMiddleName;
        private String biLastName;
        private String biFullName;
        private String biEmail;

        @Enumerated(EnumType.STRING)
        private Common.EnumType.GenderEnum biGender;

        @Enumerated(EnumType.STRING)
        private PremiumProcessingEnum biPremiumProcessing;
        private enum PremiumProcessingEnum {
            Yes,
            No
        }

        private String biPhoneNumber;
        @DateTimeFormat(pattern = DATE_FORMAT)
        private LocalDate biDob;

        private String biSsn;
        private String biBirthLocation;
        private String biCitizenship;
        private String biUsAddress;
        private String biForeignAddressNative;
        private String biForeignAddressEng;

        @Enumerated(EnumType.STRING)
        private Common.EnumType.CountryEnum biResidenceCountry;


        @Enumerated(EnumType.STRING)
        private Common.EnumType.VisaStatusEnum biVisaStatus;

        private Integer biKidsCount;

        @Enumerated(EnumType.STRING)
        private ImmigrationPetitionEnum biImmigrationPetition;
        private enum ImmigrationPetitionEnum {
            Yes,
            No
        }

        private String biPetitionNotice;
        private String biPassport;
        private String biOldPassport;
        private String biVisaStamp;
        private String biI94;
        private String biNonimmigrantStatus;

        @Enumerated(EnumType.STRING)
        private MaritalStatusEnum biMaritalStatus;
        private enum MaritalStatusEnum {
            Yes,
            No
        }
    }

    @Embedded
    public SpouseInfo spouseInfo;

    @Getter
    @Setter
    @Embeddable
    public class SpouseInfo {
        private String spRespondents;
        private String spFirstName;
        private String spMiddleName;
        private String spLastName;

        @Enumerated(EnumType.STRING)
        private Common.EnumType.GenderEnum spGender;

        @DateTimeFormat(pattern = DATE_FORMAT)
        private LocalDate spDob;

        @Enumerated(EnumType.STRING)
        private Common.EnumType.VisaStatusEnum spVisaStatus;
    }

    @Embedded
    public ChildInfo childInfo;

    @Getter
    @Setter
    @Embeddable
    public class ChildInfo {
        private String chRespondents;
        private String chFirstName;
        private String chMiddleName;
        private String chLastName;

        @Enumerated(EnumType.STRING)
        private Common.EnumType.GenderEnum chGender;

        @DateTimeFormat(pattern = DATE_FORMAT)
        private LocalDate chDob;

        @Enumerated(EnumType.STRING)
        private Common.EnumType.VisaStatusEnum chVisaStatus;
    }

    @Embedded
    public Resume resume;

    @Getter
    @Setter
    @Embeddable
    public class Resume {
        private String resRespondents;
        private String resFile;
    }

    @Embedded
    public AcademicHistory academicHistory;
    @Getter
    @Setter
    @Embeddable
    public class AcademicHistory {
        private String ahRespondents;

        @Enumerated(EnumType.STRING)
        private Common.EnumType.DegreeEnum ahDegree;

        private String ahSchoolName;

        @Enumerated(EnumType.STRING)
        private AhStatus ahStatus;

        @DateTimeFormat(pattern = DATE_FORMAT)
        private LocalDate ahStartDate;

        @DateTimeFormat(pattern = DATE_FORMAT)
        private LocalDate ahEndDate;

        private String ahMajor;

        @Enumerated(EnumType.STRING)
        private Common.EnumType.BoolEnum ahDocLanguage;
        private String ahTranscriptsOriginal;
        private String ahTranscriptsTranslated;
        private String ahDiplomaOriginal;
        private String ahDiplomaTranslated;

        @Enumerated(EnumType.STRING)
        private Common.EnumType.CountryEnum ahCountry;


        public enum AhStatus {
            COMPLETED, ONGOING, OTHER
        }
    }

    @Embedded
    public EmploymentHistory employmentHistory;

    @Getter
    @Setter
    @Embeddable
    public class EmploymentHistory {
        private String ehRespondents;
        private String ehEmployerName;
        @Enumerated(EnumType.STRING)
        private Common.EnumType.BoolEnum ehCurrentEmployer;
        private String ehEmployerAddress;
        private String ehPlaceOfEmployment;
        private String ehBusinessType;
        private String ehJobTitle;
        private BigDecimal ehSalary;
        @DateTimeFormat(pattern = DATE_FORMAT)
        private LocalDate ehStartDate;
        @DateTimeFormat(pattern = DATE_FORMAT)
        private LocalDate ehEndDate;
        private BigDecimal ehHoursPerWeek;
        private String ehJobSummary;
        private String ehEmployerWebsite;
        private String ehEmploymentLetter;
    }
    
    @Embedded
    public MaterialForNiwPetition materialForNiwPetition;

    @Getter
    @Setter
    @Embeddable
    public class MaterialForNiwPetition {

        @Enumerated(EnumType.STRING)
        private NiwUserPathEnum niwUserPath;
        private String niwUserPathRespondents;

        public enum NiwUserPathEnum {
            Academic, Industry, Hybrid
        }
    }


}
