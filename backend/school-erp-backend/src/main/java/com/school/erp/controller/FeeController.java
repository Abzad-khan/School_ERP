package com.school.erp.controller;

import com.school.erp.model.Fee;
import com.school.erp.repository.FeeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin
public class FeeController {

    private final FeeRepository repo;

    public FeeController(FeeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Fee> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Fee create(@RequestBody Fee f) {
        return repo.save(f);
    }

    @PutMapping("/{id}")
    public Fee update(@PathVariable Long id, @RequestBody Fee f) {
        f.setId(id);
        return repo.save(f);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
