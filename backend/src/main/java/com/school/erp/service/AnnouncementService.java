package com.school.erp.service;

import com.school.erp.dto.AnnouncementDto;
import com.school.erp.entity.Announcement;
import com.school.erp.entity.Employee;
import com.school.erp.entity.User;
import com.school.erp.repository.AnnouncementRepository;
import com.school.erp.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<AnnouncementDto> getByClassName(String className) {
        return announcementRepository.findByClassNameOrderByCreatedAtDesc(className).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnnouncementDto getById(Long id) {
        Announcement a = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found: " + id));
        return toDto(a);
    }

    @Transactional
    public AnnouncementDto create(Map<String, Object> body) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee createdBy = employeeRepository.findByUserId(user.getId()).orElse(null);

        Announcement a = Announcement.builder()
                .title((String) body.get("title"))
                .message((String) body.get("message"))
                .className((String) body.get("className"))
                .createdBy(createdBy)
                .build();
        a = announcementRepository.save(a);
        return toDto(a);
    }

    @Transactional
    public AnnouncementDto update(Long id, Map<String, Object> body) {
        Announcement a = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found: " + id));
        if (body.containsKey("title")) a.setTitle((String) body.get("title"));
        if (body.containsKey("message")) a.setMessage((String) body.get("message"));
        a = announcementRepository.save(a);
        return toDto(a);
    }

    @Transactional
    public void delete(Long id) {
        announcementRepository.deleteById(id);
    }

    private AnnouncementDto toDto(Announcement a) {
        return AnnouncementDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .message(a.getMessage())
                .className(a.getClassName())
                .createdById(a.getCreatedBy() != null ? a.getCreatedBy().getId() : null)
                .createdByName(a.getCreatedBy() != null ? a.getCreatedBy().getName() : null)
                .createdAt(a.getCreatedAt())
                .build();
    }
}
