package com.school.erp.controller;

import com.school.erp.dto.ChatMessageDto;
import com.school.erp.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<Long>> getConversations() {
        return ResponseEntity.ok(chatService.getConversationUserIds());
    }

    @GetMapping("/with/{userId}")
    public ResponseEntity<List<ChatMessageDto>> getConversationWith(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getConversationWith(userId));
    }

    @PostMapping
    public ResponseEntity<ChatMessageDto> sendMessage(@RequestBody Map<String, Object> body) {
        Long receiverId = ((Number) body.get("receiverId")).longValue();
        String message = (String) body.get("message");
        return ResponseEntity.ok(chatService.sendMessage(receiverId, message));
    }
}
