package com.school.erp.model;

import jakarta.persistence.*;

@Entity
public class Gamification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;

    private int points;

    private String badge;   // 👈 ADD THIS

    public Gamification() {}

    public Long getId() {
        return id;
    }

    public String getStudentName() {
        return studentName;
    }

    public int getPoints() {
        return points;
    }

    public String getBadge() {
        return badge;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }
}
