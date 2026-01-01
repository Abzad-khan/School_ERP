package com.school.erp.service;

import com.school.erp.dto.AuthResponse;
import com.school.erp.dto.LoginRequest;
import com.school.erp.dto.RegisterRequest;
import com.school.erp.entity.*;
import com.school.erp.repository.*;
import com.school.erp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return AuthResponse.from(token, user);
    }

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        user = userRepository.save(user);

        switch (request.getRole()) {
            case STUDENT -> {
                SchoolClass schoolClass = request.getClassId() != null
                        ? schoolClassRepository.findById(request.getClassId())
                        .orElseThrow(() -> new RuntimeException("Class not found"))
                        : null;
                Student student = Student.builder()
                        .name(request.getName() != null ? request.getName() : "Student")
                        .rollNo(request.getRollNo() != null ? request.getRollNo() : "0")
                        .section(request.getSection() != null ? request.getSection() : "A")
                        .parent(request.getParent())
                        .phone(request.getPhone())
                        .user(user)
                        .schoolClass(schoolClass)
                        .build();
                studentRepository.save(student);
                user.setStudent(student);
            }
            case EMPLOYEE -> {
                SchoolClass classInCharge = request.getClassInChargeId() != null
                        ? schoolClassRepository.findById(request.getClassInChargeId())
                        .orElse(null)
                        : null;
                Employee employee = Employee.builder()
                        .name(request.getEmployeeName() != null ? request.getEmployeeName() : "Teacher")
                        .subject(request.getSubject() != null ? request.getSubject() : "General")
                        .phone(request.getPhone())
                        .email(request.getEmail())
                        .qualification(request.getQualification())
                        .user(user)
                        .build();
                employee = employeeRepository.save(employee);
                user.setEmployee(employee);
                if (classInCharge != null) {
                    classInCharge.setTeacher(employee);
                    schoolClassRepository.save(classInCharge);
                }
            }
            case ADMIN -> {
                // Admin user - no additional profile
            }
        }
    }
}
