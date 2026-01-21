package com.school.erp.service;

import com.school.erp.dto.BadgeDto;
import com.school.erp.entity.Badge;
import com.school.erp.repository.BadgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeRepository badgeRepository;

    @Transactional(readOnly = true)
    public List<BadgeDto> getAllBadges() {
        return badgeRepository.findAllByOrderByPointsRequiredAsc().stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public BadgeDto create(Map<String, Object> body) {
        Badge b = Badge.builder()
                .name((String) body.get("name"))
                .description((String) body.get("description"))
                .pointsRequired(((Number) body.get("pointsRequired")).intValue())
                .build();
        b = badgeRepository.save(b);
        return toDto(b);
    }

    @Transactional
    public BadgeDto update(Long id, Map<String, Object> body) {
        Badge b = badgeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Badge not found: " + id));
        if (body.containsKey("name")) b.setName((String) body.get("name"));
        if (body.containsKey("description")) b.setDescription((String) body.get("description"));
        if (body.containsKey("pointsRequired")) b.setPointsRequired(((Number) body.get("pointsRequired")).intValue());
        b = badgeRepository.save(b);
        return toDto(b);
    }

    @Transactional
    public void delete(Long id) {
        badgeRepository.deleteById(id);
    }

    private BadgeDto toDto(Badge b) {
        return BadgeDto.builder()
                .id(b.getId())
                .name(b.getName())
                .description(b.getDescription())
                .pointsRequired(b.getPointsRequired())
                .build();
    }
}
