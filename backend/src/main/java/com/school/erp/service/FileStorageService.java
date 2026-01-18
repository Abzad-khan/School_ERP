package com.school.erp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadPath;

    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String store(MultipartFile file, String subDir) throws IOException {
        if (file.isEmpty()) return null;
        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        if (ext == null) ext = "";
        String filename = UUID.randomUUID().toString() + (ext.isEmpty() ? "" : "." + ext);
        Path target = uploadPath.resolve(subDir).resolve(filename);
        Files.createDirectories(target.getParent());
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return "/api/files/" + subDir + "/" + filename;
    }

    public Path load(String subDir, String filename) {
        return uploadPath.resolve(subDir).resolve(filename).normalize();
    }
}
