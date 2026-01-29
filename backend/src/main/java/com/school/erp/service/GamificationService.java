package com.school.erp.service;

import com.school.erp.dto.BadgeDto;
import com.school.erp.dto.GamificationDto;
import com.school.erp.dto.GamificationStatsDto;
import com.school.erp.entity.Gamification;
import com.school.erp.entity.Student;
import com.school.erp.repository.BadgeRepository;
import com.school.erp.repository.GamificationRepository;
import com.school.erp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final GamificationRepository gamificationRepository;
    private final BadgeRepository badgeRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<GamificationDto> getByClassName(String className) {
        return gamificationRepository.findByClassNameOrderByPointsDesc(className).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GamificationDto getById(Long id) {
        Gamification g = gamificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gamification record not found: " + id));
        return toDto(g);
    }

    @Transactional
    public GamificationDto create(Long studentId, String className, Integer points, String badges) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Gamification g = gamificationRepository.findByStudentIdAndClassName(studentId, className).orElse(null);
        if (g != null) {
            g.setPoints(points != null ? points : g.getPoints());
            g.setBadges(badges != null ? badges : g.getBadges());
            g = gamificationRepository.save(g);
        } else {
            g = Gamification.builder()
                    .student(student)
                    .className(className)
                    .points(points != null ? points : 0)
                    .badges(badges)
                    .build();
            g = gamificationRepository.save(g);
        }
        return toDto(g);
    }

    @Transactional
    public GamificationDto update(Long id, Integer points, String badges) {
        Gamification g = gamificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gamification record not found: " + id));
        if (points != null) g.setPoints(points);
        if (badges != null) g.setBadges(badges);
        g = gamificationRepository.save(g);
        return toDto(g);
    }

    @Transactional
    public void delete(Long id) {
        gamificationRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public GamificationStatsDto getStats(String className) {
        List<GamificationDto> leaderboard = getByClassName(className);
        long totalParticipants = leaderboard.size();
        List<BadgeDto> badges = badgeRepository.findAllByOrderByPointsRequiredAsc().stream()
                .map(b -> BadgeDto.builder().id(b.getId()).name(b.getName())
                        .description(b.getDescription()).pointsRequired(b.getPointsRequired()).build())
                .collect(Collectors.toList());
        int topScore = leaderboard.isEmpty() ? 0 : leaderboard.get(0).getPoints();
        return GamificationStatsDto.builder()
                .totalParticipants(totalParticipants)
                .availableBadges(badges.size())
                .topScore(topScore)
                .leaderboard(leaderboard)
                .badges(badges)
                .build();
    }

    private GamificationDto toDto(Gamification g) {
        return GamificationDto.builder()
                .id(g.getId())
                .studentId(g.getStudent().getId())
                .studentName(g.getStudent().getName())
                .rollNo(g.getStudent().getRollNo())
                .className(g.getClassName())
                .points(g.getPoints())
                .badges(g.getBadges())
                .build();
    }
}
