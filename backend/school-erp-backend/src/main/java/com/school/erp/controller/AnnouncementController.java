package com.school.erp.controller;

import com.school.erp.model.Announcement;
import com.school.erp.repository.AnnouncementRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin
public class AnnouncementController {

    private final AnnouncementRepository repo;

    public AnnouncementController(AnnouncementRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Announcement> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Announcement create(@RequestBody Announcement a) {
        return repo.save(a);
    }

    @PutMapping("/{id}")
    public Announcement update(@PathVariable Long id, @RequestBody Announcement a) {
        a.setId(id);
        return repo.save(a);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
