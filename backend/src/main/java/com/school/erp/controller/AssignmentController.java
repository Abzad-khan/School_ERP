package com.school.erp.controller;

import com.school.erp.dto.AssignmentDto;
import com.school.erp.service.AssignmentService;
import com.school.erp.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final FileStorageService fileStorageService;

    @GetMapping("/class/{className}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or hasRole('STUDENT')")
    public ResponseEntity<List<AssignmentDto>> getByClass(@PathVariable String className) {
        return ResponseEntity.ok(assignmentService.getByClassName(className));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or hasRole('STUDENT')")
    public ResponseEntity<AssignmentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<AssignmentDto> create(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("className") String className,
            @RequestParam("dueDate") String dueDate,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        Map<String, Object> body = new HashMap<>();
        body.put("title", title);
        body.put("description", description);
        body.put("className", className);
        body.put("dueDate", dueDate);
        String attachmentUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                attachmentUrl = fileStorageService.store(file, "assignments");
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file");
            }
        }
        return ResponseEntity.ok(assignmentService.create(body, attachmentUrl));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<AssignmentDto> update(
            @PathVariable Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "dueDate", required = false) String dueDate,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        Map<String, Object> body = new HashMap<>();
        if (title != null) body.put("title", title);
        if (description != null) body.put("description", description);
        if (dueDate != null) body.put("dueDate", dueDate);
        String attachmentUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                attachmentUrl = fileStorageService.store(file, "assignments");
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file");
            }
        }
        return ResponseEntity.ok(assignmentService.update(id, body, attachmentUrl));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assignmentService.delete(id);
        return ResponseEntity.ok().build();
    }
}
