package com.school.erp.config;

import com.school.erp.entity.Badge;
import com.school.erp.entity.User;
import com.school.erp.repository.BadgeRepository;
import com.school.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin created: username=admin, password=admin123");
        }
        if (badgeRepository.count() == 0) {
            badgeRepository.save(Badge.builder().name("Rising Star").description("Earned by reaching 100 points").pointsRequired(100).build());
            badgeRepository.save(Badge.builder().name("Academic Achiever").description("Earned by reaching 500 points").pointsRequired(500).build());
            badgeRepository.save(Badge.builder().name("Top Performer").description("Earned by reaching 1000 points").pointsRequired(1000).build());
            badgeRepository.save(Badge.builder().name("Scholar").description("Earned by reaching 2000 points").pointsRequired(2000).build());
            badgeRepository.save(Badge.builder().name("Legend").description("Earned by reaching 5000 points").pointsRequired(5000).build());
            System.out.println("Default badges created");
        }
    }
}
