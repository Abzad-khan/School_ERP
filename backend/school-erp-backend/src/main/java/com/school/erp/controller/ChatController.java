package com.school.erp.controller;

import com.school.erp.model.Message;
import com.school.erp.repository.MessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")   // 👈 MUST MATCH FRONTEND
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final MessageRepository repo;

    public ChatController(MessageRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Message> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Message create(@RequestBody Message m) {
        return repo.save(m);
    }

    @PutMapping("/{id}")
    public Message update(@PathVariable Long id, @RequestBody Message m) {
        Message existing = repo.findById(id).orElseThrow();
        existing.setSender(m.getSender());
        existing.setMessage(m.getMessage());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
