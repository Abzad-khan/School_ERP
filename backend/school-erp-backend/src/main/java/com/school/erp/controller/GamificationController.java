package com.school.erp.controller;

import com.school.erp.model.Gamification;
import com.school.erp.repository.GamificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gamification")
@CrossOrigin(origins = "http://localhost:5173")
public class GamificationController {

    private final GamificationRepository repo;

    public GamificationController(GamificationRepository repo) {
        this.repo = repo;
    }

    // GET all
    @GetMapping
    public List<Gamification> getAll() {
        return repo.findAll();
    }

    // POST new
    @PostMapping
    public Gamification create(@RequestBody Gamification g) {
        return repo.save(g);
    }

    // PUT update
    @PutMapping("/{id}")
    public Gamification update(@PathVariable Long id, @RequestBody Gamification g) {
        Gamification existing = repo.findById(id).orElseThrow();

        existing.setStudentName(g.getStudentName());
        existing.setBadge(g.getBadge());
        existing.setPoints(g.getPoints());

        return repo.save(existing);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
