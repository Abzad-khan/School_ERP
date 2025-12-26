package com.school.erp.repository;

import com.school.erp.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findBySchoolClass_ClassName(String className);
    Optional<Student> findByUserId(Long userId);
}
