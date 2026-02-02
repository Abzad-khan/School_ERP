package com.school.erp.controller;

import com.school.erp.model.Certificate;
import com.school.erp.repository.CertificateRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin
public class CertificateController {

    private final CertificateRepository repo;

    public CertificateController(CertificateRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Certificate> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Certificate add(@RequestBody Certificate c) {
        c.setIssueDate(LocalDate.now());
        return repo.save(c);
    }

    
    @PutMapping("/{id}")
    public Certificate update(@PathVariable Long id, @RequestBody Certificate c) {
        c.setId(id);
        return repo.save(c);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
