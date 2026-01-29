package com.school.erp.repository;

import com.school.erp.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT m FROM ChatMessage m WHERE (m.sender.id = :userId OR m.receiver.id = :userId) " +
           "AND (m.sender.id = :otherId OR m.receiver.id = :otherId) ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversationBetweenUsers(@Param("userId") Long userId, @Param("otherId") Long otherId);
}
