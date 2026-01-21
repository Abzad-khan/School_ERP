package com.school.erp.service;

import com.school.erp.dto.AssignmentSubmissionDto;
import com.school.erp.entity.Assignment;
import com.school.erp.entity.AssignmentSubmission;
import com.school.erp.entity.Student;
import com.school.erp.entity.User;
import com.school.erp.repository.AssignmentRepository;
import com.school.erp.repository.AssignmentSubmissionRepository;
import com.school.erp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentSubmissionService {

    private final AssignmentSubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<AssignmentSubmissionDto> getByAssignmentId(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssignmentSubmissionDto getMySubmission(Long assignmentId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        return submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId())
                .map(this::toDto)
                .orElse(null);
    }

    @Transactional
    public AssignmentSubmissionDto submit(Long assignmentId, String fileUrl) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        AssignmentSubmission sub = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId())
                .orElse(null);
        if (sub != null) {
            sub.setFileUrl(fileUrl);
            sub = submissionRepository.save(sub);
        } else {
            sub = AssignmentSubmission.builder()
                    .assignment(assignment)
                    .student(student)
                    .fileUrl(fileUrl)
                    .build();
            sub = submissionRepository.save(sub);
        }
        return toDto(sub);
    }

    private AssignmentSubmissionDto toDto(AssignmentSubmission s) {
        return AssignmentSubmissionDto.builder()
                .id(s.getId())
                .assignmentId(s.getAssignment().getId())
                .studentId(s.getStudent().getId())
                .studentName(s.getStudent().getName())
                .rollNo(s.getStudent().getRollNo())
                .className(s.getStudent().getSchoolClass() != null ? s.getStudent().getSchoolClass().getClassName() : null)
                .fileUrl(s.getFileUrl())
                .submittedAt(s.getSubmittedAt())
                .build();
    }
}
