package com.school.erp.service;

import com.school.erp.dto.ClassDto;
import com.school.erp.dto.StudentDto;
import com.school.erp.entity.Employee;
import com.school.erp.entity.SchoolClass;
import com.school.erp.entity.Student;
import com.school.erp.repository.EmployeeRepository;
import com.school.erp.repository.SchoolClassRepository;
import com.school.erp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final SchoolClassRepository classRepository;
    private final EmployeeRepository employeeRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<ClassDto> getAllClasses() {
        return classRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClassDto getClassById(Long id) {
        SchoolClass schoolClass = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found: " + id));
        return toDto(schoolClass);
    }

    @Transactional
    public ClassDto createClass(String className, Long teacherId) {
        if (classRepository.existsByClassName(className)) {
            throw new RuntimeException("Class already exists: " + className);
        }
        Employee teacher = teacherId != null
                ? employeeRepository.findById(teacherId).orElse(null)
                : null;
        SchoolClass schoolClass = SchoolClass.builder()
                .className(className)
                .teacher(teacher)
                .build();
        schoolClass = classRepository.save(schoolClass);
        return toDto(schoolClass);
    }

    @Transactional
    public ClassDto updateClass(Long id, String className, Long teacherId, List<Long> studentIds) {
        SchoolClass schoolClass = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found: " + id));
        if (className != null) schoolClass.setClassName(className);
        if (teacherId != null) {
            Employee teacher = employeeRepository.findById(teacherId)
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            schoolClass.setTeacher(teacher);
        }
        if (studentIds != null) {
            List<Student> students = studentRepository.findAllById(studentIds);
            schoolClass.getStudents().clear();
            schoolClass.getStudents().addAll(students);
            for (Student s : students) s.setSchoolClass(schoolClass);
        }
        schoolClass = classRepository.save(schoolClass);
        return toDto(schoolClass);
    }

    @Transactional
    public void deleteClass(Long id) {
        if (!classRepository.existsById(id)) {
            throw new RuntimeException("Class not found: " + id);
        }
        classRepository.deleteById(id);
    }

    private ClassDto toDto(SchoolClass sc) {
        List<StudentDto> students = sc.getStudents() != null
                ? sc.getStudents().stream().map(this::toStudentDto).collect(Collectors.toList())
                : List.of();
        return ClassDto.builder()
                .id(sc.getId())
                .className(sc.getClassName())
                .teacherId(sc.getTeacher() != null ? sc.getTeacher().getId() : null)
                .teacherName(sc.getTeacher() != null ? sc.getTeacher().getName() : null)
                .students(students)
                .build();
    }

    private StudentDto toStudentDto(Student s) {
        return StudentDto.builder()
                .id(s.getId())
                .name(s.getName())
                .rollNo(s.getRollNo())
                .username(s.getUser() != null ? s.getUser().getUsername() : null)
                .section(s.getSection())
                .className(s.getSchoolClass() != null ? s.getSchoolClass().getClassName() : null)
                .build();
    }
}
