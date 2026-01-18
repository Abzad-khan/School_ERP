package com.school.erp.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassDto {
    private Long id;
    private String className;
    private Long teacherId;
    private String teacherName;
    private List<StudentDto> students;
}
