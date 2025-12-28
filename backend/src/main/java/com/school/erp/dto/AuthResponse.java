package com.school.erp.dto;

import com.school.erp.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String role;
    private String username;

    public static AuthResponse from(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .username(user.getUsername())
                .build();
    }
}
