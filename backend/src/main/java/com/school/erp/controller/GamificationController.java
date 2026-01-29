package com.school.erp.controller;

import com.school.erp.dto.GamificationDto;
import com.school.erp.dto.GamificationStatsDto;
import com.school.erp.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gamification")
@RequiredArgsConstructor
public class GamificationController {

    private final GamificationService gamificationService;

    @GetMapping("/class/{className}/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<GamificationStatsDto> getStats(@PathVariable String className) {
        return ResponseEntity.ok(gamificationService.getStats(className));
    }

    @GetMapping("/class/{className}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<List<GamificationDto>> getByClass(@PathVariable String className) {
        return ResponseEntity.ok(gamificationService.getByClassName(className));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GamificationDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(gamificationService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GamificationDto> create(@RequestBody Map<String, Object> body) {
        Long studentId = ((Number) body.get("studentId")).longValue();
        String className = (String) body.get("className");
        Integer points = body.get("points") != null ? ((Number) body.get("points")).intValue() : 0;
        String badges = (String) body.get("badges");
        return ResponseEntity.ok(gamificationService.create(studentId, className, points, badges));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GamificationDto> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Integer points = body.get("points") != null ? ((Number) body.get("points")).intValue() : null;
        String badges = (String) body.get("badges");
        return ResponseEntity.ok(gamificationService.update(id, points, badges));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gamificationService.delete(id);
        return ResponseEntity.ok().build();
    }
}
