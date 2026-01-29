package com.school.erp.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GamificationStatsDto {
    private long totalParticipants;
    private long availableBadges;
    private int topScore;
    private List<GamificationDto> leaderboard;
    private List<BadgeDto> badges;
}
