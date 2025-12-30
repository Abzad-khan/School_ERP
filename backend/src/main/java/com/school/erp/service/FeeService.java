package com.school.erp.service;

import com.school.erp.dto.FeeDto;
import com.school.erp.entity.Fee;
import com.school.erp.entity.Fee.FeeStatus;
import com.school.erp.entity.Student;
import com.school.erp.entity.User;
import com.school.erp.repository.FeeRepository;
import com.school.erp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<FeeDto> getAllFees() {
        return feeRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeeDto> getMyFees() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        return feeRepository.findByStudentId(student.getId()).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FeeDto getById(Long id) {
        Fee f = feeRepository.findById(id).orElseThrow(() -> new RuntimeException("Fee not found: " + id));
        return toDto(f);
    }

    @Transactional
    public FeeDto create(Long studentId, BigDecimal amount, FeeStatus status) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Fee fee = Fee.builder()
                .student(student)
                .amount(amount)
                .status(status != null ? status : FeeStatus.PENDING)
                .build();
        fee = feeRepository.save(fee);
        return toDto(fee);
    }

    @Transactional
    public FeeDto update(Long id, BigDecimal amount, FeeStatus status) {
        Fee fee = feeRepository.findById(id).orElseThrow(() -> new RuntimeException("Fee not found: " + id));
        if (amount != null) fee.setAmount(amount);
        if (status != null) fee.setStatus(status);
        fee = feeRepository.save(fee);
        return toDto(fee);
    }

    @Transactional
    public void delete(Long id) {
        feeRepository.deleteById(id);
    }

    private FeeDto toDto(Fee f) {
        return FeeDto.builder()
                .id(f.getId())
                .studentId(f.getStudent().getId())
                .studentName(f.getStudent().getName())
                .amount(f.getAmount())
                .status(f.getStatus())
                .build();
    }
}
