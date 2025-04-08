package com.demo.demo0.pojo;

public class Common {
    public class EnumType {
        public enum BoolEnum {
            Yes,
            No
        }

        public enum GenderEnum {
            Male,
            Female,
            Other
        }

        // TODO 应该有库
        public enum CountryEnum {
            US,
            NonUS
        }

        public enum VisaStatusEnum {
            VisaAbroad,
            AdjustStatus,
        }

        public enum DegreeEnum {
            Bachelor,
            Master,
            Doctorate,
            Other
        }
    }
}