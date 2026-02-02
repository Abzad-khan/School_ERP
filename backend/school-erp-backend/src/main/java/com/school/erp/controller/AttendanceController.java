package com.school.erp.controller;

import com.school.erp.model.Attendance;
import com.school.erp.repository.AttendanceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin
public class AttendanceController {

    private final AttendanceRepository repo;

    public AttendanceController(AttendanceRepository repo) {
        this.repo = repo;
    }

    // READ ALL
    @GetMapping
    public List<Attendance> getAll() {
        return repo.findAll();
    }

    // CREATE
    @PostMapping
    public Attendance create(@RequestBody Attendance a) {
        return repo.save(a);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Attendance update(@PathVariable Long id, @RequestBody Attendance a) {
        a.setId(id);
        return repo.save(a);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}

