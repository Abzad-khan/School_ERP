package com.school.erp.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSubmissionDto {
    private Long id;
    private Long assignmentId;
    private Long studentId;
    private String studentName;
    private String rollNo;
    private String className;
    private String fileUrl;
    private LocalDateTime submittedAt;
}
