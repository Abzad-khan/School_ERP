package com.school.erp.dto;

import com.school.erp.entity.Fee.FeeStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private BigDecimal amount;
    private FeeStatus status;
}
