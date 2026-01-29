package com.school.erp.service;

import com.school.erp.dto.ChatMessageDto;
import com.school.erp.entity.ChatMessage;
import com.school.erp.entity.User;
import com.school.erp.repository.ChatMessageRepository;
import com.school.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Long> getConversationUserIds() {
        User current = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ChatMessage> all = chatMessageRepository.findAll();
        Set<Long> ids = new HashSet<>();
        for (ChatMessage m : all) {
            if (m.getSender().getId().equals(current.getId()) || m.getReceiver().getId().equals(current.getId())) {
                ids.add(m.getSender().getId().equals(current.getId()) ? m.getReceiver().getId() : m.getSender().getId());
            }
        }
        return new ArrayList<>(ids);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getConversationWith(Long otherUserId) {
        User current = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return chatMessageRepository.findConversationBetweenUsers(current.getId(), otherUserId).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ChatMessageDto sendMessage(Long receiverId, String message) {
        User sender = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatMessage m = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .message(message)
                .build();
        m = chatMessageRepository.save(m);
        return toDto(m);
    }

    private ChatMessageDto toDto(ChatMessage m) {
        return ChatMessageDto.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getUsername())
                .receiverId(m.getReceiver().getId())
                .receiverName(m.getReceiver().getUsername())
                .message(m.getMessage())
                .timestamp(m.getTimestamp())
                .build();
    }
}
