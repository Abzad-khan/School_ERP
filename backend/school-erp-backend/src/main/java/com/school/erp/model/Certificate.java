package com.school.erp.model;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;

    private String certificateType;

    private LocalDate issueDate;

    public Certificate() {}

    public Long getId() {
        return id;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getCertificateType() {
        return certificateType;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setCertificateType(String certificateType) {
        this.certificateType = certificateType;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }
}
