package com.school.erp.service;

import com.school.erp.dto.RegisterRequest;
import com.school.erp.dto.EmployeeDto;
import com.school.erp.entity.Employee;
import com.school.erp.entity.SchoolClass;
import com.school.erp.entity.User;
import com.school.erp.repository.EmployeeRepository;
import com.school.erp.repository.SchoolClassRepository;
import com.school.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));
        return toDto(employee);
    }

    @Transactional
    public EmployeeDto createEmployee(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.EMPLOYEE)
                .build();
        user = userRepository.save(user);

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
        userRepository.save(user);

        if (request.getClassInChargeId() != null) {
            SchoolClass schoolClass = schoolClassRepository.findById(request.getClassInChargeId()).orElse(null);
            if (schoolClass != null) {
                schoolClass.setTeacher(employee);
                schoolClassRepository.save(schoolClass);
            }
        }
        return toDto(employee);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, String name, String subject, Long classInChargeId, String phone, String email, String qualification) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));
        if (name != null) employee.setName(name);
        if (subject != null) employee.setSubject(subject);
        if (phone != null) employee.setPhone(phone);
        if (email != null) employee.setEmail(email);
        if (qualification != null) employee.setQualification(qualification);
        if (classInChargeId != null) {
            SchoolClass schoolClass = schoolClassRepository.findById(classInChargeId).orElse(null);
            // Remove from old class
            if (employee.getClassInCharge() != null) {
                employee.getClassInCharge().setTeacher(null);
                schoolClassRepository.save(employee.getClassInCharge());
            }
            if (schoolClass != null) {
                schoolClass.setTeacher(employee);
                schoolClassRepository.save(schoolClass);
            }
        }
        employee = employeeRepository.save(employee);
        return toDto(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));
        if (employee.getClassInCharge() != null) {
            employee.getClassInCharge().setTeacher(null);
            schoolClassRepository.save(employee.getClassInCharge());
        }
        userRepository.delete(employee.getUser());
    }

    private EmployeeDto toDto(Employee e) {
        return EmployeeDto.builder()
                .id(e.getId())
                .name(e.getName())
                .username(e.getUser() != null ? e.getUser().getUsername() : null)
                .subject(e.getSubject())
                .classInCharge(e.getClassInCharge() != null ? e.getClassInCharge().getClassName() : null)
                .phone(e.getPhone())
                .email(e.getEmail())
                .qualification(e.getQualification())
                .build();
    }
}
