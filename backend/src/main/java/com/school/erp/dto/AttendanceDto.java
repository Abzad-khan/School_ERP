package com.school.erp.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNo;
    private String className;
    private LocalDate date;
    private String status; // P = Present, A = Absent
}
