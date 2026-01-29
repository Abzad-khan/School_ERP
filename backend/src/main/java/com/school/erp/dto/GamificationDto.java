package com.school.erp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GamificationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNo;
    private String className;
    private Integer points;
    private String badges;
}
