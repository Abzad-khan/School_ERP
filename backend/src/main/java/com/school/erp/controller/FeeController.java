package com.school.erp.controller;

import com.school.erp.dto.FeeDto;
import com.school.erp.entity.Fee.FeeStatus;
import com.school.erp.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeeDto>> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<FeeDto>> getMyFees() {
        return ResponseEntity.ok(feeService.getMyFees());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeeDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(feeService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeeDto> create(@RequestBody Map<String, Object> body) {
        Long studentId = ((Number) body.get("studentId")).longValue();
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        FeeStatus status = body.get("status") != null
                ? FeeStatus.valueOf((String) body.get("status"))
                : FeeStatus.PENDING;
        return ResponseEntity.ok(feeService.create(studentId, amount, status));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeeDto> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        BigDecimal amount = body.get("amount") != null ? new BigDecimal(body.get("amount").toString()) : null;
        FeeStatus status = body.get("status") != null ? FeeStatus.valueOf((String) body.get("status")) : null;
        return ResponseEntity.ok(feeService.update(id, amount, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        feeService.delete(id);
        return ResponseEntity.ok().build();
    }
}
