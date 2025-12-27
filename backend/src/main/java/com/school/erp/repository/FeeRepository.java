package com.school.erp.repository;

import com.school.erp.entity.Fee;
import com.school.erp.entity.Fee.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByStudentId(Long studentId);
    long countByStatus(FeeStatus status);
}
