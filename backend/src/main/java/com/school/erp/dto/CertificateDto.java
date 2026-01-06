package com.school.erp.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String type;
    private LocalDate issuedDate;
}
