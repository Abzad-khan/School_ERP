package com.school.erp.controller;

import com.school.erp.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload/assignments")
    public ResponseEntity<String> uploadAssignmentFile(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileStorageService.store(file, "assignments");
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload/submissions")
    public ResponseEntity<String> uploadSubmissionFile(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileStorageService.store(file, "submissions");
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{subDir}/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String subDir, @PathVariable String filename) {
        try {
            Path file = fileStorageService.load(subDir, filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                        .body(resource);
            }
        } catch (Exception ignored) {}
        return ResponseEntity.notFound().build();
    }
}
