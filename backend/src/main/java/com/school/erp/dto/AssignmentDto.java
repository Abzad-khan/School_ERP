package com.school.erp.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDto {
    private Long id;
    private String title;
    private String description;
    private String className;
    private LocalDate dueDate;
    private String attachmentUrl;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private Integer submissionCount;
}
