package com.school.erp.service;

import com.school.erp.dto.RegisterRequest;
import com.school.erp.dto.StudentDto;
import com.school.erp.entity.SchoolClass;
import com.school.erp.entity.Student;
import com.school.erp.entity.User;
import com.school.erp.repository.SchoolClassRepository;
import com.school.erp.repository.StudentRepository;
import com.school.erp.repository.UserRepository;
import com.school.erp.repository.AssignmentSubmissionRepository;
import com.school.erp.repository.AttendanceRepository;
import com.school.erp.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final PasswordEncoder passwordEncoder;
    private final AttendanceRepository attendanceRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentDto> getStudentsByClass(String className) {
        return studentRepository.findBySchoolClass_ClassName(className).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        return toDto(student);
    }

    @Transactional(readOnly = true)
    public StudentDto getCurrentStudent() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        return toDto(student);
    }

    @Transactional
    public StudentDto createStudent(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }
        
        // Validate name, phone
        validateStudentData(request.getName(), request.getPhone(), request.getParent());
        
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

        SchoolClass schoolClass = request.getClassId() != null
                ? schoolClassRepository.findById(request.getClassId()).orElse(null)
                : null;

        Student student = Student.builder()
                .name(request.getName())
                .rollNo(request.getRollNo() != null ? request.getRollNo() : "0")
                .section(request.getSection() != null ? request.getSection() : "A")
                .parent(request.getParent())
                .phone(request.getPhone())
                .user(user)
                .schoolClass(schoolClass)
                .build();
        student = studentRepository.save(student);
        user.setStudent(student);
        userRepository.save(user);
        return toDto(student);
    }

    @Transactional
    public StudentDto updateStudent(Long id, String name, String rollNo, String section, Long classId, String parent, String phone) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        
        // Validate name, phone
        validateStudentData(name, phone, parent);
        
        if (name != null) student.setName(name);
        if (rollNo != null) student.setRollNo(rollNo);
        if (section != null) student.setSection(section);
        if (parent != null) student.setParent(parent);
        if (phone != null) student.setPhone(phone);
        if (classId != null) {
            SchoolClass schoolClass = schoolClassRepository.findById(classId)
                    .orElseThrow(() -> new RuntimeException("Class not found"));
            student.setSchoolClass(schoolClass);
        }
        student = studentRepository.save(student);
        return toDto(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        
        // Delete all related data first to avoid foreign key constraint violations
        if (student.getUser() != null && student.getUser().getId() != null) {
            Long userId = student.getUser().getId();
            chatMessageRepository.deleteAll(chatMessageRepository.findBySenderId(userId));
            chatMessageRepository.deleteAll(chatMessageRepository.findByReceiverId(userId));
        }
        
        attendanceRepository.deleteAll(attendanceRepository.findByStudentId(id));
        assignmentSubmissionRepository.deleteAll(assignmentSubmissionRepository.findByStudentId(id));
        studentRepository.delete(student);
        userRepository.delete(student.getUser());
    }

    //Validate student data - name and phone fields are mandatory
    private void validateStudentData(String name, String phone, String parent) {
        if (name == null || name.isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (!name.matches("^[a-zA-Z\\s]+$")) {
            throw new RuntimeException("Name should only contain letters and spaces");
        }

        if (!parent.matches("^[a-zA-Z\\s]+$")) {
            throw new RuntimeException("Parent name should only contain letters and spaces");
        }
        
        if (phone == null || phone.isEmpty()) {
            throw new RuntimeException("Phone is required");
        }
        if (!phone.matches("^\\d{10}$")) {
            throw new RuntimeException("Phone number should be exactly 10 digits");
        }
    }

    private StudentDto toDto(Student s) {
        return StudentDto.builder()
                .id(s.getId())
                .name(s.getName())
                .rollNo(s.getRollNo())
                .username(s.getUser() != null ? s.getUser().getUsername() : null)
                .section(s.getSection())
                .className(s.getSchoolClass() != null ? s.getSchoolClass().getClassName() : null)
                .parent(s.getParent())
                .phone(s.getPhone())
                .build();
    }
}
