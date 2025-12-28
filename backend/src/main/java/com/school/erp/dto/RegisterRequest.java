package com.school.erp.dto;

import com.school.erp.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required")
    private User.Role role;

    // For STUDENT
    private String name;
    private String rollNo;
    private String section;
    private Long classId;
    private String parent;
    private String phone;

    // For EMPLOYEE
    private String employeeName;
    private String subject;
    private Long classInChargeId;
    private String email;
    private String qualification;
}
