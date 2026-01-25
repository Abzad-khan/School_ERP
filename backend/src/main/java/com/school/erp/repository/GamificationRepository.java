package com.school.erp.repository;

import com.school.erp.entity.Gamification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GamificationRepository extends JpaRepository<Gamification, Long> {
    List<Gamification> findByClassNameOrderByPointsDesc(String className);
    Optional<Gamification> findByStudentIdAndClassName(Long studentId, String className);
}
