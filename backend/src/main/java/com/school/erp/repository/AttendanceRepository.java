package com.school.erp.repository;

import com.school.erp.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByClassName(String className);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByClassNameAndDate(String className, LocalDate date);
    List<Attendance> findByStudentId(Long studentId);
    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);
}
