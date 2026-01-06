package com.school.erp.service;

import com.school.erp.dto.CertificateDto;
import com.school.erp.entity.Certificate;
import com.school.erp.entity.Student;
import com.school.erp.entity.User;
import com.school.erp.repository.CertificateRepository;
import com.school.erp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentRepository studentRepository;
    private final CertificatePdfGenerator certificatePdfGenerator; // ✅ REQUIRED FIELD

    // ================= READ =================

    @Transactional(readOnly = true)
    public List<CertificateDto> getAllCertificates() {
        return certificateRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CertificateDto> getMyCertificates() {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return certificateRepository.findByStudentId(student.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CertificateDto getById(Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
        return toDto(cert);
    }

    // ================= WRITE =================

    @Transactional
    public CertificateDto create(Long studentId, String type, LocalDate issuedDate) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Certificate cert = Certificate.builder()
                .student(student)
                .type(type)
                .issuedDate(issuedDate != null ? issuedDate : LocalDate.now())
                .build();

        return toDto(certificateRepository.save(cert));
    }

    @Transactional
    public void delete(Long id) {
        certificateRepository.deleteById(id);
    }

    // ================= PDF =================

    @Transactional(readOnly = true)
    public byte[] downloadPdf(Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        return certificatePdfGenerator.generateCertificate(cert); // ✅ WORKING
    }

    // ================= DTO =================

    private CertificateDto toDto(Certificate c) {
        return CertificateDto.builder()
                .id(c.getId())
                .studentId(c.getStudent().getId())
                .studentName(c.getStudent().getName())
                .type(c.getType())
                .issuedDate(c.getIssuedDate())
                .build();
    }
}
