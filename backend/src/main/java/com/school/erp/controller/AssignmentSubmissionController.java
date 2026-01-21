package com.school.erp.controller;

import com.school.erp.dto.AssignmentSubmissionDto;
import com.school.erp.service.AssignmentSubmissionService;
import com.school.erp.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentSubmissionController {

    private final AssignmentSubmissionService submissionService;
    private final FileStorageService fileStorageService;

    @GetMapping("/{assignmentId}/submissions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<List<AssignmentSubmissionDto>> getSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getByAssignmentId(assignmentId));
    }

    @GetMapping("/{assignmentId}/submissions/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AssignmentSubmissionDto> getMySubmission(@PathVariable Long assignmentId) {
        AssignmentSubmissionDto dto = submissionService.getMySubmission(assignmentId);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
    }

    @PostMapping("/{assignmentId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AssignmentSubmissionDto> submit(
            @PathVariable Long assignmentId,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageService.store(file, "submissions");
            return ResponseEntity.ok(submissionService.submit(assignmentId, fileUrl));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file");
        }
    }
}
