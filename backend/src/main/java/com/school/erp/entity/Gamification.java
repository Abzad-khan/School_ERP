package com.school.erp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gamification", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "class_name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gamification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "class_name", nullable = false)
    private String className;

    @Column(nullable = false)
    private Integer points;

    @Column(columnDefinition = "JSON")
    private String badges;
}
