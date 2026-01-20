package com.mbg.controller;

import com.mbg.entity.QualityCheck;
import com.mbg.service.QualityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/quality")
@RequiredArgsConstructor
public class QualityController {

    private final QualityService qualityService;

    @GetMapping
    public ResponseEntity<Page<QualityCheck>> getAllChecks(Pageable pageable) {
        return ResponseEntity.ok(qualityService.getAllChecks(pageable));
    }

    @PostMapping
    public ResponseEntity<QualityCheck> createCheck(@RequestBody QualityCheck check) {
        return ResponseEntity.ok(qualityService.createCheck(check));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheck(@PathVariable UUID id) {
        qualityService.deleteCheck(id);
        return ResponseEntity.noContent().build();
    }
}
