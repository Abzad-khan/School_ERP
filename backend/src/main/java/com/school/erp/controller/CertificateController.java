package com.school.erp.controller;

import com.school.erp.dto.CertificateDto;
import com.school.erp.entity.User;
import com.school.erp.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CertificateDto>> getAll() {
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CertificateDto>> getMine() {
        return ResponseEntity.ok(certificateService.getMyCertificates());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CertificateDto> create(@RequestBody Map<String, Object> body) {
        Long studentId = ((Number) body.get("studentId")).longValue();
        String type = (String) body.get("type");
        LocalDate issuedDate = LocalDate.parse((String) body.get("issuedDate"));
        return ResponseEntity.ok(certificateService.create(studentId, type, issuedDate));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        certificateService.delete(id);
        return ResponseEntity.ok().build();
    }

    // 🔥 DOWNLOAD ENDPOINT
@GetMapping("/{id}/download")
@PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
public ResponseEntity<byte[]> download(@PathVariable Long id) {

    byte[] pdf = certificateService.downloadPdf(id);

    return ResponseEntity.ok()
            .header("Content-Type", "application/pdf")
            .header("Content-Disposition", "attachment; filename=certificate-" + id + ".pdf")
            .body(pdf);
}

}
