package com.school.erp.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementDto {
    private Long id;
    private String title;
    private String message;
    private String className;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
}
