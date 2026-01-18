package com.school.erp.controller;

import com.school.erp.dto.ClassDto;
import com.school.erp.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    // ADMIN + TEACHER can view classes
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    public ResponseEntity<List<ClassDto>> getAllClasses() {
        return ResponseEntity.ok(classService.getAllClasses());
    }

    // ADMIN only
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassDto> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    // ADMIN only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassDto> createClass(@RequestBody Map<String, Object> body) {
        String className = (String) body.get("className");
        Long teacherId = body.get("teacherId") != null
                ? ((Number) body.get("teacherId")).longValue()
                : null;
        return ResponseEntity.ok(classService.createClass(className, teacherId));
    }

    // ADMIN only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassDto> updateClass(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String className = (String) body.get("className");
        Long teacherId = body.get("teacherId") != null
                ? ((Number) body.get("teacherId")).longValue()
                : null;
        @SuppressWarnings("unchecked")
        List<Long> studentIds = body.get("studentIds") != null
                ? ((List<Number>) body.get("studentIds")).stream().map(Number::longValue).toList()
                : null;
        return ResponseEntity.ok(classService.updateClass(id, className, teacherId, studentIds));
    }

    // ADMIN only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.ok().build();
    }
}
