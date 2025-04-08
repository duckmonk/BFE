package com.demo.demo0.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Table(name="assignment")
@Entity
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ctime;

    @UpdateTimestamp
    private LocalDateTime mtime;

    private Integer fromUserId;
    private Integer toUserId;

    @Enumerated(EnumType.STRING)
    private AssignmentType assignmentType;

    // 枚举定义
    public enum AssignmentType {
        poc_inq,
        bfe_send_out_attorney_inq,
        reviewer_inq
    }
}
