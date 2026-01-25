package com.school.erp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDto {
    private Long id;
    private String name;
    private String username;
    private String subject;
    private String classInCharge;
    private String phone;
    private String email;
    private String qualification;
}
