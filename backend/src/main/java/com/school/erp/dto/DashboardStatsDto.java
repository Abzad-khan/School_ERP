package com.school.erp.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private long totalStudents;
    private long totalTeachers;
    private long totalClasses;
    private long feesPending;
    private double attendancePercentage;
    private List<Map<String, Object>> studentsPerClass;
}
