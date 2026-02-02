package com.school.erp.controller;

import com.school.erp.model.Assignment;
import com.school.erp.repository.AssignmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin
public class AssignmentController {

    private final AssignmentRepository repo;

    public AssignmentController(AssignmentRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Assignment> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Assignment create(@RequestBody Assignment a) {
        return repo.save(a);
    }

    @PutMapping("/{id}")
    public Assignment update(@PathVariable Long id, @RequestBody Assignment a) {
        a.setId(id);
        return repo.save(a);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
