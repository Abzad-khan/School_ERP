package com.school.erp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BadgeDto {
    private Long id;
    private String name;
    private String description;
    private Integer pointsRequired;
}
