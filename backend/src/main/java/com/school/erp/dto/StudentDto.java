package com.school.erp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDto {
    private Long id;
    private String name;
    private String rollNo;
    private String username;
    private String section;
    private String className;
    private String parent;
    private String phone;
}
