package com.school.erp.controller;

import com.school.erp.entity.User;
import com.school.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ChatUserDto>> getUsersForChat() {
        User current = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ChatUserDto> users = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(current.getId()))
                .map(u -> new ChatUserDto(u.getId(), u.getUsername()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    public record ChatUserDto(Long id, String username) {}
}
