package com.school.erp.service;

import com.school.erp.dto.AttendanceDto;
import com.school.erp.entity.Attendance;
import com.school.erp.entity.Student;
import com.school.erp.entity.User;
import com.school.erp.repository.AttendanceRepository;
import com.school.erp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<AttendanceDto> getByClassName(String className) {
        return attendanceRepository.findByClassName(className).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceDto> getByDate(LocalDate date) {
        return attendanceRepository.findByDate(date).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceDto> getByClassAndDate(String className, LocalDate date) {
        return attendanceRepository.findByClassNameAndDate(className, date).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceDto> getCurrentStudentAttendance() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        return attendanceRepository.findByStudentId(student.getId()).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public List<AttendanceDto> saveAttendance(String className, LocalDate date, List<Map<String, Object>> records) {
        for (Map<String, Object> r : records) {
            Long studentId = ((Number) r.get("studentId")).longValue();
            String status = (String) r.get("status");
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

            Attendance att = attendanceRepository.findByStudentIdAndDate(studentId, date).orElse(null);
            if (att != null) {
                att.setStatus(status);
                attendanceRepository.save(att);
            } else {
                att = Attendance.builder()
                        .student(student)
                        .className(className)
                        .date(date)
                        .status(status != null ? status : "P")
                        .build();
                attendanceRepository.save(att);
            }
        }
        return getByClassAndDate(className, date);
    }

    private AttendanceDto toDto(Attendance a) {
        return AttendanceDto.builder()
                .id(a.getId())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getName())
                .rollNo(a.getStudent().getRollNo())
                .className(a.getClassName())
                .date(a.getDate())
                .status(a.getStatus())
                .build();
    }
}
