package com.school.erp.service;

import com.school.erp.dto.DashboardStatsDto;
import com.school.erp.entity.Attendance;
import com.school.erp.entity.Fee.FeeStatus;
import com.school.erp.entity.Student;
import com.school.erp.entity.User;
import com.school.erp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeeRepository feeRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = employeeRepository.count();
        long totalClasses = schoolClassRepository.count();
        long feesPending = feeRepository.countByStatus(FeeStatus.PENDING);

        List<Attendance> allAtt = attendanceRepository.findAll();
        long present = allAtt.stream().filter(a -> "P".equals(a.getStatus())).count();
        double attendancePercentage = allAtt.isEmpty() ? 0 : (present * 100.0 / allAtt.size());

        List<Map<String, Object>> studentsPerClass = schoolClassRepository.findAll().stream()
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("className", c.getClassName());
                    m.put("count", c.getStudents() != null ? c.getStudents().size() : 0);
                    return m;
                })
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalClasses(totalClasses)
                .feesPending(feesPending)
                .attendancePercentage(Math.round(attendancePercentage * 10) / 10.0)
                .studentsPerClass(studentsPerClass)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getStudentDashboardStats() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByUserId(user.getId()).orElse(null);
        if (student == null) return DashboardStatsDto.builder().build();

        List<Attendance> myAtt = attendanceRepository.findByStudentId(student.getId());
        long present = myAtt.stream().filter(a -> "P".equals(a.getStatus())).count();
        double attendancePercentage = myAtt.isEmpty() ? 0 : (present * 100.0 / myAtt.size());

        long feesPending = feeRepository.findByStudentId(student.getId()).stream()
                .filter(f -> f.getStatus() == FeeStatus.PENDING).count();

        return DashboardStatsDto.builder()
                .totalStudents(1)
                .totalTeachers(0)
                .totalClasses(student.getSchoolClass() != null ? 1 : 0)
                .feesPending(feesPending)
                .attendancePercentage(Math.round(attendancePercentage * 10) / 10.0)
                .studentsPerClass(List.of())
                .build();
    }
}
