package com.school.erp.service;

import com.school.erp.dto.AssignmentDto;
import com.school.erp.entity.Assignment;
import com.school.erp.entity.Employee;
import com.school.erp.entity.User;
import com.school.erp.repository.AssignmentRepository;
import com.school.erp.repository.AssignmentSubmissionRepository;
import com.school.erp.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<AssignmentDto> getByClassName(String className) {
        return assignmentRepository.findByClassName(className).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssignmentDto getById(Long id) {
        Assignment a = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + id));
        return toDto(a);
    }

    @Transactional
    public AssignmentDto create(Map<String, Object> body, String attachmentUrl) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee createdBy = employeeRepository.findByUserId(user.getId()).orElse(null);

        Assignment a = Assignment.builder()
                .title((String) body.get("title"))
                .description((String) body.get("description"))
                .className((String) body.get("className"))
                .dueDate(LocalDate.parse((String) body.get("dueDate")))
                .attachmentUrl(attachmentUrl)
                .createdBy(createdBy)
                .build();
        a = assignmentRepository.save(a);
        return toDto(a);
    }

    @Transactional
    public AssignmentDto update(Long id, Map<String, Object> body, String attachmentUrl) {
        Assignment a = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + id));
        if (body.containsKey("title")) a.setTitle((String) body.get("title"));
        if (body.containsKey("description")) a.setDescription((String) body.get("description"));
        if (body.containsKey("dueDate")) a.setDueDate(LocalDate.parse((String) body.get("dueDate")));
        if (attachmentUrl != null) a.setAttachmentUrl(attachmentUrl);
        a = assignmentRepository.save(a);
        return toDto(a);
    }

    @Transactional
    public void delete(Long id) {
        assignmentRepository.deleteById(id);
    }

    private AssignmentDto toDto(Assignment a) {
        int submissionCount = submissionRepository.findByAssignmentId(a.getId()).size();
        return AssignmentDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .description(a.getDescription())
                .className(a.getClassName())
                .dueDate(a.getDueDate())
                .attachmentUrl(a.getAttachmentUrl())
                .createdById(a.getCreatedBy() != null ? a.getCreatedBy().getId() : null)
                .createdByName(a.getCreatedBy() != null ? a.getCreatedBy().getName() : null)
                .createdAt(a.getCreatedAt())
                .submissionCount(submissionCount)
                .build();
    }
}
