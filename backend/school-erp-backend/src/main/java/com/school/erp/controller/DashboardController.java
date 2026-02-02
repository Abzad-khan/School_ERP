package com.school.erp.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.school.erp.repository.AssignmentRepository;
import com.school.erp.repository.AttendanceRepository;
import com.school.erp.repository.FeeRepository;
import com.school.erp.repository.StudentRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired StudentRepository studentRepo;
    @Autowired AssignmentRepository assignmentRepo;
    @Autowired AttendanceRepository attendanceRepo;
    @Autowired FeeRepository feeRepo;

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("students", studentRepo.count());
        stats.put("assignments", assignmentRepo.count());
        stats.put("attendance", attendanceRepo.count());
        stats.put("fees", feeRepo.count());
        return stats;
    }
}
